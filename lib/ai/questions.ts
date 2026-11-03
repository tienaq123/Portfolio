import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/env.server";

/*
 * chat_questions (supabase/migrations): question text only — no IP, no
 * answer (D7). Kept 30 days by a pg_cron job. Writes use the secret key on
 * the server; RLS has no public policy. A failed write never fails a chat.
 */

const TABLE = "chat_questions";

let client: SupabaseClient | undefined;

function getSupabase() {
  if (!supabaseConfig) return null;
  client ??= createClient(supabaseConfig.url, supabaseConfig.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export type QuestionRow = {
  id: string;
  sessionId: string;
  question: string;
  locale: string;
  sources: string[];
  wasFallback: boolean;
  answer: string;
};

export async function saveQuestion(row: QuestionRow) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from(TABLE).insert({
    id: row.id,
    session_id: row.sessionId,
    question: row.question,
    locale: row.locale,
    sources: row.sources,
    was_fallback: row.wasFallback,
    answer: row.answer.slice(0, 8000),
  });
  if (error)
    console.error("[chat] could not store the question:", error.message);
}

/** Sets the rating once; later votes on the same answer are ignored. */
export async function rateQuestion(id: string, rating: 1 | -1) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase
    .from(TABLE)
    .update({ rating })
    .eq("id", id)
    .is("rating", null);
  if (error) console.error("[chat] could not store the rating:", error.message);
}

/** A cheap query so the free Supabase project is not paused for inactivity. */
export async function pingDatabase() {
  const supabase = getSupabase();
  if (!supabase) return { ok: false as const, reason: "not configured" };
  const { error } = await supabase
    .from(TABLE)
    .select("id", { head: true, count: "exact" })
    .limit(1);
  return error
    ? { ok: false as const, reason: error.message }
    : { ok: true as const };
}

// ── Admin dashboard (/admin) ────────────────────────────────────────────────

export type StoredQuestion = {
  id: string;
  sessionId: string;
  question: string;
  answer: string | null;
  locale: string;
  sources: string[];
  wasFallback: boolean;
  rating: 1 | -1 | null;
  createdAt: string;
};

/** null = Supabase is not configured. Newest first, the whole 30-day window. */
export async function listQuestions(): Promise<StoredQuestion[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "id, session_id, question, answer, locale, sources, was_fallback, rating, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error)
    throw new Error(`[chat] could not list questions: ${error.message}`);
  return (data ?? []).map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    question: row.question,
    answer: row.answer,
    locale: row.locale,
    sources: row.sources ?? [],
    wasFallback: row.was_fallback,
    rating: row.rating === 1 || row.rating === -1 ? row.rating : null,
    createdAt: row.created_at,
  }));
}

export async function deleteQuestion(id: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error)
    throw new Error(`[chat] could not delete a question: ${error.message}`);
}
