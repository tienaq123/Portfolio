import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { experiencesData } from "./data/experiences";
import { metricsData, strengthsData } from "./data/highlights";
import { projectsData } from "./data/projects";
import { siteProfileData } from "./data/site";
import { skillCategoriesData, skillsData } from "./data/skills";
import {
  experienceSchema,
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
