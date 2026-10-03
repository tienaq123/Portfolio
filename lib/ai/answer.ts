import type { Locale } from "@/i18n/config";
import type { ChatTurn } from "@/lib/chat/types";

export type AnswerInput = {
  messages: ChatTurn[];
  locale: Locale;
  signal: AbortSignal;
};

/** What the answer was based on: knowledge ids fetched through get_details. */
export type AnswerResult = { usedIds: string[] };

/** Yields text deltas, returns the ids it used. */
export type AnswerStream = AsyncGenerator<string, AnswerResult, undefined>;
