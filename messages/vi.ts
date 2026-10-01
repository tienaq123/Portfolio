import type { Messages } from "./en";

// Typed as Messages: a missing or extra key fails typecheck.
export const vi: Messages = {
  metadata: {
    title: "Bùi Hữu Tiến — Full-stack Engineer",
    description:
      "Full-stack Engineer xây dựng hệ thống SaaS, EdTech và AI chạy production.",
  },
  a11y: {
    skipToContent: "Chuyển đến nội dung",
  },
  nav: {
    primary: "Điều hướng chính",
    work: "Dự án",
    about: "Giới thiệu",
    skills: "Kỹ năng",
    contact: "Liên hệ",
    cta: "Trao đổi ngay",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
  },
  languageSwitcher: {
    label: "Ngôn ngữ",
  },
  footer: {
    role: "Full-stack Engineer",
    nav: "Điều hướng chân trang",
    backToTop: "Lên đầu trang",
  },
  home: {
    headline:
      "Full-stack Engineer xây dựng hệ thống SaaS, EdTech và AI chạy production.",
    status: "Portfolio đang được xây dựng.",
  },
  notFound: {
    title: "Không tìm thấy trang",
    description: "Trang bạn tìm không tồn tại hoặc đã được chuyển đi.",
    backHome: "Về trang chủ",
  },
};
