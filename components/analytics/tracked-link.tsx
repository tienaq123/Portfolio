"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics/track";

/**
 * In-app link that records an event and keeps client-side navigation.
 * (Umami's `data-umami-event` would cancel it and force a full page load.)
 */
export function TrackedLink({
  event,
  data,
  onClick,
  ...props
}: ComponentProps<typeof Link> & {
  event: AnalyticsEvent;
  data?: Record<string, string>;
}) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        track(event, data);
        onClick?.(clickEvent);
      }}
    />
  );
}
