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
