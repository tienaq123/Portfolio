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
