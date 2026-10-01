import type { Project } from "../schema";

// Facts: docs/content/*-facts.md (CV + owner's answers). Only work the owner
// confirmed as theirs is claimed. Case study sections are added in M3.
export const projectsData: Project[] = [
  {
    id: "prep4u",
    slug: "prep4u",
    experienceId: "protean",
    title: "Prep4u",
    tags: [
      { label: { en: "EdTech · SAT", vi: "EdTech · SAT" }, tone: "accent" },
      { label: { en: "Production", vi: "Production" }, tone: "success" },
      { label: { en: "12K+ users", vi: "12K+ người dùng" }, tone: "violet" },
    ],
    summary: {
      en: "Digital SAT prep platform with 12K+ users. I designed and built its diagnostics and retention layer: score prediction, an adaptive placement test and a sales retention CRM.",
      vi: "Nền tảng luyện thi Digital SAT với hơn 12.000 người dùng. Tôi thiết kế và xây dựng lớp chẩn đoán và giữ chân người dùng: dự đoán điểm, placement test adaptive và CRM giữ chân khách hàng.",
    },
    highlights: [
      {
        en: "Readiness Engine: Wilson lower bound + Bayesian smoothing, anti-gaming by design",
        vi: "Readiness Engine: Wilson lower bound + Bayesian smoothing, chống điểm ảo ngay trong công thức",
      },
      {
        en: "Multistage adaptive placement test with row-locked submissions",
        vi: "Placement Test multistage adaptive, nộp bài có row lock chống race condition",
      },
      {
        en: "Weakness Map that links each weak skill to targeted practice",
        vi: "Weakness Map dẫn thẳng tới bài luyện đúng kỹ năng yếu",
      },
      {
        en: "Self-initiated sales retention CRM with cohort retention dashboard",
        vi: "Sale Retention CRM tự đề xuất, kèm dashboard retention theo cohort",
      },
    ],
    techStack: ["Laravel", "Livewire", "Alpine.js", "MySQL", "Redis"],
    role: {
      en: "Full-stack · led 2 developers",
      vi: "Full-stack · lead nhóm 2 developer",
    },
    teamSize: "3–6",
    timeline: { en: "01/2026 – 08/2026", vi: "01/2026 – 08/2026" },
    status: "production",
    thumbnail: null,
    featured: true,
    published: true,
    sortOrder: 1,
    sections: [],
  },
  {
    id: "edly",
    slug: "edly",
    experienceId: "protean",
    title: "Edly",
    tags: [
      { label: { en: "EdTech · LMS", vi: "EdTech · LMS" }, tone: "accent" },
      { label: { en: "Production", vi: "Production" }, tone: "success" },
      { label: { en: "3K+ users", vi: "3K+ người dùng" }, tone: "violet" },
    ],
    summary: {
      en: "IELTS & SAT learning platform with 3K+ users and 61K+ questions. I created its dictation practice and pre-exam warm-up, and built module-based assignments and AI question analysis.",
      vi: "Nền tảng luyện thi IELTS & SAT với hơn 3.000 người dùng và 61.000+ câu hỏi. Tôi tự đề xuất tính năng nghe chép chính tả và warm-up trước giờ thi, xây dựng giao bài theo module và AI phân tích câu hỏi.",
    },
    highlights: [
      {
        en: "Dictation practice from IELTS Listening, AI translations checked by QA rules",
        vi: "Nghe chép chính tả từ đề IELTS Listening, AI dịch có kiểm tra chất lượng bằng rule",
      },
      {
        en: "Pre-exam warm-up: versioned config, idempotent server-side scoring",
        vi: "Warm-up trước giờ thi: versioning cấu hình, API chấm điểm idempotent",
      },
      {
        en: "Module-based exam sharing and class assignments",
        vi: "Chia sẻ đề và giao bài cho lớp theo từng module",
      },
      {
        en: "OpenAI question analysis: transcripts, difficulty and category",
        vi: "AI phân tích câu hỏi: transcript, độ khó và danh mục",
      },
    ],
    techStack: [
      "Laravel",
      "Vue 3",
      "TypeScript",
      "Inertia.js",
      "MongoDB",
      "OpenAI",
    ],
    role: {
      en: "Full-stack · led 2 developers",
      vi: "Full-stack · lead nhóm 2 developer",
    },
    teamSize: "3–5",
    timeline: { en: "05/2026 – 09/2026", vi: "05/2026 – 09/2026" },
    status: "production",
    thumbnail: null,
    featured: true,
    published: true,
    sortOrder: 2,
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
    sortOrder: 3,
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
    sortOrder: 4,
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
    sortOrder: 5,
    sections: [],
  },
];
