import type { Knowledge } from "../schema";

// Source: the owner's C5 answers (docs/content/c5-ai-knowledge.md, 2026-10-02).
// These are facts for the assistant to paraphrase, not scripted replies.
export const knowledgeData: Knowledge[] = [
  {
    id: "career",
    title: { en: "Career preferences", vi: "Định hướng công việc" },
    visibility: "public_ai",
    facts: [
      "Looking for Full-stack Engineer roles; open to any product domain and comfortable switching tech stacks.",
      "Open to remote, onsite or hybrid work. Based in Hanoi, Vietnam, and not relocating.",
      "Remote work for international teams is possible; his English communication is still improving.",
      "Available to start immediately. Open to full-time or freelance work.",
      "Left Protean Studios at the end of September 2026 and is available for new opportunities.",
    ],
  },
  {
    id: "principles",
    title: { en: "How he works", vi: "Cách làm việc" },
    visibility: "public_ai",
    facts: [
      "Works end to end: business analysis, database design, APIs, UI and deployment.",
      "Prefers simple, measurable solutions: deterministic rules and code first, an LLM only where language understanding is needed (a lesson from AI Slack Check).",
      "For AI in production: structured output, validation before saving, and human review when confidence is low.",
      "Proposes features from real problems: the Sales Retention CRM (Prep4u), Dictation and Warm-up (Edly) and AI Slack Check were his own initiatives.",
      "Uses AI-assisted development tools to move faster, and reviews and owns the code himself.",
    ],
  },
  {
    id: "leadership",
    title: { en: "Leadership", vi: "Vai trò lead" },
    visibility: "public_ai",
    facts: [
      "Led a group of 2 developers on Prep4u and Edly: splitting tasks, reviewing code and designing solutions.",
      "Has basic team management experience and is ready to take on a lead role.",
    ],
  },
  {
    id: "languages",
    title: { en: "Languages & timezone", vi: "Ngôn ngữ & múi giờ" },
    visibility: "public_ai",
    facts: [
      "Vietnamese: native. English: reads technical documentation comfortably; English communication is still improving. He does not speak Japanese.",
      "Timezone UTC+7 (Hanoi); his working hours overlap with Japan's.",
      "Has worked with Japanese clients: outsourced projects at Musashi Việt Nam, the Benerio SaaS for Japanese businesses, and maintaining projects for Japanese clients at Protean Studios.",
    ],
  },
  {
    id: "about",
    title: { en: "About Tiến", vi: "Về Tiến" },
    visibility: "public_ai",
    facts: [
      "Left Musashi Việt Nam to look for new opportunities and a new environment.",
      "His main strength is adapting quickly: he gets up to speed on a project and contributes fast. He wants to keep learning new technologies and take on new problems.",
      "He has no public side projects; AI Slack Check, a self-initiated internal tool, is the closest. There is not much on his GitHub to showcase, so do not point visitors to repositories.",
    ],
  },
];
