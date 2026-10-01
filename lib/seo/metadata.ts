import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

const ogLocales: Record<Locale, string> = { en: "en_US", vi: "vi_VN" };

/** Locale-prefixed path; `path` is "" for the homepage, else starts with "/". */
export const localizedPath = (locale: Locale, path = "") => `/${locale}${path}`;

/** hreflang map for one page: every locale plus `x-default` → the default locale. */
export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, localizedPath(locale, path)]),
    ),
    "x-default": localizedPath(defaultLocale, path),
  };
}

type PageMetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  siteName: string;
  type?: "website" | "article";
};

/**
 * Canonical, hreflang alternates, Open Graph and Twitter card for a page.
 * Paths are relative; the root layout's `metadataBase` makes them absolute.
 * Images come from the nearest `opengraph-image` file.
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  siteName,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = localizedPath(locale, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName,
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => ogLocales[other]),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
