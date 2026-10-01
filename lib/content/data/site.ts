import type { SiteProfile } from "../schema";

// Source of truth for personal facts: the owner's CV (see CLAUDE.md).
export const siteProfileData: SiteProfile = {
  name: "Bùi Hữu Tiến",
  alternateName: "Bui Huu Tien",
  role: { en: "Full-stack Engineer", vi: "Full-stack Engineer" },
  availability: {
    en: "Available for new opportunities",
    vi: "Sẵn sàng cho cơ hội mới",
  },
  headline: {
    en: "Full-stack Engineer building production SaaS, EdTech & AI systems.",
    vi: "Full-stack Engineer xây dựng hệ thống SaaS, EdTech và AI chạy production.",
  },
  headlineAccent: {
    en: "SaaS, EdTech & AI systems.",
    vi: "SaaS, EdTech và AI",
  },
  summary: {
    en: "3+ years shipping end-to-end products for 15K+ users. I build scalable web applications, robust backend systems and production AI workflows that solve real product problems.",
    vi: "Hơn 3 năm phát triển sản phẩm end-to-end cho hơn 15.000 người dùng. Tôi xây dựng ứng dụng web dễ mở rộng, hệ thống backend vững chắc và quy trình AI chạy production để giải quyết bài toán sản phẩm thực tế.",
  },
  location: { en: "Hanoi, Vietnam", vi: "Hà Nội, Việt Nam" },
  links: {
    email: "buihuutien2002@gmail.com",
    github: "https://github.com/tienaq123",
    linkedin: "https://www.linkedin.com/in/tienbh/",
  },
  photo: {
    src: "/images/profile/bui-huu-tien.jpg",
    alt: {
      en: "Portrait of Bùi Hữu Tiến",
      vi: "Ảnh chân dung Bùi Hữu Tiến",
    },
    width: 1122,
    height: 1402,
  },
  // Web versions of the CV: no phone number, city only (D18).
  cv: {
    en: "/files/Bui-Huu-Tien-CV-EN.pdf",
    vi: "/files/Bui-Huu-Tien-CV-VI.pdf",
  },
  hero: {
    codeIdeas: [
      { en: "Better products", vi: "Sản phẩm tốt hơn" },
      { en: "Happier users", vi: "Người dùng hài lòng" },
      { en: "Positive impact", vi: "Tác động tích cực" },
    ],
    codeComment: { en: "Keep building...", vi: "Tiếp tục xây dựng..." },
    loop: [
      { en: "Build", vi: "Xây dựng" },
      { en: "Ship", vi: "Triển khai" },
      { en: "Learn", vi: "Học hỏi" },
      { en: "Repeat", vi: "Lặp lại" },
    ],
    note: {
      en: "Good products,\nbetter people",
      vi: "Sản phẩm tốt,\ncon người tốt hơn",
    },
    tagline: {
      en: "Full-stack Engineer\nSaaS · EdTech · AI",
      vi: "Full-stack Engineer\nSaaS · EdTech · AI",
    },
  },
};
