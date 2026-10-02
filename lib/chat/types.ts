// Wire format of /api/chat, shared by the route handler and the widget.
// Types only: nothing here ships code to the client.

export type ChatRole = "user" | "assistant";

export type ChatTurn = { role: ChatRole; content: string };

export type ChatRequest = {
  messages: ChatTurn[];
  locale: "en" | "vi";
  sessionId: string;
};

export type ChatSource = {
  id: string;
  title: string;
  /** Page on this site; null for assistant-only knowledge. */
  href: string | null;
};

/** One JSON object per line (NDJSON). */
export type ChatEvent =
  | { type: "text"; text: string }
  | {
      type: "done";
      questionId: string;
      sources: ChatSource[];
      fallback: boolean;
    }
  | { type: "error"; code: "failed" };

/** Error bodies of non-200 responses. */
export type ChatErrorCode = "invalid" | "rate_limited" | "unavailable";

export type ChatFeedbackRequest = { questionId: string; rating: 1 | -1 };
