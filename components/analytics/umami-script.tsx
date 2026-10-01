import Script from "next/script";
import { umami } from "@/lib/env";

/** Cookieless Umami tracker; renders nothing when analytics is off. */
export function UmamiScript() {
  if (!umami) return null;
  return (
    <Script
      src={umami.scriptUrl}
      data-website-id={umami.websiteId}
      strategy="afterInteractive"
    />
  );
}
