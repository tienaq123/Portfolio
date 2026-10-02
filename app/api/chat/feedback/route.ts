import { rateQuestion } from "@/lib/ai/questions";
import { limitFeedback, visitorKey } from "@/lib/ai/rate-limit";
import { feedbackRequestSchema } from "@/lib/ai/request";

// POST /api/chat/feedback { questionId, rating: 1 | -1 } → 204.
// The first vote for an answer wins; later ones are ignored.
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = feedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const limit = await limitFeedback(visitorKey(request));
  if (limit && !limit.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": `${limit.retryAfter}` } },
    );
  }

  await rateQuestion(parsed.data.questionId, parsed.data.rating);
  return new Response(null, { status: 204 });
}
