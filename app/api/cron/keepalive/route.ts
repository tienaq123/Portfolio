import { pingDatabase } from "@/lib/ai/questions";
import { cronSecret } from "@/lib/env.server";
import { hasBearer } from "@/lib/server/bearer";

// Daily Vercel Cron (vercel.json): Supabase's free tier pauses a project
// after about a week without activity. Vercel sends the CRON_SECRET.
export async function GET(request: Request) {
  if (!cronSecret) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }
  if (!hasBearer(request, cronSecret)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await pingDatabase();
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
