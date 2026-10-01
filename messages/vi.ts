import type { Messages } from "./en";

// Typed as Messages: a missing or extra key fails typecheck.
export const vi: Messages = {
  metadata: {
    title: "Bùi Hữu Tiến — Full-stack Engineer | SaaS, EdTech & AI",
    description:
      "Full-stack Engineer với hơn 3 năm kinh nghiệm xây dựng hệ thống web SaaS, EdTech và AI chạy production cho hơn 15.000 người dùng.",
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
    label: "Case study",
    documentTitle: "Case study {title}",
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
    visitSite: "Xem sản phẩm thực tế",
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
  error: {
    title: "Đã có lỗi xảy ra",
    description: "Trang này chưa tải được. Hãy thử lại hoặc quay về trang chủ.",
    retry: "Thử lại",
    backHome: "Về trang chủ",
    reference: "Mã lỗi",
  },
  notFound: {
    title: "Không tìm thấy trang",
    description: "Trang bạn tìm không tồn tại hoặc đã được chuyển đi.",
    backHome: "Về trang chủ",
  },
};
