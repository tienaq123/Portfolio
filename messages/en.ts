// UI strings only. Portfolio content (projects, experience…) lives in lib/content.
export const en = {
  metadata: {
    title: "Bùi Hữu Tiến — Full-stack Engineer",
    description:
      "Full-stack Engineer building production SaaS, EdTech & AI systems.",
  },
  a11y: {
    skipToContent: "Skip to content",
    opensInNewTab: "(opens in a new tab)",
  },
  nav: {
    primary: "Main navigation",
    work: "Work",
    about: "About",
    skills: "Skills",
    contact: "Contact",
    cta: "Let's Talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  languageSwitcher: {
    label: "Language",
  },
  footer: {
    nav: "Footer navigation",
    backToTop: "Back to top",
  },
  home: {
    viewProjects: "View Projects",
    downloadCv: "Download CV",
    metricsLabel: "Highlights",
    work: {
      title: "Selected Work",
      description:
        "A few products I've built and contributed to, from EdTech platforms to AI-powered tools.",
      readCaseStudy: "Read case study",
    },
    strengths: {
      title: "Engineering Strengths",
      description:
        "End-to-end skills for turning ideas into real, scalable products.",
    },
    stack: {
      title: "Tech Stack",
      description: "Technologies I use to build modern web applications.",
    },
    experience: {
      title: "Experience",
      description: "My professional journey so far.",
      present: "Present",
      work: "Work",
      education: "Education",
    },
    contact: {
      title: "Let's build something great",
      description:
        "I'm always open to discussing new opportunities, interesting projects or just having a chat about technology.",
      email: "Email Me",
      github: "GitHub",
      linkedin: "LinkedIn",
      cv: "Download CV",
    },
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for does not exist or has moved.",
    backHome: "Back to home",
  },
};

export type Messages = typeof en;
