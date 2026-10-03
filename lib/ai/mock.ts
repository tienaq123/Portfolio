import "server-only";
import type { AnswerInput, AnswerStream } from "./answer";
import { FALLBACK } from "./fallback";

/*
 * Canned answers for E2E tests and CI (CHAT_MOCK=1, never in production).
 * Magic words in the question drive the failure paths:
 *   __error__     → the stream fails mid-answer
 *   __fallback__  → the "not enough information" answer
 * (__ratelimit__ is handled by the route, before any answer starts.)
 */

const ANSWERS = {
  en: "Tiến designed and built the **Readiness Engine** for Prep4u: it scores SAT readiness and predicts the final score, using a Wilson lower bound with Bayesian smoothing so a few lucky answers cannot inflate it.",
  vi: "Tiến đã thiết kế và xây dựng **Readiness Engine** cho Prep4u: hệ thống chấm mức sẵn sàng thi SAT và dự đoán điểm, dùng Wilson lower bound kết hợp Bayesian smoothing để vài câu trả lời may mắn không làm điểm bị ảo.",
};

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });

export async function* mockAnswer({
  messages,
  locale,
  signal,
}: AnswerInput): AnswerStream {
  const question = messages.at(-1)?.content ?? "";
  const fallback = question.includes("__fallback__");
  const text = fallback
    ? `${FALLBACK[locale]} buihuutien2002@gmail.com`
    : ANSWERS[locale];

  for (const [index, chunk] of (text.match(/[\s\S]{1,16}/gu) ?? []).entries()) {
    if (signal.aborted) break;
    if (index === 4 && question.includes("__error__")) {
      throw new Error("Mock failure");
    }
    await wait(20, signal);
    yield chunk;
  }
  return {
    usedIds: fallback ? [] : ["project:prep4u", "knowledge:principles"],
  };
}
