import { randomUUID } from "node:crypto";
import { after } from "next/server";
import type { AnswerResult, AnswerStream } from "@/lib/ai/answer";
import { chatAvailable } from "@/lib/ai/availability";
import { modelAnswer } from "@/lib/ai/client";
import { FALLBACK, isFallback } from "@/lib/ai/fallback";
import { toSources } from "@/lib/ai/knowledge";
import { createLeakGuard } from "@/lib/ai/leak-guard";
import { mockAnswer } from "@/lib/ai/mock";
import { saveQuestion } from "@/lib/ai/questions";
import { limitQuestion, visitorKey } from "@/lib/ai/rate-limit";
import { chatRequestSchema } from "@/lib/ai/request";
import { CANARY } from "@/lib/ai/system-prompt";
import type { ChatErrorCode, ChatEvent } from "@/lib/chat/types";
import { chatMock } from "@/lib/env.server";

/*
 * POST /api/chat → NDJSON stream of ChatEvent (lib/chat/types.ts):
 * text deltas, then one `done` with the sources and the question id.
 * Errors before the stream starts are plain JSON with a status code.
 */

const TIMEOUT_MS = 30_000;

function fail(status: number, code: ChatErrorCode, headers?: HeadersInit) {
  return Response.json(
    { error: code },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

export async function POST(request: Request) {
  if (!chatAvailable()) return fail(503, "unavailable");

  const body: unknown = await request.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return fail(400, "invalid");
  const { messages, locale, sessionId } = parsed.data;
  const question = messages.at(-1)?.content ?? "";

  const limit =
    chatMock && question.includes("__ratelimit__")
      ? { ok: false as const, retryAfter: 60 }
      : await limitQuestion(visitorKey(request));
  if (limit && !limit.ok) {
    return fail(429, "rate_limited", { "Retry-After": `${limit.retryAfter}` });
  }

  const questionId = randomUUID();
  const signal = AbortSignal.any([
    request.signal,
    AbortSignal.timeout(TIMEOUT_MS),
  ]);
  const answer: AnswerStream = (chatMock ? mockAnswer : modelAnswer)({
    messages,
    locale,
    signal,
  });

  // Resolved by the stream; stored after the response so it never slows it.
  let finish: (row: { sources: string[]; fallback: boolean } | null) => void;
  const finished = new Promise<{ sources: string[]; fallback: boolean } | null>(
    (resolve) => (finish = resolve),
  );
  after(async () => {
    const row = await finished;
    if (!row) return;
    await saveQuestion({
      id: questionId,
      sessionId,
      question,
      locale,
      sources: row.sources,
      wasFallback: row.fallback,
    });
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatEvent) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // The visitor closed the chat; nothing left to send to.
        }
      };
      const guard = createLeakGuard(CANARY);
      let text = "";
      try {
        let step = await answer.next();
        while (!step.done) {
          text += step.value;
          const safe = guard.push(step.value);
          if (guard.leaked) break;
          if (safe) send({ type: "text", text: safe });
          step = await answer.next();
        }

        let result: AnswerResult = { usedIds: [] };
        if (guard.leaked) {
          // The model tried to print the prompt marker: stop, answer safely.
          await answer.return({ usedIds: [] });
          text = FALLBACK[locale];
          send({ type: "text", text: `\n\n${text}` });
          console.warn("[chat] canary in the answer; stream stopped");
        } else {
          const rest = guard.flush();
          if (rest) send({ type: "text", text: rest });
          if (step.done) result = step.value;
        }

        const fallback = isFallback(text);
        const sources = fallback ? [] : await toSources(result.usedIds, locale);
        send({ type: "done", questionId, sources, fallback });
        finish({ sources: sources.map((source) => source.id), fallback });
      } catch (error) {
        console.error("[chat] answer failed:", error);
        send({ type: "error", code: "failed" });
        finish(null);
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed by a disconnect.
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
