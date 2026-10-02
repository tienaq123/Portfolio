import { z } from "zod";

// Shapes mirror the future Supabase tables (M7): localized text is { en, vi }.

export const localizedText = z.object({
  en: z.string().trim().min(1),
  vi: z.string().trim().min(1),
});

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");

export const mediaRef = z.object({
  src: z.string().min(1),
  alt: localizedText,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const siteProfileSchema = z.object({
  name: z.string().min(1),
  /** Name without diacritics, as written on the English CV (JSON-LD alternateName). */
  alternateName: z.string().min(1),
  role: localizedText,
  availability: localizedText.nullable(),
  headline: localizedText,
  /** Substring of `headline` rendered in the accent color. */
  headlineAccent: localizedText.nullable(),
  summary: localizedText,
  location: localizedText,
  links: z.object({
    email: z.email(),
    github: z.url(),
    linkedin: z.url(),
  }),
  photo: mediaRef.nullable(),
  /** Public paths of the web (redacted) CV per locale; null = not available yet. */
  cv: z.object({ en: z.string().nullable(), vi: z.string().nullable() }),
  hero: z.object({
    codeIdeas: z.array(localizedText).min(1),
    codeComment: localizedText,
    loop: z.array(localizedText).length(4),
    note: localizedText,
    tagline: localizedText,
  }),
});

export const metricSchema = z.object({
  id: z.string().min(1),
  value: z.string().min(1),
  label: localizedText,
  description: localizedText.nullable(),
  iconKey: z.enum(["calendar", "users", "code", "box"]),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

export const strengthSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  description: localizedText,
  iconKey: z.enum(["layers", "code", "brain", "cloud"]),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

export const skillCategorySchema = z.object({
  key: z.string().min(1),
  label: localizedText,
  sortOrder: z.number().int(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  categoryKey: z.string().min(1),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["work", "education"]),
  organization: localizedText,
  role: localizedText,
  startDate: yearMonth,
  endDate: yearMonth.nullable(),
  highlights: z.array(localizedText),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

export const sectionTypes = [
  "context",
  "problem",
  "responsibility",
  "constraints",
  "architecture",
  "decisions",
  "tradeoffs",
  "implementation",
  "results",
  "learnings",
  "gallery",
] as const;

export const projectSectionSchema = z.object({
  type: z.enum(sectionTypes),
  title: localizedText.nullable(),
  /** Markdown. */
  body: localizedText,
  media: z.array(mediaRef),
  sortOrder: z.number().int(),
});

export const badgeTones = ["neutral", "accent", "success", "violet"] as const;

export const projectStatuses = ["production", "internal", "archived"] as const;

export const projectSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    experienceId: z.string().nullable(),
    title: z.string().min(1),
    tags: z.array(z.object({ label: localizedText, tone: z.enum(badgeTones) })),
    summary: localizedText,
    highlights: z.array(localizedText).min(1),
    techStack: z.array(z.string().min(1)).min(1),
    role: localizedText,
    teamSize: z.string().min(1),
    timeline: localizedText,
    status: z.enum(projectStatuses).nullable(),
    /** Public product URL; null for internal or unreleased work. */
    liveUrl: z.url().nullable(),
    thumbnail: mediaRef.nullable(),
    featured: z.boolean(),
    published: z.boolean(),
    sortOrder: z.number().int(),
    /** One-sentence lead of the case study page. */
    impactStatement: localizedText.nullable(),
    /** Headline numbers of the case study; values are locale-neutral ("12.4K+"). */
    keyMetrics: z.array(
      z.object({ value: z.string().min(1), label: localizedText }),
    ),
    /** Case study body. Empty = no case study page yet. */
    sections: z.array(projectSectionSchema),
  })
  .refine(
    (project) =>
      project.sections.length === 0 || project.impactStatement !== null,
    {
      message: "A project with a case study needs an impactStatement",
      path: ["impactStatement"],
    },
  );

/**
 * Facts only the AI assistant uses (career preferences, working style…).
 * Written in English, the assistant's canonical language (D11). Only
 * `public_ai` entries ever reach the model; the filter lives in code.
 */
export const knowledgeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Shown in the chat's "Based on" list. */
  title: localizedText,
  visibility: z.enum(["public_ai", "private"]),
  facts: z.array(z.string().trim().min(1)).min(1),
});

export type LocalizedText = z.infer<typeof localizedText>;
export type MediaRef = z.infer<typeof mediaRef>;
export type SiteProfile = z.infer<typeof siteProfileSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type Strength = z.infer<typeof strengthSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Knowledge = z.infer<typeof knowledgeSchema>;
export type ProjectSection = z.infer<typeof projectSectionSchema>;
export type SectionType = (typeof sectionTypes)[number];
export type BadgeTone = (typeof badgeTones)[number];
