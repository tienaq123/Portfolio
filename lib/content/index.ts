import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  Experience,
  LocalizedText,
  MediaRef,
  Metric,
  Project,
  Strength,
} from "./schema";
import { staticContent, type ContentStore } from "./store";
import { fetchContent } from "./supabase";

/*
 * Content service. Pages call these async getters and pass the localized
 * results to components as props. Since M7 the content comes from Supabase
 * (RLS: published rows only) when it is configured, else from the static
 * seed data — same shapes, validated with the same Zod schemas.
 */

/** Cache tag of every piece of content; /api/revalidate refreshes it. */
export const CONTENT_TAG = "content";

/**
 * All content, cached across requests and builds until revalidated. Pages
 * stay static: the first render fills the cache, edits refresh it through
 * revalidateTag(CONTENT_TAG). A failing database throws here, so Next.js
 * keeps serving the last good pages.
 */
async function getStore(): Promise<ContentStore> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  const client = createPublicClient();
  if (!client) return staticContent();
  try {
    return await fetchContent(client);
  } catch (error) {
    // Rethrown: Next.js keeps the last good pages. Logged so an outage or a
    // bad row is visible in the server logs.
    console.error("[content] could not load from Supabase:", error);
    throw error;
  }
}

const tr = (text: LocalizedText, locale: Locale) => text[locale];

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder;

function localizeMedia(media: MediaRef, locale: Locale) {
  return { ...media, alt: tr(media.alt, locale) };
}

export type Media = ReturnType<typeof localizeMedia>;

/** CV for the locale, falling back to the other language while one is missing. */
export async function getCvFile(locale: Locale): Promise<string | null> {
  const { profile } = await getStore();
  return profile.cv[locale] ?? profile.cv.en ?? profile.cv.vi;
}

export async function getSiteProfile(locale: Locale) {
  const [{ profile }, cvFile] = await Promise.all([
    getStore(),
    getCvFile(locale),
  ]);
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
  const { metrics } = await getStore();
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
  const { strengths } = await getStore();
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
  const { skillCategories, skills } = await getStore();
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
  const { experiences } = await getStore();
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

function localizeProject(project: Project, locale: Locale) {
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

async function publishedProjects() {
  const { projects } = await getStore();
  return projects.filter((project) => project.published).sort(bySortOrder);
}

export async function getProjects(locale: Locale) {
  return (await publishedProjects()).map((project) =>
    localizeProject(project, locale),
  );
}

export async function getFeaturedProjects(locale: Locale) {
  return (await publishedProjects())
    .filter((project) => project.featured)
    .map((project) => localizeProject(project, locale));
}

async function caseStudies() {
  return (await publishedProjects()).filter(
    (project) => project.sections.length > 0,
  );
}

export async function getCaseStudySlugs() {
  return (await caseStudies()).map((project) => project.slug);
}

/** Full case study for /work/[slug]; null when the slug has no published case study. */
export async function getCaseStudy(slug: string, locale: Locale) {
  const list = await caseStudies();
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

/**
 * Assistant-only facts. Private entries never leave this module (and with
 * the database, RLS never even returns them).
 */
export async function getAiKnowledge() {
  const { knowledge } = await getStore();
  return knowledge.filter((entry) => entry.visibility === "public_ai");
}

export type AiKnowledge = Awaited<ReturnType<typeof getAiKnowledge>>[number];
