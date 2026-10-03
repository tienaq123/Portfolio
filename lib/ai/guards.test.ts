import { describe, expect, it } from "vitest";
import { FALLBACK, isFallback } from "./fallback";
import { createLeakGuard } from "./leak-guard";
import { chatRequestSchema } from "./request";

describe("createLeakGuard", () => {
  const secret = "CNRY-1234-ABCD";

  it("passes normal text through, holding back only the tail", () => {
    const guard = createLeakGuard(secret);
    const out = ["Tiến built ", "the Readiness Engine ", "for Prep4u."]
      .map((delta) => guard.push(delta))
      .join("");
    expect(out + guard.flush()).toBe(
      "Tiến built the Readiness Engine for Prep4u.",
    );
    expect(guard.leaked).toBe(false);
  });

  it("never emits the secret, even split across deltas", () => {
    const guard = createLeakGuard(secret);
    const deltas = ["Sure: CN", "RY-12", "34-AB", "CD and more"];
    const out =
      deltas.map((delta) => guard.push(delta)).join("") + guard.flush();
    expect(guard.leaked).toBe(true);
    expect(out).not.toContain("CNRY");
    expect(out).not.toContain(secret);
  });
});

describe("isFallback", () => {
  it("matches both languages, whatever the apostrophe", () => {
    expect(isFallback(`${FALLBACK.vi} Bạn có thể email.`)).toBe(true);
    expect(isFallback(FALLBACK.en.replace("'", "’"))).toBe(true);
    expect(isFallback("Tiến built the Readiness Engine.")).toBe(false);
  });

  it("ignores how the sentence ends", () => {
    const body = FALLBACK.vi.slice(0, -1);
    expect(isFallback(`${body} — thông tin cá nhân không được chia sẻ.`)).toBe(
      true,
    );
    expect(isFallback(`${FALLBACK.en.slice(0, -1)}, sorry!`)).toBe(true);
  });
});

describe("chatRequestSchema", () => {
  const sessionId = "4f1c2a5e-6b7d-4c8e-9f0a-1b2c3d4e5f60";
  const ask = (content: string) => ({
    messages: [{ role: "user", content }],
    locale: "en",
    sessionId,
  });

  it("accepts a question with history", () => {
    const result = chatRequestSchema.safeParse({
      messages: [
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello" },
        { role: "user", content: "What did he build?" },
      ],
      locale: "vi",
      sessionId,
    });
    expect(result.success).toBe(true);
  });

  it("rejects long questions, bad roles and bad ids", () => {
    expect(chatRequestSchema.safeParse(ask("a".repeat(501))).success).toBe(
      false,
    );
    expect(
      chatRequestSchema.safeParse({
        ...ask("x"),
        messages: [{ role: "assistant", content: "x" }],
      }).success,
    ).toBe(false);
    expect(
      chatRequestSchema.safeParse({
        ...ask("x"),
        messages: [
          { role: "user", content: "a" },
          { role: "user", content: "b" },
        ],
      }).success,
    ).toBe(false);
    expect(
      chatRequestSchema.safeParse({ ...ask("x"), sessionId: "1" }).success,
    ).toBe(false);
    expect(
      chatRequestSchema.safeParse({ ...ask("x"), locale: "fr" }).success,
    ).toBe(false);
  });
});
