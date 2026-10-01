import type { Project } from "../schema";

// Facts from the CV. Case study sections are added in M3.
export const projectsData: Project[] = [
  {
    id: "prep4u-edly",
    slug: "prep4u-edly",
    experienceId: "protean",
    title: "Prep4u & Edly",
    tags: [
      { label: { en: "EdTech", vi: "EdTech" }, tone: "accent" },
      { label: { en: "Production", vi: "Production" }, tone: "success" },
      { label: { en: "15K+ users", vi: "15K+ người dùng" }, tone: "violet" },
    ],
    summary: {
      en: "Two production SAT & IELTS prep platforms: adaptive testing, learning analytics and LMS for 15K+ learners.",
      vi: "Hai nền tảng luyện thi SAT, IELTS chạy production: adaptive testing, phân tích học tập và LMS cho hơn 15.000 học viên.",
    },
    highlights: [
      {
        en: "Readiness Engine: Wilson lower bound + Bayesian smoothing",
        vi: "Readiness Engine: Wilson lower bound + Bayesian smoothing",
      },
      {
        en: "Adaptive placement test, race-condition safe",
        vi: "Placement Test adaptive, chống race condition",
      },
      {
        en: "Weakness Map & retention dashboard (D1/D7/D30)",
        vi: "Weakness Map & Retention Dashboard (D1/D7/D30)",
      },
      {
        en: "OpenAI-powered transcripts, translations and difficulty tagging",
        vi: "OpenAI sinh transcript, bản dịch và phân loại độ khó",
      },
    ],
    techStack: ["Laravel", "Vue 3", "TypeScript", "MySQL", "Redis", "OpenAI"],
    role: {
      en: "Full-stack · led 2 developers",
      vi: "Full-stack · lead nhóm 2 developer",
    },
    teamSize: "3–6",
    timeline: { en: "02/2026 – 08/2026", vi: "02/2026 – 08/2026" },
    status: "production",
    thumbnail: null,
    featured: true,
    published: true,
    sortOrder: 1,
    sections: [],
  },
  {
    id: "ai-slack-check",
    slug: "ai-slack-check",
    experienceId: "protean",
    title: "AI Slack Check",
    tags: [
      { label: { en: "AI / LLM", vi: "AI / LLM" }, tone: "violet" },
      { label: { en: "Automation", vi: "Tự động hoá" }, tone: "accent" },
      { label: { en: "Internal tool", vi: "Công cụ nội bộ" }, tone: "neutral" },
    ],
    summary: {
      en: "LLM-powered attendance automation that turns Vietnamese Slack messages into structured HR data for ~50 employees.",
      vi: "Tự động hoá chấm công bằng LLM: chuyển tin nhắn Slack tiếng Việt thành dữ liệu HR có cấu trúc cho ~50 nhân sự.",
    },
    highlights: [
      {
        en: "Hybrid rule-based + LLM extraction pipeline",
        vi: "Pipeline trích xuất lai rule-based + LLM",
      },
      {
        en: "Few-shot prompts with JSON schema validation",
        vi: "Few-shot prompt, validate output theo JSON schema",
      },
      {
        en: "Human-in-the-loop: confidence score & audit trail",
        vi: "Human-in-the-loop: confidence score & audit trail",
      },
      {
        en: "Incremental Slack sync & HR dashboard",
        vi: "Incremental Slack sync & HR Dashboard",
      },
    ],
    techStack: ["Node.js", "Fastify", "TypeScript", "Claude API", "PostgreSQL"],
    role: {
      en: "Full-stack · built solo",
      vi: "Full-stack · phát triển độc lập",
    },
    teamSize: "1",
    timeline: { en: "03/2026 – 04/2026", vi: "03/2026 – 04/2026" },
    status: "internal",
    thumbnail: null,
    featured: true,
    published: true,
    sortOrder: 2,
    sections: [],
  },
  {
    id: "benerio",
    slug: "benerio",
    experienceId: "protean",
    title: "Benerio",
    tags: [
      { label: { en: "SaaS", vi: "SaaS" }, tone: "accent" },
      { label: { en: "Multi-tenant", vi: "Multi-tenant" }, tone: "violet" },
      { label: { en: "70+ APIs", vi: "70+ API" }, tone: "success" },
    ],
    summary: {
      en: "Multi-tenant SaaS for managing Google Business Profile and social media, with 70+ API endpoints.",
      vi: "Nền tảng SaaS multi-tenant quản lý Google Business Profile và mạng xã hội, với hơn 70 API endpoint.",
    },
    highlights: [
      {
        en: "Role-based access (Admin / Worker / Viewer) with Supabase RLS",
        vi: "Phân quyền Admin / Worker / Viewer bằng Supabase RLS",
      },
      {
        en: "OAuth, Google Business Profile & Instagram Graph APIs",
        vi: "OAuth, Google Business Profile API & Instagram Graph API",
      },
      {
        en: "Multi-provider AI module (OpenAI, Anthropic, Google)",
        vi: "Module AI đa nhà cung cấp (OpenAI, Anthropic, Google)",
      },
      {
        en: "Scheduled posts & analytics sync, tested with Jest and Playwright",
        vi: "Scheduled posts & đồng bộ analytics, test bằng Jest và Playwright",
      },
    ],
    techStack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Vercel"],
    role: { en: "Full-stack", vi: "Full-stack" },
    teamSize: "2–3",
    timeline: { en: "2025", vi: "2025" },
    status: null,
    thumbnail: null,
    featured: true,
    published: true,
    sortOrder: 3,
    sections: [],
  },
  {
    id: "snacktime-afp",
    slug: "snacktime-afp",
    experienceId: "protean",
    title: "Snacktime AFP",
    tags: [
      { label: { en: "Backend", vi: "Backend" }, tone: "accent" },
      { label: { en: "AI", vi: "AI" }, tone: "violet" },
      { label: { en: "Social mobile", vi: "Social mobile" }, tone: "success" },
    ],
    summary: {
      en: "Backend API for a social mobile app where friends create AI-generated photos together.",
      vi: "Backend API cho ứng dụng social mobile tạo ảnh AI giữa người dùng và bạn bè.",
    },
    highlights: [
      {
        en: "Async AI image pipeline with Cloudflare Queues & Redis",
        vi: "Pipeline xử lý ảnh AI bất đồng bộ bằng Cloudflare Queues & Redis",
      },
      {
        en: "Timezone-aware cron for automatic generation",
        vi: "Cron theo timezone để tạo ảnh tự động",
      },
      {
        en: "Retry, distributed lock & rate limiting",
        vi: "Retry, distributed lock & rate limiting",
      },
      {
        en: "Push notifications (FCM) & friends-of-friends suggestions",
        vi: "Push notification (FCM) & gợi ý Friends of Friends",
      },
    ],
    techStack: [
      "Cloudflare Workers",
      "Hono",
      "PostgreSQL",
      "Redis",
      "Firebase FCM",
    ],
    role: { en: "Backend Developer", vi: "Backend Developer" },
    teamSize: "2",
    timeline: { en: "2025", vi: "2025" },
    status: null,
    thumbnail: null,
    featured: true,
    published: true,
    sortOrder: 4,
    sections: [],
  },
];
