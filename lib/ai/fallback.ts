import type { Locale } from "@/i18n/config";

/** The exact sentence the assistant opens with when it cannot answer. */
export const FALLBACK: Record<Locale, string> = {
  en: "I don't have enough information in Tien's portfolio to answer that accurately.",
  vi: "Mình chưa có đủ thông tin trong portfolio của Tiến để trả lời chính xác câu này.",
};

const normalize = (text: string) =>
  text.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");

/**
 * True when the answer contains either fallback sentence. The final full
 * stop is ignored: models often continue the sentence with a dash or comma.
 */
export function isFallback(text: string) {
  const answer = normalize(text);
  return Object.values(FALLBACK).some((sentence) =>
    answer.includes(normalize(sentence).replace(/[.!]$/, "")),
  );
}
