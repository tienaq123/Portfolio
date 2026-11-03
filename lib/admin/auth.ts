import { timingSafeEqual } from "node:crypto";

/*
 * The owner-only dashboard (/admin) sits behind HTTP Basic auth over HTTPS:
 * one person, no accounts, no Supabase Auth (sign-ups are off). Without
 * ADMIN_PASSWORD the dashboard does not exist (404).
 * Used by proxy.ts and again by the page and its actions.
 */

const MIN_PASSWORD_LENGTH = 12;

let warned = false;

export function adminCredentials() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (password.length < MIN_PASSWORD_LENGTH) {
    if (password && !warned) {
      warned = true;
      console.warn(
        `[admin] ADMIN_PASSWORD is shorter than ${MIN_PASSWORD_LENGTH} characters: /admin stays disabled (404).`,
      );
    }
    return null;
  }
  return { username: process.env.ADMIN_USERNAME || "admin", password };
}

const same = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

/** Checks an `Authorization: Basic …` header in constant time. */
export function isAdminAuthorization(header: string | null) {
  const credentials = adminCredentials();
  if (!credentials || !header?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const separator = decoded.indexOf(":");
  if (separator < 0) return false;
  // Evaluate both so timing does not reveal which part was wrong.
  const user = same(decoded.slice(0, separator), credentials.username);
  const pass = same(decoded.slice(separator + 1), credentials.password);
  return user && pass;
}
