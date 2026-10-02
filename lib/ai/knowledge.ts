import "server-only";
import type { Locale } from "@/i18n/config";
import {
  getAiKnowledge,
  getCaseStudy,
  getExperiences,
  getMetrics,
  getProjects,
  getSiteProfile,
  getSkillGroups,
} from "@/lib/content";
import type { ChatSource } from "@/lib/chat/types";
import { en } from "@/messages/en";
import { vi } from "@/messages/vi";

const messages = { en, vi };

/*
 * What the assistant may know, built from the content service (English, D11)
 * plus the AI-only knowledge. Only published records exist here: the "public
 * data only" rule is enforced by construction, not by the prompt.
 */

export type KnowledgeRecordType =
  "profile" | "experience" | "education" | "skills" | "project" | "knowledge";

export type KnowledgeRecord = {
  /** Stable id the model passes to get_details, e.g. "project:prep4u". */
  id: string;
  type: KnowledgeRecordType;
  title: string;
  /** One or two sentences for the compact index. */
  summary: string;
  tags: string[];
  /** Everything the assistant may say about the record. */
  detail: string;
};

/** get_details accepts at most this many ids per call. */
export const MAX_DETAIL_IDS = 4;
/** Case studies are long; each project's detail is cut to this size. */
export const MAX_PROJECT_DETAIL_CHARS = 9000;

const month = (value: string) => {
  const [year, mm] = value.split("-");
  return `${mm}/${year}`;
};

const period = (start: string, end: string | null) =>
  `${month(start)} – ${end ? month(end) : "present"}`;

const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0] ?? text;

const bullets = (items: string[]) =>
  items.map((item) => `- ${item}`).join("\n");

function clip(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}\n[…]`;
}

async function buildRecords(): Promise<KnowledgeRecord[]> {
  const locale: Locale = "en";
  const [profile, metrics, experiences, skillGroups, projects, knowledge] =
    await Promise.all([
      getSiteProfile(locale),
      getMetrics(locale),
      getExperiences(locale),
      getSkillGroups(locale),
      getProjects(locale),
      getAiKnowledge(),
    ]);

  const records: KnowledgeRecord[] = [];

  records.push({
    id: "profile",
    type: "profile",
    title: `${profile.name} (${profile.alternateName}) — profile`,
    summary: `${profile.role} based in ${profile.location}. ${firstSentence(profile.summary)}`,
    tags: ["overview", "contact"],
    detail: [
      `Name: ${profile.name} (written without diacritics: ${profile.alternateName}; people call him Tiến).`,
      `Role: ${profile.role}. Location: ${profile.location}.`,
      profile.availability && `Status: ${profile.availability}.`,
      `Headline: ${profile.headline}`,
      `Summary: ${profile.summary}`,
      `Key numbers:\n${bullets(
        metrics.map(
          (metric) =>
            `${metric.value} ${metric.label}${metric.description ? ` (${metric.description})` : ""}`,
        ),
      )}`,
      `Contact: email ${profile.links.email}; LinkedIn ${profile.links.linkedin}. CV: /cv/en (English), /cv/vi (Vietnamese).`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  for (const item of experiences) {
    const isWork = item.type === "work";
    records.push({
      id: `${isWork ? "exp" : "edu"}:${item.id}`,
      type: isWork ? "experience" : "education",
      title: `${item.role} — ${item.organization}`,
      summary:
        `${period(item.startDate, item.endDate)}. ${item.highlights[0] ?? ""}`.trim(),
      tags: [isWork ? "work history" : "education"],
      detail: [
        `${item.role} at ${item.organization}, ${period(item.startDate, item.endDate)}.`,
        bullets(item.highlights),
      ].join("\n"),
    });
  }

  records.push({
    id: "skills",
    type: "skills",
    title: "Technical skills",
    summary: skillGroups
      .map((group) => `${group.label}: ${group.skills.slice(0, 4).join(", ")}`)
      .join("; "),
    tags: ["stack", "technologies"],
    detail: skillGroups
      .map((group) => `${group.label}: ${group.skills.join(", ")}`)
      .join("\n"),
  });

  for (const project of projects) {
    const study = project.hasCaseStudy
      ? await getCaseStudy(project.slug, locale)
      : null;
    const parts: (string | false | null)[] = [
      `Project: ${project.title}. ${project.summary}`,
      `Role: ${project.role}. Team: ${project.teamSize === "1" ? "solo" : `${project.teamSize} people`}. Timeline: ${project.timeline}.${project.status ? ` Status: ${project.status}.` : ""}`,
      project.liveUrl && `Live site: ${project.liveUrl}`,
      `Tech: ${project.techStack.join(", ")}`,
      `Highlights:\n${bullets(project.highlights)}`,
    ];
    if (study) {
      parts.push(
        `Impact: ${study.impactStatement}`,
        study.keyMetrics.length > 0 &&
          `Key metrics:\n${bullets(study.keyMetrics.map((metric) => `${metric.value} ${metric.label}`))}`,
        `Case study page: /work/${project.slug}`,
        ...study.sections.map(
          (section) =>
            `## ${section.title ?? en.caseStudy.sections[section.type]}\n${section.body}`,
        ),
      );
    } else {
      parts.push("No case study page yet.");
    }
    records.push({
      id: `project:${project.slug}`,
      type: "project",
      title: project.title,
      summary: `${project.summary} (${project.timeline})`,
      tags: [...project.tags.map((tag) => tag.label), ...project.techStack],
      detail: clip(parts.filter(Boolean).join("\n"), MAX_PROJECT_DETAIL_CHARS),
    });
  }

  for (const entry of knowledge) {
    records.push({
      id: `knowledge:${entry.id}`,
      type: "knowledge",
      title: entry.title.en,
      summary: entry.facts[0] ?? "",
      tags: [entry.id],
      detail: bullets(entry.facts),
    });
  }

  return records;
}

// Content is static per deployment, so the records are built once.
let recordsPromise: Promise<KnowledgeRecord[]> | undefined;

export function getKnowledgeRecords() {
  recordsPromise ??= buildRecords();
  return recordsPromise;
}

/** Sent with every request: one line per record. */
export async function getCompactIndex() {
  const records = await getKnowledgeRecords();
  return records
    .map(
      (record) =>
        `- [${record.id}] ${record.title} — ${record.summary} {${record.tags.join(", ")}}`,
    )
    .join("\n");
}

/** Valid, unique ids in request order, capped at MAX_DETAIL_IDS. */
export async function resolveIds(ids: readonly string[]) {
  const records = await getKnowledgeRecords();
  const known = new Set(records.map((record) => record.id));
  return [...new Set(ids)]
    .filter((id) => known.has(id))
    .slice(0, MAX_DETAIL_IDS);
}

/** Tool result for get_details. Unknown ids are reported, never invented. */
export async function getDetails(ids: readonly string[]) {
  const records = await getKnowledgeRecords();
  const valid = await resolveIds(ids);
  const unknown = ids.filter((id) => !valid.includes(id));
  const blocks = valid.map((id) => {
    const record = records.find((item) => item.id === id);
    return `<record id="${id}">\n${record?.detail ?? ""}\n</record>`;
  });
  if (unknown.length > 0) {
    blocks.push(
      `Not available: ${unknown.join(", ")} (unknown id or over the limit of ${MAX_DETAIL_IDS}).`,
    );
  }
  return { ids: valid, text: blocks.join("\n\n") };
}

/** "Based on" links for the chat, titled and linked for the page locale. */
export async function toSources(
  ids: readonly string[],
  locale: Locale,
): Promise<ChatSource[]> {
  const t = messages[locale];
  const [records, experiences, projects, knowledge, profile] =
    await Promise.all([
      getKnowledgeRecords(),
      getExperiences(locale),
      getProjects(locale),
      getAiKnowledge(),
      getSiteProfile(locale),
    ]);

  return ids.flatMap((id): ChatSource[] => {
    const record = records.find((item) => item.id === id);
    if (!record) return [];
    const [, key = ""] = id.split(":");
    switch (record.type) {
      case "project": {
        const project = projects.find((item) => item.slug === key);
        if (!project) return [];
        const href = project.hasCaseStudy
          ? `/${locale}/work/${project.slug}`
          : `/${locale}/work`;
        return [{ id, title: project.title, href }];
      }
      case "experience":
      case "education": {
        const item = experiences.find((entry) => entry.id === key);
        return item
          ? [{ id, title: item.organization, href: `/${locale}#about` }]
          : [];
      }
      case "skills":
        return [{ id, title: t.nav.skills, href: `/${locale}#skills` }];
      case "profile":
        return [{ id, title: profile.name, href: `/${locale}` }];
      case "knowledge": {
        const entry = knowledge.find((item) => item.id === key);
        return entry ? [{ id, title: entry.title[locale], href: null }] : [];
      }
    }
  });
}
