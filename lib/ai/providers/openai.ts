import "server-only";
import OpenAI from "openai";
import type {
  ChatCompletionChunk,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import type { AiConfig } from "@/lib/env.server";
import type { AnswerInput, AnswerStream } from "../answer";
import {
  buildContext,
  detailsTool,
  MAX_OUTPUT_TOKENS,
  parseToolArguments,
  runDetailsTool,
} from "../context";

/*
 * OpenAI Chat Completions API: official OpenAI, or any OpenAI-compatible
 * gateway (OPENAI_BASE_URL), e.g. a third party that serves Claude models.
 * Same flow as the Anthropic provider: one call with the tool, then one
 * with the results and tool_choice "none". Both stream.
 */

const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: detailsTool.name,
    description: detailsTool.description,
    parameters: detailsTool.parameters,
  },
};

/**
 * Official OpenAI deprecated max_tokens (newer models reject it); many
 * compatible gateways only know max_tokens.
 */
export function tokenLimit(config: Pick<AiConfig, "baseURL">) {
  const official =
    !config.baseURL || new URL(config.baseURL).hostname === "api.openai.com";
  return official
    ? { max_completion_tokens: MAX_OUTPUT_TOKENS }
    : { max_tokens: MAX_OUTPUT_TOKENS };
}

let cached: { key: string; client: OpenAI } | undefined;

function clientFor(config: AiConfig) {
  const key = `${config.baseURL ?? ""}|${config.apiKey}`;
  if (cached?.key !== key) {
    cached = {
      key,
      client: new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        maxRetries: 1,
      }),
    };
  }
  return cached.client;
}

type PendingCall = { id: string; name: string; arguments: string };

/** Streams text deltas; collects tool calls, which arrive in fragments. */
async function* streamText(
  stream: AsyncIterable<ChatCompletionChunk>,
  calls: Map<number, PendingCall>,
) {
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;
    if (!delta) continue;
    if (delta.content) yield delta.content;
    for (const call of delta.tool_calls ?? []) {
      const pending = calls.get(call.index) ?? {
        id: "",
        name: "",
        arguments: "",
      };
      if (call.id) pending.id = call.id;
      if (call.function?.name) pending.name += call.function.name;
      if (call.function?.arguments) {
        pending.arguments += call.function.arguments;
      }
      calls.set(call.index, pending);
    }
  }
}

export async function* openaiAnswer(
  config: AiConfig,
  { messages, locale, signal }: AnswerInput,
): AnswerStream {
  const client = clientFor(config);
  const { system, hint } = await buildContext(locale);
  // One system message; the per-request hint goes last so the long prefix
  // stays identical across visitors (automatic prompt caching).
  const history: ChatCompletionMessageParam[] = [
    { role: "system", content: `${system}\n\n${hint}` },
    ...messages,
  ];
  const base: Omit<ChatCompletionCreateParamsStreaming, "messages"> = {
    model: config.model,
    stream: true,
    tools: [tool],
    ...tokenLimit(config),
  };

  const calls = new Map<number, PendingCall>();
  yield* streamText(
    await client.chat.completions.create(
      { ...base, messages: history },
      { signal },
    ),
    calls,
  );
  const toolCalls = [...calls.values()].filter(
    (call) => call.name === detailsTool.name,
  );
  if (toolCalls.length === 0) return { usedIds: [] };

  const usedIds: string[] = [];
  const results: ChatCompletionMessageParam[] = [];
  for (const call of toolCalls) {
    const details = await runDetailsTool(parseToolArguments(call.arguments));
    usedIds.push(...details.ids);
    results.push({
      role: "tool",
      tool_call_id: call.id,
      content: details.text,
    });
  }
  const assistantCalls: ChatCompletionMessageToolCall[] = toolCalls.map(
    (call) => ({
      id: call.id,
      type: "function",
      function: { name: call.name, arguments: call.arguments || "{}" },
    }),
  );

  yield* streamText(
    await client.chat.completions.create(
      {
        ...base,
        tool_choice: "none",
        messages: [
          ...history,
          { role: "assistant", content: null, tool_calls: assistantCalls },
          ...results,
        ],
      },
      { signal },
    ),
    new Map(),
  );
  return { usedIds: [...new Set(usedIds)] };
}
