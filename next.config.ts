import type { NextConfig } from "next";

// Baseline hardening for every response. A CSP comes later: it needs care
// with Next's inline scripts and the analytics script (M4-T7).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  // AVIF first (smaller photos and screenshots), WebP as the fallback.
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    // The root layout sits under the dynamic [locale] segment, so unmatched URLs
    // need app/global-not-found.tsx (see Next.js not-found docs).
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
