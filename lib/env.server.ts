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
    ANTHROPIC_API_KEY: optional(z.string().min(1)),
    ANTHROPIC_MODEL: optional(z.string().min(1)),
    UPSTASH_REDIS_REST_URL: optional(z.url()),
    UPSTASH_REDIS_REST_TOKEN: optional(z.string().min(1)),
    NEXT_PUBLIC_SUPABASE_URL: optional(z.url()),
    SUPABASE_SECRET_KEY: optional(z.string().min(1)),
    CRON_SECRET: optional(z.string().min(16)),
    CHAT_MOCK: optional(z.enum(["1"])),
  })
  .parse({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
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

export const anthropicConfig =
  env.ANTHROPIC_API_KEY && env.ANTHROPIC_MODEL
    ? { apiKey: env.ANTHROPIC_API_KEY, model: env.ANTHROPIC_MODEL }
    : null;

export const upstashConfig =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? { url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }
    : null;

export const supabaseConfig =
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SECRET_KEY
    ? { url: env.NEXT_PUBLIC_SUPABASE_URL, secretKey: env.SUPABASE_SECRET_KEY }
    : null;

export const cronSecret = env.CRON_SECRET ?? null;
