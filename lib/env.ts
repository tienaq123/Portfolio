import { z } from "zod";

// Public env only. Server secrets (M6+) go in lib/env.server.ts behind `import "server-only"`.
const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const publicEnv = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.url().optional()),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.preprocess(
      emptyToUndefined,
      z.uuid().optional(),
    ),
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: z.preprocess(
      emptyToUndefined,
      z.url().default("https://cloud.umami.is/script.js"),
    ),
  })
  .parse({
    // Referenced literally so Next.js can inline NEXT_PUBLIC_* values at build time.
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  });

/**
 * Umami runs only in production builds with a website ID, and never on
 * Vercel preview deployments, so dev and previews don't pollute the stats.
 */
export const umami =
  publicEnv.NEXT_PUBLIC_UMAMI_WEBSITE_ID &&
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview"
    ? {
        websiteId: publicEnv.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
        scriptUrl: publicEnv.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
      }
    : null;

/** Canonical origin: explicit URL in production, the deployment URL on previews, else localhost. */
export const siteUrl =
  publicEnv.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
