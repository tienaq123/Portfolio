import type { ContentStore } from "./store";

/*
 * ContentStore ⇄ database rows. Table columns are the domain fields in
 * snake_case (supabase/migrations/20261029000000_content.sql); nested jsonb
 * keeps the domain's camelCase. Project sections live in their own table.
 * Shared by the seed generator and the Supabase reader so both directions
 * stay in step (tests/db checks the round trip).
 */

type Row = Record<string, unknown>;

const snake = (key: string) =>
  key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const camel = (key: string) =>
  key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

/** Top-level keys only; nested jsonb is stored as-is. */
function toSnake(value: object, omit: string[] = []): Row {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !omit.includes(key))
      .map(([key, field]) => [snake(key), field]),
  );
}

/** Drops database-only columns (timestamps, surrogate keys). */
function toCamel(row: Row, omit: string[] = []): Row {
  return Object.fromEntries(
    Object.entries(row)
      .filter(([key]) => !omit.includes(key))
      .map(([key, field]) => [camel(key), field]),
  );
}

export const contentTables = [
  "site_profile",
  "metrics",
  "strengths",
  "skill_categories",
  "skills",
  "experiences",
  "projects",
  "project_sections",
  "knowledge_entries",
] as const;

export type ContentTable = (typeof contentTables)[number];
export type ContentRows = Record<ContentTable, Row[]>;

const TIMESTAMPS = ["created_at", "updated_at"];

export function toRows(store: ContentStore): ContentRows {
  return {
    site_profile: [{ id: 1, ...toSnake(store.profile) }],
    metrics: store.metrics.map((item) => toSnake(item)),
    strengths: store.strengths.map((item) => toSnake(item)),
    skill_categories: store.skillCategories.map((item) => toSnake(item)),
    skills: store.skills.map((item) => toSnake(item)),
    experiences: store.experiences.map((item) => toSnake(item)),
    projects: store.projects.map((project) => toSnake(project, ["sections"])),
    project_sections: store.projects.flatMap((project) =>
      project.sections.map((section) => ({
        project_id: project.id,
        ...toSnake(section),
      })),
    ),
    knowledge_entries: store.knowledge.map((entry) => ({
      ...toSnake(entry),
      published: true,
      sort_order: store.knowledge.indexOf(entry),
    })),
  };
}

/** Unvalidated store; parse it with contentStoreSchema. */
export function fromRows(rows: ContentRows): unknown {
  const sectionsOf = (projectId: unknown) =>
    rows.project_sections
      .filter((section) => section.project_id === projectId)
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
      .map((section) => toCamel(section, ["id", "project_id", ...TIMESTAMPS]));

  return {
    profile: rows.site_profile[0]
      ? toCamel(rows.site_profile[0], ["id", ...TIMESTAMPS])
      : undefined,
    metrics: rows.metrics.map((row) => toCamel(row, TIMESTAMPS)),
    strengths: rows.strengths.map((row) => toCamel(row, TIMESTAMPS)),
    skillCategories: rows.skill_categories.map((row) => toCamel(row)),
    skills: rows.skills.map((row) => toCamel(row)),
    experiences: rows.experiences.map((row) => toCamel(row, TIMESTAMPS)),
    projects: rows.projects.map((row) => ({
      ...toCamel(row, TIMESTAMPS),
      sections: sectionsOf(row.id),
    })),
    knowledge: [...rows.knowledge_entries]
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
      .map((row) => toCamel(row, ["published", "sort_order", ...TIMESTAMPS])),
  };
}
