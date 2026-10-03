import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  MessageStreamParams,
  TextBlockParam,
  Tool,
  ToolResultBlockParam,
  ToolUseBlock,
} from "@anthropic-ai/sdk/resources/messages/messages";
import type { AiConfig } from "@/lib/env.server";
import type { AnswerInput, AnswerStream } from "../answer";
import {
  buildContext,
  detailsTool,
  MAX_OUTPUT_TOKENS,
  runDetailsTool,
} from "../context";

/*
 * Anthropic Messages API: official, or an Anthropic-compatible proxy through
 * ANTHROPIC_BASE_URL. One call with the tool, then (if used) one call with
 * the results and tool_choice "none" — at most one tool round. Both stream.
 */

const tool: Tool = {
  name: detailsTool.name,
  description: detailsTool.description,
  input_schema: detailsTool.parameters,
};

let cached: { key: string; client: Anthropic } | undefined;

function clientFor(config: AiConfig) {
  const key = `${config.baseURL ?? ""}|${config.apiKey}`;
  if (cached?.key !== key) {
    cached = {
      key,
      client: new Anthropic({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
        maxRetries: 1,
      }),
    };
  }
  return cached.client;
}

async function* streamText(
  client: Anthropic,
  params: MessageStreamParams,
  signal: AbortSignal,
) {
  const stream = client.messages.stream(params, { signal });
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
  return stream.finalMessage();
}

export async function* anthropicAnswer(
  config: AiConfig,
  { messages, locale, signal }: AnswerInput,
): AnswerStream {
  const client = clientFor(config);
  const { system, hint } = await buildContext(locale);
  const systemBlocks: TextBlockParam[] = [
    // Same for every visitor: cached when long enough for the model.
    { type: "text", text: system, cache_control: { type: "ephemeral" } },
    { type: "text", text: hint },
  ];
  const history: MessageParam[] = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  const base = {
    model: config.model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: systemBlocks,
    tools: [tool],
  };

  const first = yield* streamText(
    client,
    { ...base, messages: history },
    signal,
  );
  const toolUses = first.content.filter(
    (block): block is ToolUseBlock => block.type === "tool_use",
  );
  if (first.stop_reason !== "tool_use" || toolUses.length === 0) {
    return { usedIds: [] };
  }

  const usedIds: string[] = [];
  const results: ToolResultBlockParam[] = [];
  for (const use of toolUses) {
    const details = await runDetailsTool(use.input);
    usedIds.push(...details.ids);
    results.push({
      type: "tool_result",
      tool_use_id: use.id,
      content: details.text,
    });
  }

  yield* streamText(
    client,
    {
      ...base,
      tool_choice: { type: "none" },
      messages: [
        ...history,
        { role: "assistant", content: first.content },
        { role: "user", content: results },
      ],
    },
    signal,
  );
  return { usedIds: [...new Set(usedIds)] };
}
