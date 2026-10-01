import type { Metric, Strength } from "../schema";

// Every number has a source in the CV (docs/content/cv-facts.md).
export const metricsData: Metric[] = [
  {
    id: "experience",
    value: "3+",
    label: { en: "Years Experience", vi: "Năm kinh nghiệm" },
    description: {
      en: "Building real products",
      vi: "Xây dựng sản phẩm thực tế",
    },
    iconKey: "calendar",
    sortOrder: 1,
    published: true,
  },
  {
    id: "users",
    value: "15K+",
    label: { en: "Users", vi: "Người dùng" },
    description: {
      en: "Across 2 EdTech platforms",
      vi: "Trên 2 nền tảng EdTech",
    },
    iconKey: "users",
    sortOrder: 2,
    published: true,
  },
  {
    id: "endpoints",
    value: "70+",
    label: { en: "API Endpoints", vi: "API endpoint" },
    description: {
      en: "In a multi-tenant SaaS",
      vi: "Trong một SaaS multi-tenant",
    },
    iconKey: "code",
    sortOrder: 3,
    published: true,
  },
  {
    id: "domains",
    value: "SaaS / EdTech / AI",
    label: { en: "Domains", vi: "Lĩnh vực" },
    description: {
      en: "Real-world production experience",
      vi: "Kinh nghiệm production",
    },
    iconKey: "box",
    sortOrder: 4,
    published: true,
  },
];

export const strengthsData: Strength[] = [
  {
    id: "full-stack",
    title: { en: "Full-stack Development", vi: "Phát triển Full-stack" },
    description: {
      en: "Build complete web applications from database and APIs to frontend, with a focus on performance and user experience.",
      vi: "Xây dựng ứng dụng web hoàn chỉnh từ database, API đến frontend, chú trọng hiệu năng và trải nghiệm người dùng.",
    },
    iconKey: "layers",
    sortOrder: 1,
    published: true,
  },
  {
    id: "backend",
    title: { en: "Backend / API Design", vi: "Thiết kế Backend / API" },
    description: {
      en: "Design robust, scalable APIs with clean architecture, validation, authentication and role-based access control.",
      vi: "Thiết kế API vững chắc, dễ mở rộng với kiến trúc rõ ràng, validation, xác thực và phân quyền theo vai trò.",
    },
    iconKey: "code",
    sortOrder: 2,
    published: true,
  },
  {
    id: "ai",
    title: { en: "AI / LLM Integration", vi: "Tích hợp AI / LLM" },
    description: {
      en: "Integrate LLMs into real products with structured output, validation and human-in-the-loop review.",
      vi: "Tích hợp LLM vào sản phẩm thực tế với structured output, validation và quy trình human-in-the-loop.",
    },
    iconKey: "brain",
    sortOrder: 3,
    published: true,
  },
  {
    id: "cloud",
    title: { en: "Cloud / DevOps", vi: "Cloud / DevOps" },
    description: {
      en: "Deploy and run production systems with Docker, CI/CD, serverless workers and queues.",
      vi: "Triển khai và vận hành hệ thống production với Docker, CI/CD, serverless worker và queue.",
    },
    iconKey: "cloud",
    sortOrder: 4,
    published: true,
  },
];
