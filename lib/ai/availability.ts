import "server-only";
import {
  aiConfig,
  chatMock,
  isProduction,
  upstashConfig,
} from "@/lib/env.server";

/**
 * The chat answers only when it can do so safely: a model is configured
 * (or the CI mock is on) and, in production, rate limiting is too — an
 * unlimited endpoint on a paid API is not an option.
 */
export function chatAvailable() {
  if (chatMock) return true;
  if (!aiConfig) return false;
  return !isProduction || upstashConfig !== null;
}
