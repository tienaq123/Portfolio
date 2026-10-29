import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabasePublic } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Read-only client for public pages and the assistant (M7-T5). Publishable
 * key only, so RLS decides what is visible: drafts and private knowledge can
 * never be read, even through a bug. It never touches cookies(): pages that
 * use it stay static. Never use the secret key here (it bypasses RLS).
 */
export function createPublicClient() {
  if (!supabasePublic) return null;
  return createClient<Database>(
    supabasePublic.url,
    supabasePublic.publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
