import type { Messages } from "./en";

// Typed as Messages: a missing or extra key fails typecheck.
export const vi: Messages = {
  metadata: {
    title: "Bùi Hữu Tiến — Full-stack Engineer",
    description:
      "Full-stack Engineer xây dựng hệ thống SaaS, EdTech và AI chạy production.",
  },
  home: {
    headline:
      "Full-stack Engineer xây dựng hệ thống SaaS, EdTech và AI chạy production.",
    status: "Portfolio đang được xây dựng.",
  },
  languageSwitcher: {
    label: "Ngôn ngữ",
  },
  notFound: {
    title: "Không tìm thấy trang",
    description: "Trang bạn tìm không tồn tại hoặc đã được chuyển đi.",
    backHome: "Về trang chủ",
  },
};
