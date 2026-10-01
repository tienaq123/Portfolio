// UI strings only. Portfolio content (projects, experience…) lives in lib/content.
export const en = {
  metadata: {
    title: "Bùi Hữu Tiến — Full-stack Engineer | SaaS, EdTech & AI",
    description:
      "Full-stack Engineer with 3+ years of experience building production SaaS, EdTech and AI-powered web systems for 15K+ users.",
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
      viewAll: "View all projects",
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
  work: {
    title: "Work",
    description:
      "Products I've built and contributed to, and the engineering behind them.",
  },
  caseStudy: {
    label: "Case study",
    /** Document title; `{title}` is the project name. */
    documentTitle: "{title} case study",
    allProjects: "All projects",
    role: "Role",
    team: "Team",
    timeline: "Timeline",
    status: "Status",
    solo: "Solo",
    people: "people",
    keyMetrics: "Key metrics",
    techStack: "Tech stack",
    onThisPage: "On this page",
    nextProject: "Next case study",
    visitSite: "Visit the live site",
    diagramHint: "Scroll sideways to see the whole diagram",
    statuses: {
      production: "In production",
      internal: "Internal tool",
      archived: "Retired",
    },
    sections: {
      context: "Context",
      problem: "Problem",
      responsibility: "My Responsibility",
      constraints: "Constraints",
      architecture: "Architecture",
      decisions: "Key Technical Decisions",
      tradeoffs: "Trade-offs",
      implementation: "Implementation Highlights",
      results: "Result / Impact",
      learnings: "What I Learned",
      gallery: "Gallery",
    },
  },
  error: {
    title: "Something went wrong",
    description:
      "This page failed to load. Please try again, or head back to the homepage.",
    retry: "Try again",
    backHome: "Back to home",
    reference: "Error reference",
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for does not exist or has moved.",
    backHome: "Back to home",
  },
};

export type Messages = typeof en;
