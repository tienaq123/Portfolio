import "server-only";
import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { upstashConfig } from "@/lib/env.server";

/*
 * Per-visitor limits in Upstash Redis (D10: in-memory limits do not work on
 * serverless). Keys are a hash of the IP, never the IP itself. Starting
 * values from the plan; tune once there is real traffic.
 */

type Limiters = { burst: Ratelimit; daily: Ratelimit; feedback: Ratelimit };

let limiters: Limiters | undefined;

function getLimiters(): Limiters | null {
  if (!upstashConfig) return null;
  if (!limiters) {
    const redis = new Redis(upstashConfig);
    limiters = {
      burst: new Ratelimit({
        redis,
        prefix: "chat:burst",
        limiter: Ratelimit.slidingWindow(10, "10 m"),
      }),
      daily: new Ratelimit({
        redis,
        prefix: "chat:daily",
        limiter: Ratelimit.fixedWindow(40, "1 d"),
      }),
      feedback: new Ratelimit({
        redis,
        prefix: "chat:feedback",
        limiter: Ratelimit.slidingWindow(20, "10 m"),
      }),
    };
  }
  return limiters;
}

/** Hashed client IP (Vercel sets x-forwarded-for). */
export function visitorKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0];
  const ip = forwarded?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`portfolio-chat:${ip}`).digest("hex");
}

export type LimitResult = { ok: true } | { ok: false; retryAfter: number };

const retryAfter = (reset: number) =>
  Math.max(1, Math.ceil((reset - Date.now()) / 1000));

/** null = rate limiting is not configured. */
export async function limitQuestion(key: string): Promise<LimitResult | null> {
  const current = getLimiters();
  if (!current) return null;
  const [burst, daily] = await Promise.all([
    current.burst.limit(key),
    current.daily.limit(key),
  ]);
  if (!burst.success) return { ok: false, retryAfter: retryAfter(burst.reset) };
  if (!daily.success) return { ok: false, retryAfter: retryAfter(daily.reset) };
  return { ok: true };
}

export async function limitFeedback(key: string): Promise<LimitResult | null> {
  const current = getLimiters();
  if (!current) return null;
  const result = await current.feedback.limit(key);
  return result.success
    ? { ok: true }
    : { ok: false, retryAfter: retryAfter(result.reset) };
}
