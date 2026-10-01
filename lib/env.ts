import { z } from "zod";

// Public env only. Server secrets (M6+) go in lib/env.server.ts behind `import "server-only"`.
const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const publicEnv = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  })
  .parse({
    // Referenced literally so Next.js can inline NEXT_PUBLIC_* values at build time.
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

/** Canonical origin: explicit URL in production, the deployment URL on previews, else localhost. */
export const siteUrl =
  publicEnv.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
