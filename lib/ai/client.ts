import "server-only";
import { aiConfig } from "@/lib/env.server";
import type { AnswerInput, AnswerStream } from "./answer";
import { anthropicAnswer } from "./providers/anthropic";
import { openaiAnswer } from "./providers/openai";

/**
 * The model behind the assistant, chosen by env (AI_PROVIDER and the
 * provider's key, model and optional base URL — see lib/env.server.ts).
 */
export function modelAnswer(input: AnswerInput): AnswerStream {
  if (!aiConfig) throw new Error("No AI provider is configured");
  return aiConfig.provider === "openai"
    ? openaiAnswer(aiConfig, input)
    : anthropicAnswer(aiConfig, input);
}
