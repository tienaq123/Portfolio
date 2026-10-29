import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Credentials of the local stack (`pnpm db:start`), read from the CLI so
// nothing is hard-coded.
const status = JSON.parse(
  execFileSync("pnpm", ["exec", "supabase", "status", "-o", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }),
) as { API_URL: string; PUBLISHABLE_KEY: string; SECRET_KEY: string };

const options = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

/** What a visitor can do: publishable key, no session. */
export const anon = () =>
  createClient<Database>(status.API_URL, status.PUBLISHABLE_KEY, options);

/** Bypasses RLS: test setup and cleanup only. */
export const service = () =>
  createClient<Database>(status.API_URL, status.SECRET_KEY, options);

/** A publishable-key client signed in as a user. */
export async function signedIn(email: string, password: string) {
  const client = anon();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}
