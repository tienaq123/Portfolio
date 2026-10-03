import type {
  ChatErrorCode,
  ChatEvent,
  ChatFeedbackRequest,
  ChatRequest,
} from "./types";

// Browser side of /api/chat. Used by the lazy chat panel only.

export type ChatFailure = ChatErrorCode | "failed";

export class ChatRequestError extends Error {
  readonly code: ChatFailure;

  constructor(code: ChatFailure) {
    super(code);
    this.code = code;
  }
}

/** Reads the NDJSON stream; throws ChatRequestError for non-200 responses. */
export async function* streamChat(
  request: ChatRequest,
  signal: AbortSignal,
): AsyncGenerator<ChatEvent> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  if (!response.ok || !response.body) {
    throw new ChatRequestError(
      response.status === 429
        ? "rate_limited"
        : response.status === 503
          ? "unavailable"
          : "failed",
    );
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) yield JSON.parse(line) as ChatEvent;
      newline = buffer.indexOf("\n");
    }
  }
}

export function sendFeedback(feedback: ChatFeedbackRequest) {
  return fetch("/api/chat/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback),
    keepalive: true,
  }).catch(() => undefined);
}

const SESSION_KEY = "chat-session";

/** Random id per browser tab session; never tied to the visitor. */
export function getSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
