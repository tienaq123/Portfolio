"use client";

import { ArrowUp, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/analytics/track";
import {
  ChatRequestError,
  getSessionId,
  sendFeedback,
  streamChat,
  type ChatFailure,
} from "@/lib/chat/client";
import type { ChatSource, ChatTurn } from "@/lib/chat/types";
import type { Messages } from "@/messages/en";

// Mirrors lib/ai/request.ts (the server validates again).
const MAX_QUESTION_CHARS = 500;
const MAX_TURNS = 6;

type Strings = Messages["chat"];

type UserMessage = { id: string; role: "user"; content: string };

type AssistantMessage = {
  id: string;
  role: "assistant";
  content: string;
  status: "streaming" | "done" | "error";
  error?: ChatFailure;
  question: string;
  questionId?: string;
  sources?: ChatSource[];
  rating?: 1 | -1;
};

type UiMessage = UserMessage | AssistantMessage;

const newId = () => crypto.randomUUID();

/** Completed question/answer pairs, oldest first, capped for the request. */
function historyOf(messages: UiMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  messages.forEach((message, index) => {
    const previous = messages[index - 1];
    if (
      message.role === "assistant" &&
      message.status === "done" &&
      previous?.role === "user"
    ) {
      turns.push(
        { role: "user", content: previous.content },
        { role: "assistant", content: message.content },
      );
    }
  });
  return turns.slice(-MAX_TURNS * 2);
}

/** Answer text for the screen reader announcement. */
const plain = (markdown: string) => markdown.replace(/[*_`#>]/g, "");

type ChatPanelProps = {
  open: boolean;
  locale: Locale;
  email: string;
  strings: Strings;
  onClose: () => void;
};

export function ChatPanel({
  open,
  locale,
  email,
  strings,
  onClose,
}: ChatPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const busy = messages.some(
    (message) => message.role === "assistant" && message.status === "streaming",
  );

  // Native modal dialog: focus trap, Esc and an inert page for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const update = (id: string, patch: Partial<AssistantMessage>) =>
    setMessages((current) =>
      current.map((message) =>
        message.id === id && message.role === "assistant"
          ? { ...message, ...patch }
          : message,
      ),
    );

  async function ask(question: string, history: UiMessage[]) {
    const text = question.trim().slice(0, MAX_QUESTION_CHARS);
    if (!text || busy) return;

    const answerId = newId();
    setMessages([
      ...history,
      { id: newId(), role: "user", content: text },
      {
        id: answerId,
        role: "assistant",
        content: "",
        status: "streaming",
        question: text,
      },
    ]);
    setDraft("");
    setAnnouncement("");
    track("chat_question_sent", { locale });

    const controller = new AbortController();
    abortRef.current = controller;
    let content = "";
    try {
      for await (const event of streamChat(
        {
          messages: [...historyOf(history), { role: "user", content: text }],
          locale,
          sessionId: getSessionId(),
        },
        controller.signal,
      )) {
        if (event.type === "text") {
          content += event.text;
          update(answerId, { content });
        } else if (event.type === "done") {
          update(answerId, {
            status: "done",
            questionId: event.questionId,
            sources: event.sources,
          });
          setAnnouncement(`${strings.answerReady}. ${plain(content)}`);
          track("chat_answer_completed", {
            fallback: event.fallback ? 1 : 0,
            sources: event.sources.length,
          });
        } else {
          update(answerId, { status: "error", error: event.code });
        }
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      update(answerId, {
        status: "error",
        error: error instanceof ChatRequestError ? error.code : "failed",
      });
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(draft, messages);
  }

  function retry(message: AssistantMessage) {
    // Drop the failed answer and its question, then ask again.
    const index = messages.findIndex((item) => item.id === message.id);
    void ask(message.question, messages.slice(0, Math.max(0, index - 1)));
  }

  function rate(message: AssistantMessage, rating: 1 | -1) {
    if (!message.questionId || message.rating) return;
    update(message.id, { rating });
    void sendFeedback({ questionId: message.questionId, rating });
    track(rating === 1 ? "chat_feedback_positive" : "chat_feedback_negative");
  }

  return (
    <dialog
      ref={dialogRef}
      data-chat-panel=""
      aria-labelledby="chat-title"
      onClose={() => {
        abortRef.current?.abort();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-surface p-0 text-body backdrop:bg-ink/30 sm:top-auto sm:right-6 sm:bottom-6 sm:left-auto sm:h-[min(40rem,calc(100dvh-3rem))] sm:w-[26rem] sm:rounded-panel sm:border sm:border-border sm:shadow-raised"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id="chat-title" className="font-bold">
              {strings.title}
            </h2>
            <p className="text-xs text-muted">{strings.subtitle}</p>
          </div>
          <button
            type="button"
            aria-label={strings.close}
            onClick={() => dialogRef.current?.close()}
            className="flex size-11 shrink-0 items-center justify-center rounded-control border border-border text-ink hover:bg-surface-muted"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <section aria-label={strings.suggestionsLabel}>
              <ul className="flex flex-col items-start gap-2">
                {strings.suggestions.map((suggestion, index) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => {
                        track("suggested_question_clicked", { index });
                        void ask(suggestion, messages);
                      }}
                      className="rounded-control border border-border bg-surface px-3 py-2 text-left text-sm text-ink transition-colors hover:border-accent/40 hover:bg-accent-soft"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-card rounded-br-sm bg-accent px-4 py-2.5 text-sm whitespace-pre-wrap text-white">
                  <span className="sr-only">{strings.you}: </span>
                  {message.content}
                </p>
              </div>
            ) : (
              <AssistantBubble
                key={message.id}
                message={message}
                strings={strings}
                email={email}
                onRetry={() => retry(message)}
                onRate={(rating) => rate(message, rating)}
                onSource={(source) => {
                  track("chat_source_clicked", { id: source.id });
                  dialogRef.current?.close();
                }}
              />
            ),
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        <form onSubmit={submit} className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <label htmlFor="chat-input" className="sr-only">
              {strings.placeholder}
            </label>
            <textarea
              ref={inputRef}
              id="chat-input"
              rows={1}
              value={draft}
              maxLength={MAX_QUESTION_CHARS}
              placeholder={strings.placeholder}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void ask(draft, messages);
                }
              }}
              className="max-h-32 min-h-11 flex-1 resize-none rounded-control border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted"
            />
            <button
              type="submit"
              aria-label={strings.send}
              disabled={busy || draft.trim().length === 0}
              className="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              <ArrowUp aria-hidden="true" className="size-5" />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {strings.notice} {strings.disclaimer}
          </p>
        </form>
      </div>
    </dialog>
  );
}

function AssistantBubble({
  message,
  strings,
  email,
  onRetry,
  onRate,
  onSource,
}: {
  message: AssistantMessage;
  strings: Strings;
  email: string;
  onRetry: () => void;
  onRate: (rating: 1 | -1) => void;
  onSource: (source: ChatSource) => void;
}) {
  const sources = message.sources?.filter((source) => source.href) ?? [];

  return (
    <div
      className="max-w-[92%] space-y-3"
      aria-busy={message.status === "streaming"}
    >
      <div className="rounded-card rounded-bl-sm bg-surface-muted px-4 py-3 text-sm leading-relaxed text-ink">
        <span className="sr-only">{strings.assistant}: </span>
        {message.content ? (
          <ReactMarkdown
            skipHtml
            disallowedElements={["img"]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
                  {children}
                </ol>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="font-medium text-accent underline underline-offset-2"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          message.status === "streaming" && (
            <span className="text-muted motion-safe:animate-pulse">
              {strings.thinking}
            </span>
          )
        )}

        {message.status === "error" && (
          <div role="alert" className="space-y-2">
            <p>
              {message.error === "rate_limited"
                ? strings.errors.rateLimited
                : message.error === "unavailable"
                  ? strings.errors.unavailable
                  : strings.errors.failed}{" "}
              {message.error === "unavailable" && (
                <a
                  href={`mailto:${email}`}
                  className="font-medium text-accent underline underline-offset-2"
                >
                  {email}
                </a>
              )}
            </p>
            {message.error !== "unavailable" && (
              <button
                type="button"
                onClick={onRetry}
                className="font-semibold text-accent underline underline-offset-2"
              >
                {strings.retry}
              </button>
            )}
          </div>
        )}
      </div>

      {message.status === "done" && sources.length > 0 && (
        <div className="text-xs">
          <p className="font-semibold text-muted">{strings.basedOn}</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {sources.map((source) => (
              <li key={source.id}>
                <Link
                  href={source.href ?? "/"}
                  onClick={() => onSource(source)}
                  className="inline-flex min-h-8 items-center rounded-full border border-border bg-surface px-3 font-medium text-ink transition-colors hover:border-accent/40"
                >
                  {source.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message.status === "done" && message.questionId && (
        <div className="flex items-center gap-1">
          {message.rating ? (
            <p className="text-xs text-muted">{strings.thanks}</p>
          ) : (
            <>
              <FeedbackButton label={strings.helpful} onClick={() => onRate(1)}>
                <ThumbsUp aria-hidden="true" className="size-4" />
              </FeedbackButton>
              <FeedbackButton
                label={strings.notHelpful}
                onClick={() => onRate(-1)}
              >
                <ThumbsDown aria-hidden="true" className="size-4" />
              </FeedbackButton>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function FeedbackButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-muted hover:text-ink"
    >
      {children}
    </button>
  );
}
