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
import { getSiteProfile } from "@/lib/content";
import { anthropicConfig } from "@/lib/env.server";
import type { AnswerInput, AnswerStream } from "./answer";
import { getCompactIndex, getDetails, MAX_DETAIL_IDS } from "./knowledge";
import { buildSystemPrompt, DETAILS_TOOL, localeHint } from "./system-prompt";

/*
 * The only place that talks to Claude. Model and key come from env (D6).
 * Flow: one call with the get_details tool, then (if the model used it) one
 * more call with the tool results and tool_choice "none" — at most one tool
 * round per question. Both calls stream, so text reaches the visitor early.
 */

const MAX_OUTPUT_TOKENS = 700;

const detailsTool: Tool = {
  name: DETAILS_TOOL,
  description:
    "Fetch the full details of records from the knowledge index about Tiến. Call it once, before answering, with the ids of every record you will rely on.",
  input_schema: {
    type: "object",
    properties: {
      ids: {
        type: "array",
        items: { type: "string" },
        maxItems: MAX_DETAIL_IDS,
        description: `Record ids from the index, e.g. "project:prep4u". At most ${MAX_DETAIL_IDS}.`,
      },
    },
    required: ["ids"],
  },
};

let client: Anthropic | undefined;

function getClient() {
  if (!anthropicConfig) throw new Error("Anthropic is not configured");
  client ??= new Anthropic({ apiKey: anthropicConfig.apiKey, maxRetries: 1 });
  return client;
}

function idsFrom(input: unknown): string[] {
  if (typeof input !== "object" || input === null || !("ids" in input)) {
    return [];
  }
  const { ids } = input;
  return Array.isArray(ids)
    ? ids.filter((id): id is string => typeof id === "string")
    : [];
}

async function* streamText(params: MessageStreamParams, signal: AbortSignal) {
  const stream = getClient().messages.stream(params, { signal });
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

export async function* claudeAnswer({
  messages,
  locale,
  signal,
}: AnswerInput): AnswerStream {
  if (!anthropicConfig) throw new Error("Anthropic is not configured");
  const [index, profile] = await Promise.all([
    getCompactIndex(),
    getSiteProfile("en"),
  ]);

  const system: TextBlockParam[] = [
    {
      type: "text",
      text: buildSystemPrompt({ index, email: profile.links.email }),
      // Same for every visitor: cached when long enough for the model.
      cache_control: { type: "ephemeral" },
    },
    { type: "text", text: localeHint(locale) },
  ];
  const history: MessageParam[] = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  const base = {
    model: anthropicConfig.model,
    max_tokens: MAX_OUTPUT_TOKENS,
    system,
    tools: [detailsTool],
  };

  const first = yield* streamText({ ...base, messages: history }, signal);
  const toolUses = first.content.filter(
    (block): block is ToolUseBlock => block.type === "tool_use",
  );
  if (first.stop_reason !== "tool_use" || toolUses.length === 0) {
    return { usedIds: [] };
  }

  const usedIds: string[] = [];
  const results: ToolResultBlockParam[] = [];
  for (const use of toolUses) {
    const details = await getDetails(idsFrom(use.input));
    usedIds.push(...details.ids);
    results.push({
      type: "tool_result",
      tool_use_id: use.id,
      content: details.text,
    });
  }

  yield* streamText(
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
