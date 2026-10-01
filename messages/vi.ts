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
      viewAll: "Xem tất cả dự án",
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
  work: {
    title: "Dự án",
    description:
      "Các sản phẩm tôi đã xây dựng và đóng góp, cùng phần kỹ thuật phía sau.",
  },
  caseStudy: {
    allProjects: "Tất cả dự án",
    role: "Vai trò",
    team: "Team",
    timeline: "Thời gian",
    status: "Trạng thái",
    solo: "Một mình",
    people: "người",
    keyMetrics: "Số liệu chính",
    techStack: "Công nghệ",
    onThisPage: "Trong trang này",
    nextProject: "Case study tiếp theo",
    diagramHint: "Vuốt ngang để xem toàn bộ sơ đồ",
    statuses: {
      production: "Đang vận hành",
      internal: "Công cụ nội bộ",
      archived: "Đã ngừng vận hành",
    },
    sections: {
      context: "Bối cảnh",
      problem: "Vấn đề",
      responsibility: "Vai trò của tôi",
      constraints: "Ràng buộc",
      architecture: "Kiến trúc",
      decisions: "Quyết định kỹ thuật chính",
      tradeoffs: "Đánh đổi",
      implementation: "Điểm nổi bật khi triển khai",
      results: "Kết quả",
      learnings: "Bài học",
      gallery: "Hình ảnh",
    },
  },
  notFound: {
    title: "Không tìm thấy trang",
    description: "Trang bạn tìm không tồn tại hoặc đã được chuyển đi.",
    backHome: "Về trang chủ",
  },
};
