"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics/track";

const POLL_MS = 250;
const MAX_POLLS = 40;

/**
 * Fires one event when the page is shown. The Umami script loads after
 * hydration, so this waits (briefly) for `window.umami` to exist.
 */
export function TrackView({
  event,
  data,
}: {
  event: AnalyticsEvent;
  data: Record<string, string>;
}) {
  // Serialized so a new object with the same content doesn't re-fire.
  const payload = JSON.stringify(data);

  useEffect(() => {
    const send = () => track(event, JSON.parse(payload));
    if (window.umami) {
      send();
      return;
    }
    // No tracker on the page (analytics off): nothing to wait for.
    if (!document.querySelector("script[data-website-id]")) return;

    let polls = 0;
    const timer = window.setInterval(() => {
      if (window.umami) send();
      if (window.umami || ++polls >= MAX_POLLS) window.clearInterval(timer);
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [event, payload]);

  return null;
}
