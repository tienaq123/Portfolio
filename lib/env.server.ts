import "server-only";
import { z } from "zod";

// Server-only configuration (M6). Every integration is optional: a missing
// value turns that feature off; production refuses to run the chat unless
// it is fully configured (see lib/ai/availability.ts).
const empty = (value: unknown) => (value === "" ? undefined : value);
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(empty, schema.optional());

const env = z
  .object({
    AI_PROVIDER: optional(z.enum(["anthropic", "openai"])),
    ANTHROPIC_API_KEY: optional(z.string().min(1)),
    ANTHROPIC_MODEL: optional(z.string().min(1)),
    ANTHROPIC_BASE_URL: optional(z.url()),
    OPENAI_API_KEY: optional(z.string().min(1)),
    OPENAI_MODEL: optional(z.string().min(1)),
    OPENAI_BASE_URL: optional(z.url()),
    UPSTASH_REDIS_REST_URL: optional(z.url()),
    UPSTASH_REDIS_REST_TOKEN: optional(z.string().min(1)),
    NEXT_PUBLIC_SUPABASE_URL: optional(z.url()),
    SUPABASE_SECRET_KEY: optional(z.string().min(1)),
    CRON_SECRET: optional(z.string().min(16)),
    CHAT_MOCK: optional(z.enum(["1"])),
  })
  .parse({
    AI_PROVIDER: process.env.AI_PROVIDER,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
    ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    CRON_SECRET: process.env.CRON_SECRET,
    CHAT_MOCK: process.env.CHAT_MOCK,
  });

export const isProduction = process.env.VERCEL_ENV === "production";

/** Canned answers for tests and CI; never honoured in production. */
export const chatMock = env.CHAT_MOCK === "1" && !isProduction;

export const aiConfig = resolveAiConfig(env);

export const upstashConfig =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? { url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }
    : null;

export const supabaseConfig =
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SECRET_KEY
    ? { url: env.NEXT_PUBLIC_SUPABASE_URL, secretKey: env.SUPABASE_SECRET_KEY }
    : null;

export const cronSecret = env.CRON_SECRET ?? null;

export type AiProvider = "anthropic" | "openai";

/**
 * The model the assistant talks to. Two families, switched with env only:
 * - "anthropic": Anthropic Messages API (official, or a compatible proxy
 *   through ANTHROPIC_BASE_URL).
 * - "openai": OpenAI Chat Completions API — official OpenAI, or any
 *   OpenAI-compatible gateway through OPENAI_BASE_URL.
 * AI_PROVIDER picks one; without it, whichever is configured (Anthropic
 * first). A provider named but not configured disables the assistant
 * rather than silently using the other one.
 */
export type AiConfig = {
  provider: AiProvider;
  apiKey: string;
  model: string;
  baseURL: string | undefined;
};

type AiEnv = {
  AI_PROVIDER?: AiProvider | undefined;
  ANTHROPIC_API_KEY?: string | undefined;
  ANTHROPIC_MODEL?: string | undefined;
  ANTHROPIC_BASE_URL?: string | undefined;
  OPENAI_API_KEY?: string | undefined;
  OPENAI_MODEL?: string | undefined;
  OPENAI_BASE_URL?: string | undefined;
};

export function resolveAiConfig(values: AiEnv): AiConfig | null {
  const anthropic: AiConfig | null =
    values.ANTHROPIC_API_KEY && values.ANTHROPIC_MODEL
      ? {
          provider: "anthropic",
          apiKey: values.ANTHROPIC_API_KEY,
          model: values.ANTHROPIC_MODEL,
          baseURL: values.ANTHROPIC_BASE_URL,
        }
      : null;
  const openai: AiConfig | null =
    values.OPENAI_API_KEY && values.OPENAI_MODEL
      ? {
          provider: "openai",
          apiKey: values.OPENAI_API_KEY,
          model: values.OPENAI_MODEL,
          baseURL: values.OPENAI_BASE_URL,
        }
      : null;
  if (values.AI_PROVIDER === "anthropic") return anthropic;
  if (values.AI_PROVIDER === "openai") return openai;
  return anthropic ?? openai;
}
