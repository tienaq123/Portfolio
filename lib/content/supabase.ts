import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { contentTables, fromRows, type ContentRows } from "./rows";
import { contentStoreSchema, type ContentStore } from "./store";

/**
 * Reads every content table and validates the result as a whole. Any
 * failed query throws: during a revalidation Next.js then keeps serving the
 * cached pages instead of rendering half the content.
 */
export async function fetchContent(
  client: SupabaseClient<Database>,
): Promise<ContentStore> {
  const entries = await Promise.all(
    contentTables.map(async (table) => {
      const { data, error } = await client.from(table).select("*");
      if (error) throw new Error(`[content] ${table}: ${error.message}`);
      return [table, data] as const;
    }),
  );
  const rows = {} as ContentRows;
  for (const [table, data] of entries) rows[table] = data;
  return contentStoreSchema.parse(fromRows(rows));
}
