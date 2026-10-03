import "server-only";
import type { Locale } from "@/i18n/config";
import { getSiteProfile } from "@/lib/content";
import { getCompactIndex, getDetails, MAX_DETAIL_IDS } from "./knowledge";
import { buildSystemPrompt, DETAILS_TOOL, localeHint } from "./system-prompt";

/*
 * What every provider sends: the same prompt, the same get_details tool and
 * the same tool execution. Providers only translate it to their API.
 */

/** Hard cap on the answer length, for both calls of a question. */
export const MAX_OUTPUT_TOKENS = 700;

export const detailsTool = {
  name: DETAILS_TOOL,
  description:
    "Fetch the full details of records from the knowledge index about Tiến. Call it once, before answering, with the ids of every record you will rely on.",
  parameters: {
    type: "object" as const,
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

/** Stable system prompt (cacheable) and the per-request locale hint. */
export async function buildContext(locale: Locale) {
  const [index, profile] = await Promise.all([
    getCompactIndex(),
    getSiteProfile("en"),
  ]);
  return {
    system: buildSystemPrompt({ index, email: profile.links.email }),
    hint: localeHint(locale),
  };
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

/** Runs get_details for a tool call; bad input yields an empty result. */
export function runDetailsTool(input: unknown) {
  return getDetails(idsFrom(input));
}

/** Tool arguments arrive as JSON text from OpenAI-style APIs. */
export function parseToolArguments(text: string): unknown {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}
