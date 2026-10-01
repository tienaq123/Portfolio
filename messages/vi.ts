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
    opensInNewTab: "(mở trong tab mới)",
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
    nav: "Điều hướng chân trang",
    backToTop: "Lên đầu trang",
  },
  home: {
    viewProjects: "Xem dự án",
    downloadCv: "Tải CV",
    metricsLabel: "Điểm nổi bật",
    work: {
      title: "Dự án tiêu biểu",
      description:
        "Một số sản phẩm tôi đã xây dựng và đóng góp, từ nền tảng EdTech đến công cụ ứng dụng AI.",
      readCaseStudy: "Đọc case study",
    },
    strengths: {
      title: "Thế mạnh kỹ thuật",
      description:
        "Kỹ năng end-to-end để biến ý tưởng thành sản phẩm thực tế, dễ mở rộng.",
    },
    stack: {
      title: "Công nghệ",
      description: "Các công nghệ tôi dùng để xây dựng ứng dụng web hiện đại.",
    },
    experience: {
      title: "Kinh nghiệm",
      description: "Hành trình nghề nghiệp của tôi.",
      present: "Hiện tại",
      work: "Công việc",
      education: "Học vấn",
    },
    contact: {
      title: "Cùng xây dựng điều gì đó tuyệt vời",
      description:
        "Tôi luôn sẵn sàng trao đổi về cơ hội mới, dự án thú vị hoặc đơn giản là trò chuyện về công nghệ.",
      email: "Gửi email",
      github: "GitHub",
      linkedin: "LinkedIn",
      cv: "Tải CV",
    },
  },
  notFound: {
    title: "Không tìm thấy trang",
    description: "Trang bạn tìm không tồn tại hoặc đã được chuyển đi.",
    backHome: "Về trang chủ",
  },
};
