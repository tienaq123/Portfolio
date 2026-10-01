/*
 * Thin, typed wrapper around Umami. Every call is a no-op until the Umami
 * script has loaded, and the script is only rendered in production with a
 * website ID (lib/env.ts), so dev, previews and missing env track nothing.
 */

type EventData = Record<string, string | number>;

export type AnalyticsEvent =
  | "project_card_clicked"
  | "project_case_study_viewed"
  | "resume_downloaded"
  | "github_clicked"
  | "linkedin_clicked"
  | "email_clicked"
  | "language_switched";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

/** Programmatic event, for Client Components. */
export function track(event: AnalyticsEvent, data?: EventData) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics must never break the page.
  }
}

/**
 * Declarative click event: Umami's script tracks clicks on elements with
 * `data-umami-event`, so Server Components can be tracked without JS of their own.
 */
export function trackAttrs(event: AnalyticsEvent, data: EventData = {}) {
  return {
    "data-umami-event": event,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        `data-umami-event-${key}`,
        String(value),
      ]),
    ),
  };
}
