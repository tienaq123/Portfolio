import { afterEach, describe, expect, it, vi } from "vitest";
import { adminCredentials, isAdminAuthorization } from "./auth";

const basic = (user: string, pass: string) =>
  `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

afterEach(() => vi.unstubAllEnvs());

describe("admin Basic auth", () => {
  it("is disabled without a long enough password", () => {
    vi.stubEnv("ADMIN_PASSWORD", "short");
    expect(adminCredentials()).toBeNull();
    expect(isAdminAuthorization(basic("admin", "short"))).toBe(false);
  });

  it("accepts only the exact username and password", () => {
    vi.stubEnv("ADMIN_PASSWORD", "a-long-admin-password");
    expect(isAdminAuthorization(basic("admin", "a-long-admin-password"))).toBe(
      true,
    );
    expect(isAdminAuthorization(basic("admin", "a-long-admin-passwordX"))).toBe(
      false,
    );
    expect(isAdminAuthorization(basic("root", "a-long-admin-password"))).toBe(
      false,
    );
    expect(isAdminAuthorization("Bearer a-long-admin-password")).toBe(false);
    expect(isAdminAuthorization(null)).toBe(false);
  });

  it("supports a custom username and colons in the password", () => {
    vi.stubEnv("ADMIN_USERNAME", "tien");
    vi.stubEnv("ADMIN_PASSWORD", "pass:with:colons");
    expect(isAdminAuthorization(basic("tien", "pass:with:colons"))).toBe(true);
  });
});
