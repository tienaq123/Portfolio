import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { experiencesData } from "./data/experiences";
import { knowledgeData } from "./data/knowledge";
import { metricsData, strengthsData } from "./data/highlights";
import { projectsData } from "./data/projects";
import { siteProfileData } from "./data/site";
import { skillCategoriesData, skillsData } from "./data/skills";
import {
  experienceSchema,
  knowledgeSchema,
  metricSchema,
  projectSchema,
  siteProfileSchema,
  skillCategorySchema,
  skillSchema,
  strengthSchema,
  type Experience,
  type LocalizedText,
  type MediaRef,
  type Metric,
  type Project,
  type Strength,
} from "./schema";

/*
 * Content service. Pages call these async getters and pass the localized
 * results to components as props. The static data is validated once at
 * import, so a missing translation or a bad shape fails the build. In M7 the
 * implementation moves to Supabase behind the same signatures.
 */

const profile = siteProfileSchema.parse(siteProfileData);
const metrics = z.array(metricSchema).parse(metricsData);
const strengths = z.array(strengthSchema).parse(strengthsData);
const skillCategories = z.array(skillCategorySchema).parse(skillCategoriesData);
const skills = z.array(skillSchema).parse(skillsData);
const experiences = z.array(experienceSchema).parse(experiencesData);
const projects = z.array(projectSchema).parse(projectsData);
const knowledge = z.array(knowledgeSchema).parse(knowledgeData);

const tr = (text: LocalizedText, locale: Locale) => text[locale];

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder;

function localizeMedia(media: MediaRef, locale: Locale) {
  return { ...media, alt: tr(media.alt, locale) };
}

export type Media = ReturnType<typeof localizeMedia>;

/** CV for the locale, falling back to the other language while one is missing. */
export async function getCvFile(locale: Locale): Promise<string | null> {
  return profile.cv[locale] ?? profile.cv.en ?? profile.cv.vi;
}

export async function getSiteProfile(locale: Locale) {
  const cvFile = await getCvFile(locale);
  return {
    name: profile.name,
    alternateName: profile.alternateName,
    role: tr(profile.role, locale),
    availability: profile.availability && tr(profile.availability, locale),
    headline: tr(profile.headline, locale),
    headlineAccent:
      profile.headlineAccent && tr(profile.headlineAccent, locale),
    summary: tr(profile.summary, locale),
    location: tr(profile.location, locale),
    links: profile.links,
    photo: profile.photo && localizeMedia(profile.photo, locale),
    /** Stable download URL (app/cv/[locale]); null hides every CV link. */
    cvHref: cvFile ? `/cv/${locale}` : null,
    hero: {
      codeIdeas: profile.hero.codeIdeas.map((idea) => tr(idea, locale)),
      codeComment: tr(profile.hero.codeComment, locale),
      loop: profile.hero.loop.map((step) => tr(step, locale)),
      note: tr(profile.hero.note, locale),
      tagline: tr(profile.hero.tagline, locale),
    },
  };
}

export type SiteProfileView = Awaited<ReturnType<typeof getSiteProfile>>;

export async function getMetrics(locale: Locale) {
  return metrics
    .filter((metric) => metric.published)
    .sort(bySortOrder)
    .map((metric) => ({
      id: metric.id,
      value: metric.value,
      label: tr(metric.label, locale),
      description: metric.description && tr(metric.description, locale),
      iconKey: metric.iconKey,
    }));
}

export type MetricView = Awaited<ReturnType<typeof getMetrics>>[number];
export type MetricIconKey = Metric["iconKey"];

export async function getStrengths(locale: Locale) {
  return strengths
    .filter((strength) => strength.published)
    .sort(bySortOrder)
    .map((strength) => ({
      id: strength.id,
      title: tr(strength.title, locale),
      description: tr(strength.description, locale),
      iconKey: strength.iconKey,
    }));
}

export type StrengthView = Awaited<ReturnType<typeof getStrengths>>[number];
export type StrengthIconKey = Strength["iconKey"];

export async function getSkillGroups(locale: Locale) {
  return [...skillCategories].sort(bySortOrder).map((category) => ({
    key: category.key,
    label: tr(category.label, locale),
    skills: skills
      .filter((skill) => skill.published && skill.categoryKey === category.key)
      .sort(bySortOrder)
      .map((skill) => skill.name),
  }));
}

export type SkillGroupView = Awaited<ReturnType<typeof getSkillGroups>>[number];

export async function getExperiences(locale: Locale) {
  return experiences
    .filter((experience) => experience.published)
    .sort(bySortOrder)
    .map((experience) => ({
      id: experience.id,
      type: experience.type,
      organization: tr(experience.organization, locale),
      role: tr(experience.role, locale),
      startDate: experience.startDate,
      endDate: experience.endDate,
      highlights: experience.highlights.map((item) => tr(item, locale)),
    }));
}

export type ExperienceView = Awaited<ReturnType<typeof getExperiences>>[number];
export type ExperienceType = Experience["type"];

function localizeProject(project: (typeof projects)[number], locale: Locale) {
  return {
    slug: project.slug,
    title: project.title,
    tags: project.tags.map((tag) => ({
      label: tr(tag.label, locale),
      tone: tag.tone,
    })),
    summary: tr(project.summary, locale),
    highlights: project.highlights.map((item) => tr(item, locale)),
    techStack: project.techStack,
    role: tr(project.role, locale),
    teamSize: project.teamSize,
    timeline: tr(project.timeline, locale),
    status: project.status,
    liveUrl: project.liveUrl,
    thumbnail: project.thumbnail && localizeMedia(project.thumbnail, locale),
    /** Only projects with a written case study get a detail page. */
    hasCaseStudy: project.sections.length > 0,
  };
}

export type ProjectSummary = ReturnType<typeof localizeProject>;

const publishedProjects = () =>
  projects.filter((project) => project.published).sort(bySortOrder);

export async function getProjects(locale: Locale) {
  return publishedProjects().map((project) => localizeProject(project, locale));
}

export async function getFeaturedProjects(locale: Locale) {
  return publishedProjects()
    .filter((project) => project.featured)
    .map((project) => localizeProject(project, locale));
}

const caseStudies = () =>
  publishedProjects().filter((project) => project.sections.length > 0);

export async function getCaseStudySlugs() {
  return caseStudies().map((project) => project.slug);
}

/** Full case study for /work/[slug]; null when the slug has no published case study. */
export async function getCaseStudy(slug: string, locale: Locale) {
  const list = caseStudies();
  const index = list.findIndex((project) => project.slug === slug);
  const project = list[index];
  if (!project) return null;

  // Wraps around so the last case study points back to the first.
  const next = list.length > 1 ? list[(index + 1) % list.length] : undefined;

  return {
    ...localizeProject(project, locale),
    // The schema guarantees an impact statement whenever sections exist.
    impactStatement: tr(project.impactStatement ?? project.summary, locale),
    keyMetrics: project.keyMetrics.map((metric) => ({
      value: metric.value,
      label: tr(metric.label, locale),
    })),
    sections: [...project.sections].sort(bySortOrder).map((section) => ({
      type: section.type,
      title: section.title && tr(section.title, locale),
      body: tr(section.body, locale),
      media: section.media.map((media) => localizeMedia(media, locale)),
    })),
    next: next && { slug: next.slug, title: next.title },
  };
}

export type CaseStudyView = NonNullable<
  Awaited<ReturnType<typeof getCaseStudy>>
>;
export type ProjectStatus = NonNullable<Project["status"]>;

/** Assistant-only facts. Private entries never leave this module. */
export async function getAiKnowledge() {
  return knowledge.filter((entry) => entry.visibility === "public_ai");
}

export type AiKnowledge = Awaited<ReturnType<typeof getAiKnowledge>>[number];
