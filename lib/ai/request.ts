import { z } from "zod";
import { locales } from "@/i18n/config";

export const MAX_QUESTION_CHARS = 500;
/** History sent with each question: at most this many user/assistant pairs. */
export const MAX_TURNS = 6;
const MAX_ASSISTANT_CHARS = 4000;
const MAX_TOTAL_CHARS = 12000;

const turn = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_ASSISTANT_CHARS),
});

export const chatRequestSchema = z
  .object({
    messages: z
      .array(turn)
      .min(1)
      .max(MAX_TURNS * 2),
    locale: z.enum(locales),
    sessionId: z.uuid(),
  })
  .superRefine(({ messages }, ctx) => {
    const last = messages.at(-1);
    if (last?.role !== "user") {
      ctx.addIssue({
        code: "custom",
        message: "The last message must be the question",
      });
    } else if (last.content.length > MAX_QUESTION_CHARS) {
      ctx.addIssue({ code: "custom", message: "Question too long" });
    }
    if (
      messages.some(
        (message, index) =>
          index > 0 && message.role === messages[index - 1]?.role,
      )
    ) {
      ctx.addIssue({ code: "custom", message: "Roles must alternate" });
    }
    const total = messages.reduce(
      (sum, message) => sum + message.content.length,
      0,
    );
    if (total > MAX_TOTAL_CHARS) {
      ctx.addIssue({ code: "custom", message: "Conversation too long" });
    }
  });

export const feedbackRequestSchema = z.object({
  questionId: z.uuid(),
  rating: z.union([z.literal(1), z.literal(-1)]),
});
