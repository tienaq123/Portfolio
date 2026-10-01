import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // The root layout sits under the dynamic [locale] segment, so unmatched URLs
    // need app/global-not-found.tsx (see Next.js not-found docs).
    globalNotFound: true,
  },
};

export default nextConfig;
