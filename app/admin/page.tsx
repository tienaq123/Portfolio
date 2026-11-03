import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MarkdownContent } from "@/components/projects/markdown";
import { Badge } from "@/components/ui/badge";
import { isAdminAuthorization } from "@/lib/admin/auth";
import { listQuestions, type StoredQuestion } from "@/lib/ai/questions";
import { cn } from "@/lib/utils";
import { deleteQuestionAction } from "./actions";

const views = {
  all: { label: "Tất cả", match: () => true },
  fallback: {
    label: "Bot không trả lời được",
    match: (q: StoredQuestion) => q.wasFallback,
  },
  negative: {
    label: "👎 Chưa hữu ích",
    match: (q: StoredQuestion) => q.rating === -1,
  },
  positive: {
    label: "👍 Hữu ích",
    match: (q: StoredQuestion) => q.rating === 1,
  },
  vi: { label: "Tiếng Việt", match: (q: StoredQuestion) => q.locale === "vi" },
  en: { label: "Tiếng Anh", match: (q: StoredQuestion) => q.locale === "en" },
} as const;

type View = keyof typeof views;

const time = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  dateStyle: "short",
  timeStyle: "short",
});

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-title">Câu hỏi gửi trợ lý</h1>
      <p className="mt-1 text-sm text-muted">
        30 ngày gần nhất — dữ liệu cũ hơn tự xoá. Không lưu IP.
      </p>
      <Suspense fallback={<p className="mt-8 text-muted">Đang tải…</p>}>
        <Questions searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Questions({
  searchParams,
}: {
  searchParams: PageProps<"/admin">["searchParams"];
}) {
  // Second check behind the proxy (defense in depth).
  if (!isAdminAuthorization((await headers()).get("authorization"))) notFound();

  const params = await searchParams;
  const view: View =
    typeof params.view === "string" && params.view in views
      ? (params.view as View)
      : "all";
  const session = typeof params.session === "string" ? params.session : null;

  let questions: StoredQuestion[] | null;
  try {
    questions = await listQuestions();
  } catch (error) {
    return (
      <p
        role="alert"
        className="mt-8 rounded-card border border-border bg-surface p-6"
      >
        Không đọc được dữ liệu:{" "}
        {error instanceof Error ? error.message : "lỗi không xác định"}. Nếu vừa
        cập nhật code, hãy chạy{" "}
        <code className="font-mono">pnpm exec supabase db push</code>.
      </p>
    );
  }
  if (!questions) {
    return (
      <p className="mt-8 rounded-card border border-border bg-surface p-6">
        Supabase chưa được cấu hình (NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SECRET_KEY) nên chưa có câu hỏi nào được lưu.
      </p>
    );
  }

  const rated = questions.filter((q) => q.rating !== null).length;
  const stats = [
    { label: "Câu hỏi", value: questions.length },
    {
      label: "Bot không trả lời được",
      value: questions.filter((q) => q.wasFallback).length,
    },
    {
      label: "👍 Hữu ích",
      value: questions.filter((q) => q.rating === 1).length,
    },
    {
      label: "👎 Chưa hữu ích",
      value: questions.filter((q) => q.rating === -1).length,
    },
    {
      label: "Phiên chat",
      value: new Set(questions.map((q) => q.sessionId)).size,
    },
  ];

  const shown = session
    ? questions.filter((q) => q.sessionId === session).reverse()
    : questions.filter(views[view].match);

  return (
    <>
      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-border bg-surface p-4"
          >
            <dt className="text-xs text-muted">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-bold text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-muted">
        {rated} / {questions.length} câu trả lời được đánh giá.
      </p>

      {session ? (
        <p className="mt-8 text-sm">
          Hội thoại <code className="font-mono">{session.slice(0, 8)}</code> ·{" "}
          <Link href="/admin" className="font-semibold text-accent underline">
            ← Tất cả câu hỏi
          </Link>
        </p>
      ) : (
        <nav aria-label="Lọc" className="mt-8 flex flex-wrap gap-2">
          {(Object.keys(views) as View[]).map((key) => (
            <Link
              key={key}
              href={key === "all" ? "/admin" : `/admin?view=${key}`}
              aria-current={key === view ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                key === view
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-ink hover:border-accent/40",
              )}
            >
              {views[key].label}
            </Link>
          ))}
        </nav>
      )}

      {shown.length === 0 ? (
        <p className="mt-6 text-muted">Chưa có câu hỏi nào.</p>
      ) : (
        <ol className="mt-6 space-y-4">
          {shown.map((q) => (
            <li
              key={q.id}
              className="rounded-card border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <time dateTime={q.createdAt}>
                  {time.format(new Date(q.createdAt))}
                </time>
                <Badge tone="neutral">{q.locale.toUpperCase()}</Badge>
                {q.wasFallback && (
                  <Badge tone="violet">Không trả lời được</Badge>
                )}
                {q.rating === 1 && <Badge tone="success">👍 Hữu ích</Badge>}
                {q.rating === -1 && (
                  <Badge tone="accent">👎 Chưa hữu ích</Badge>
                )}
                {!session && (
                  <Link
                    href={`/admin?session=${q.sessionId}`}
                    className="ml-auto font-medium text-accent underline"
                  >
                    Cả hội thoại
                  </Link>
                )}
              </div>
              <p className="mt-3 font-semibold whitespace-pre-wrap text-ink">
                {q.question}
              </p>
              <div className="mt-3 rounded-control bg-surface-muted p-3 text-sm">
                {q.answer ? (
                  <MarkdownContent>{q.answer}</MarkdownContent>
                ) : (
                  <span className="text-muted">
                    (Chưa lưu câu trả lời — câu hỏi trước khi có dashboard.)
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted">
                  Nguồn: {q.sources.length > 0 ? q.sources.join(", ") : "—"}
                </p>
                <form action={deleteQuestionAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <button
                    type="submit"
                    className="rounded-control border border-border px-3 py-1.5 text-xs font-semibold text-ink hover:border-ink/30"
                  >
                    Xoá
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
