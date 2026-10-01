import type { Experience } from "../schema";

export const experiencesData: Experience[] = [
  {
    id: "protean",
    type: "work",
    organization: { en: "Protean Studios", vi: "Protean Studios" },
    role: { en: "Software Engineer", vi: "Software Engineer" },
    startDate: "2025-02",
    endDate: null,
    highlights: [
      {
        en: "Build and maintain web applications and backend APIs for EdTech, SaaS, social mobile and AI automation products.",
        vi: "Phát triển và bảo trì web application, backend API cho các sản phẩm EdTech, SaaS, social mobile và hệ thống tự động hoá ứng dụng AI.",
      },
      {
        en: "Own features end to end: business analysis, database design, APIs, UI and production deployment.",
        vi: "Phụ trách end-to-end từng feature, từ phân tích nghiệp vụ, thiết kế database, API, UI đến deploy production.",
      },
      {
        en: "Led a team of 2 developers on the Prep4u & Edly platforms.",
        vi: "Lead nhóm 2 developer trên hai nền tảng Prep4u & Edly.",
      },
    ],
    sortOrder: 1,
    published: true,
  },
  {
    id: "musashi",
    type: "work",
    organization: { en: "Musashi Việt Nam", vi: "Musashi Việt Nam" },
    role: { en: "Software Engineer", vi: "Software Engineer" },
    startDate: "2023-04",
    endDate: "2024-11",
    highlights: [
      {
        en: "Developed and maintained outsourced projects for Japanese clients.",
        vi: "Phát triển và bảo trì các dự án outsource cho khách hàng Nhật Bản.",
      },
      {
        en: "Turned Figma/XD designs into responsive HTML and WordPress themes; built features with Vue.js, Laravel and MySQL.",
        vi: "Chuyển thiết kế Figma/XD thành giao diện HTML responsive và theme WordPress; triển khai chức năng bằng Vue.js, Laravel và MySQL.",
      },
    ],
    sortOrder: 2,
    published: true,
  },
  {
    id: "fpt-polytechnic",
    type: "education",
    organization: {
      en: "FPT Polytechnic College",
      vi: "Cao đẳng FPT Polytechnic",
    },
    role: { en: "Website Design", vi: "Thiết kế Website" },
    startDate: "2021-09",
    endDate: "2023-05",
    highlights: [{ en: "GPA 7.9/10", vi: "GPA 7.9/10" }],
    sortOrder: 3,
    published: true,
  },
];
