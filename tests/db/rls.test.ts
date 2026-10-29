import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { contentTables, type ContentTable } from "@/lib/content/rows";
import { staticContent, type ContentStore } from "@/lib/content/store";
import { fetchContent } from "@/lib/content/supabase";
import { anon, service, signedIn } from "./local";

// M7-T3: RLS on the content tables, against the local Supabase stack.

const DRAFT = "zz-rls-draft";
const PRIVATE = "zz-rls-private";
const password = "rls-test-password-1";
const users = {
  member: `rls-member-${Date.now()}@example.test`,
  admin: `rls-admin-${Date.now()}@example.test`,
};
const userIds: string[] = [];
const questionId = crypto.randomUUID();

const localized = (text: string) => ({ en: text, vi: text });

/** Row order from the database is not meaningful (getters sort). */
function normalized(store: ContentStore) {
  const byKey = <T>(items: T[], key: (item: T) => string) =>
    [...items].sort((a, b) => key(a).localeCompare(key(b)));
  return {
    ...store,
    metrics: byKey(store.metrics, (item) => item.id),
    strengths: byKey(store.strengths, (item) => item.id),
    skillCategories: byKey(store.skillCategories, (item) => item.key),
    skills: byKey(store.skills, (item) => item.name),
    experiences: byKey(store.experiences, (item) => item.id),
    projects: byKey(store.projects, (item) => item.id),
  };
}

/** A real row and a real change per table: an empty patch never reaches SQL. */
const seed = staticContent();
const firstProject = seed.projects[0]!;
const writes: Record<
  ContentTable,
  { column: string; value: string | number; patch: Record<string, unknown> }
> = {
  site_profile: { column: "id", value: 1, patch: { name: "hacked" } },
  metrics: {
    column: "id",
    value: seed.metrics[0]!.id,
    patch: { value: "hacked" },
  },
  strengths: {
    column: "id",
    value: seed.strengths[0]!.id,
    patch: { sort_order: 99 },
  },
  skill_categories: {
    column: "key",
    value: seed.skillCategories[0]!.key,
    patch: { sort_order: 99 },
  },
  skills: {
    column: "name",
    value: seed.skills[0]!.name,
    patch: { sort_order: 99 },
  },
  experiences: {
    column: "id",
    value: seed.experiences[0]!.id,
    patch: { sort_order: 99 },
  },
  projects: {
    column: "id",
    value: firstProject.id,
    patch: { title: "hacked" },
  },
  project_sections: {
    column: "project_id",
    value: firstProject.id,
    patch: { sort_order: 99 },
  },
  knowledge_entries: {
    column: "id",
    value: seed.knowledge[0]!.id,
    patch: { summary: "hacked" },
  },
};

beforeAll(async () => {
  const db = service();
  const draft = await db.from("projects").insert({
    id: DRAFT,
    slug: DRAFT,
    title: "Draft project",
    summary: localized("Not public yet"),
    highlights: [localized("Hidden")],
    tech_stack: ["Laravel"],
    role: localized("Full-stack"),
    team_size: "1",
    timeline: localized("2026"),
    published: false,
  });
  expect(draft.error).toBeNull();
  const section = await db.from("project_sections").insert({
    project_id: DRAFT,
    type: "context",
    body: localized("Hidden section"),
  });
  expect(section.error).toBeNull();
  const knowledge = await db.from("knowledge_entries").insert({
    id: PRIVATE,
    title: localized("Private"),
    summary: "Never for the assistant",
    facts: ["secret fact"],
    visibility: "private",
  });
  expect(knowledge.error).toBeNull();
  const question = await db.from("chat_questions").insert({
    id: questionId,
    session_id: crypto.randomUUID(),
    question: "rls test",
    locale: "en",
  });
  expect(question.error).toBeNull();

  for (const email of [users.member, users.admin]) {
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    expect(error).toBeNull();
    if (data.user) userIds.push(data.user.id);
  }
  const admin = await db.from("admin_users").insert({ user_id: userIds[1]! });
  expect(admin.error).toBeNull();
});

afterAll(async () => {
  const db = service();
  await db.from("projects").delete().eq("id", DRAFT);
  await db.from("knowledge_entries").delete().eq("id", PRIVATE);
  await db.from("chat_questions").delete().eq("id", questionId);
  for (const id of userIds) await db.auth.admin.deleteUser(id);
});

describe("visitors (publishable key)", () => {
  it("read exactly the published content — the seed, unchanged", async () => {
    expect(normalized(await fetchContent(anon()))).toEqual(
      normalized(staticContent()),
    );
  });

  it("never see drafts, their sections or private knowledge", async () => {
    const db = anon();
    const projects = await db.from("projects").select("id");
    expect(projects.data?.map((row) => row.id)).not.toContain(DRAFT);
    const sections = await db
      .from("project_sections")
      .select("id")
      .eq("project_id", DRAFT);
    expect(sections.data).toEqual([]);
    const knowledge = await db.from("knowledge_entries").select("id");
    expect(knowledge.data?.map((row) => row.id)).not.toContain(PRIVATE);
  });

  it("cannot read chat questions or the admin list", async () => {
    const db = anon();
    for (const table of ["chat_questions", "admin_users"] as const) {
      const { data, error } = await db.from(table).select("*");
      expect(error?.code ?? (data?.length === 0 ? "empty" : "leak")).not.toBe(
        "leak",
      );
    }
  });

  it("cannot insert, update or delete anything (permission denied)", async () => {
    const db = anon();
    // Published content (drafts may be incomplete by design).
    const before = await fetchContent(db);
    for (const table of contentTables) {
      const { column, value, patch } = writes[table];
      const insert = await db.from(table).insert(patch as never);
      expect(insert.error?.code, `insert ${table}`).toBe("42501");
      const update = await db
        .from(table)
        .update(patch as never)
        .eq(column as never, value as never);
      expect(update.error?.code, `update ${table}`).toBe("42501");
      const remove = await db
        .from(table)
        .delete()
        .eq(column as never, value as never);
      expect(remove.error?.code, `delete ${table}`).toBe("42501");
    }
    expect(normalized(await fetchContent(db))).toEqual(normalized(before));
  });
});

describe("signed-in users", () => {
  it("who are not admins get the same view as visitors and cannot write", async () => {
    const db = await signedIn(users.member, password);
    const projects = await db.from("projects").select("id");
    expect(projects.data?.map((row) => row.id)).not.toContain(DRAFT);
    const write = await db
      .from("metrics")
      .update({ value: "hacked" })
      .eq("id", "experience")
      .select();
    expect(write.data ?? []).toEqual([]);
    const questions = await db.from("chat_questions").select("id");
    expect(questions.data ?? []).toEqual([]);
  });

  it("who are admins see drafts, can edit and can read chat questions", async () => {
    const db = await signedIn(users.admin, password);
    const projects = await db.from("projects").select("id");
    expect(projects.data?.map((row) => row.id)).toContain(DRAFT);
    const knowledge = await db.from("knowledge_entries").select("id");
    expect(knowledge.data?.map((row) => row.id)).toContain(PRIVATE);
    const edit = await db
      .from("projects")
      .update({ title: "Draft project (edited)" })
      .eq("id", DRAFT)
      .select("title");
    expect(edit.data).toEqual([{ title: "Draft project (edited)" }]);
    const questions = await db.from("chat_questions").select("id");
    expect(questions.data?.map((row) => row.id)).toContain(questionId);
  });
});
