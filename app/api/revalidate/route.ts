import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";
import { revalidateSecret } from "@/lib/env.server";
import { hasBearer } from "@/lib/server/bearer";

/*
 * POST /api/revalidate — called by Supabase database webhooks when a content
 * table changes (edits in Supabase Studio, later the CMS), so the site
 * updates without a redeploy (M7-T7).
 *
 * "max": the next visit still gets the cached page while it regenerates in
 * the background, and if the database is down the last good page stays.
 */
export async function POST(request: Request) {
  if (!revalidateSecret) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }
  if (!hasBearer(request, revalidateSecret)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // Supabase sends { type, table, record, old_record }; only the table is
  // logged — everything shares one tag.
  const body: unknown = await request.json().catch(() => null);
  const table =
    typeof body === "object" && body !== null && "table" in body
      ? String(body.table)
      : "unknown";

  revalidateTag(CONTENT_TAG, "max");
  console.info(`[revalidate] ${CONTENT_TAG} (${table})`);
  return Response.json({ revalidated: true, tag: CONTENT_TAG });
}
