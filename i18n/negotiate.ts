import { defaultLocale, hasLocale, type Locale } from "./config";

/**
 * Picks the best supported locale from an Accept-Language header.
 * Only the primary subtag is compared ("vi-VN" → "vi"), which is enough for en/vi.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const quality = params.find((param) => param.trim().startsWith("q="));
      return {
        language: tag.trim().toLowerCase().split("-")[0],
        q: quality ? Number(quality.trim().slice(2)) : 1,
      };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { language } of ranked) {
    if (hasLocale(language)) return language;
  }
  return defaultLocale;
}
