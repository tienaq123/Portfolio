import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getCaseStudySlugs } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import { languageAlternates, localizedPath } from "@/lib/seo/metadata";

const absolute = (path: string) => new URL(path, siteUrl).toString();

/** Every public page in every locale, each listing its language alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getCaseStudySlugs();
  const paths = ["", "/work", ...slugs.map((slug) => `/work/${slug}`)];

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, href]) => [
        lang,
        absolute(href),
      ]),
    );
    return locales.map((locale) => ({
      url: absolute(localizedPath(locale, path)),
      alternates: { languages },
    }));
  });
}
