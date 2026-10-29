// SEED DATA (M7). When Supabase is configured the database is the source of
// truth: edit content there (Supabase Studio, later the CMS). This file is the
// seed (`pnpm db:seed:generate`) and the fallback when no database is set up
// (local development without Supabase, CI). See lib/content/store.ts.
import type { Skill, SkillCategory } from "../schema";

// Grouping follows the "Kỹ năng" table of the CV.
export const skillCategoriesData: SkillCategory[] = [
  { key: "frontend", label: { en: "Frontend", vi: "Front-end" }, sortOrder: 1 },
  { key: "backend", label: { en: "Backend", vi: "Back-end" }, sortOrder: 2 },
  { key: "data", label: { en: "Database", vi: "Cơ sở dữ liệu" }, sortOrder: 3 },
  {
    key: "cloud",
    label: { en: "Cloud / DevOps", vi: "Cloud / DevOps" },
    sortOrder: 4,
  },
  { key: "ai", label: { en: "AI / APIs", vi: "AI / APIs" }, sortOrder: 5 },
];

const groups: Record<string, string[]> = {
  frontend: [
    "TypeScript",
    "JavaScript",
    "Vue 3",
    "React",
    "Next.js",
    "Inertia.js",
    "Livewire",
    "Tailwind CSS",
  ],
  backend: ["PHP", "Laravel", "Node.js", "Hono", "Fastify", "REST API"],
  data: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Supabase"],
  cloud: [
    "Cloudflare Workers/Queues/R2",
    "Docker",
    "GitHub Actions",
    "Vercel",
    "Railway",
  ],
  ai: [
    "OpenAI",
    "Anthropic Claude",
    "Google Business Profile API",
    "Slack API",
    "Firebase FCM",
  ],
};

export const skillsData: Skill[] = Object.entries(groups).flatMap(
  ([categoryKey, names]) =>
    names.map((name, index) => ({
      name,
      categoryKey,
      sortOrder: index + 1,
      published: true,
    })),
);
