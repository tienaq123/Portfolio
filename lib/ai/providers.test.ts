import { describe, expect, it } from "vitest";
import { resolveAiConfig } from "@/lib/env.server";
import { tokenLimit } from "./providers/openai";

const anthropic = { ANTHROPIC_API_KEY: "a-key", ANTHROPIC_MODEL: "claude-x" };
const openai = {
  OPENAI_API_KEY: "o-key",
  OPENAI_MODEL: "gpt-x",
  OPENAI_BASE_URL: "https://gateway.example.com/v1",
};

describe("resolveAiConfig", () => {
  it("is off without a complete key + model", () => {
    expect(resolveAiConfig({})).toBeNull();
    expect(resolveAiConfig({ OPENAI_API_KEY: "o-key" })).toBeNull();
  });

  it("uses whichever provider is configured, Anthropic first", () => {
    expect(resolveAiConfig(openai)?.provider).toBe("openai");
    expect(resolveAiConfig({ ...anthropic, ...openai })?.provider).toBe(
      "anthropic",
    );
  });

  it("follows AI_PROVIDER when both are configured", () => {
    const config = resolveAiConfig({
      ...anthropic,
      ...openai,
      AI_PROVIDER: "openai",
    });
    expect(config).toEqual({
      provider: "openai",
      apiKey: "o-key",
      model: "gpt-x",
      baseURL: "https://gateway.example.com/v1",
    });
  });

  it("never falls back to the other provider when one is named", () => {
    expect(resolveAiConfig({ ...openai, AI_PROVIDER: "anthropic" })).toBeNull();
  });
});

describe("tokenLimit", () => {
  it("uses max_completion_tokens for official OpenAI only", () => {
    expect(tokenLimit({ baseURL: undefined })).toHaveProperty(
      "max_completion_tokens",
    );
    expect(tokenLimit({ baseURL: "https://api.openai.com/v1" })).toHaveProperty(
      "max_completion_tokens",
    );
    expect(tokenLimit({ baseURL: "https://api.vilao.ai/v1" })).toHaveProperty(
      "max_tokens",
    );
  });
});
