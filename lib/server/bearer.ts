import "server-only";
import { timingSafeEqual } from "node:crypto";

/** Constant-time check of `Authorization: Bearer <secret>`. */
export function hasBearer(request: Request, secret: string) {
  const header = request.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
