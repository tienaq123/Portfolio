import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must not compete with production in search results.
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        ...locales.map((locale) => `/${locale}/styleguide`),
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
