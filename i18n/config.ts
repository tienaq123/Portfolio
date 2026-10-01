export const locales = ["en", "vi"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Written by the language switcher; read by the proxy when redirecting `/`. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Each language is labelled in its own language, so it never needs translating. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export function hasLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
