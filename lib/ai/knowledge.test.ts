import { describe, expect, it } from "vitest";
import { knowledgeData } from "@/lib/content/data/knowledge";
import { projectsData } from "@/lib/content/data/projects";
import {
  getCompactIndex,
  getDetails,
  getKnowledgeRecords,
  MAX_DETAIL_IDS,
  MAX_PROJECT_DETAIL_CHARS,
  toSources,
} from "./knowledge";

describe("knowledge records", () => {
  it("contain only published projects and public_ai knowledge", async () => {
    const ids = (await getKnowledgeRecords()).map((record) => record.id);
    for (const project of projectsData) {
      expect(ids.includes(`project:${project.slug}`)).toBe(project.published);
    }
    for (const entry of knowledgeData) {
      expect(ids.includes(`knowledge:${entry.id}`)).toBe(
        entry.visibility === "public_ai",
      );
    }
  });

  it("keep the compact index within its budget", async () => {
    const index = await getCompactIndex();
    expect(index.length).toBeLessThan(10_000);
    expect(index).toContain("[project:prep4u]");
  });

  it("cap project details", async () => {
    for (const record of await getKnowledgeRecords()) {
      expect(record.detail.length).toBeLessThanOrEqual(
        MAX_PROJECT_DETAIL_CHARS + 10,
      );
    }
  });
});

describe("getDetails", () => {
  it("returns known ids only, capped, and reports the rest", async () => {
    const result = await getDetails([
      "project:prep4u",
      "project:prep4u",
      "project:nope",
      "skills",
      "profile",
      "exp:protean",
      "project:edly",
    ]);
    expect(result.ids).toEqual([
      "project:prep4u",
      "skills",
      "profile",
      "exp:protean",
    ]);
    expect(result.ids.length).toBeLessThanOrEqual(MAX_DETAIL_IDS);
    expect(result.text).toContain("Not available: project:nope");
    expect(result.text).toContain('<record id="skills">');
  });
});

describe("toSources", () => {
  it("links records to pages of the visitor's locale", async () => {
    const sources = await toSources(
      ["project:prep4u", "exp:musashi", "skills", "knowledge:career", "bogus"],
      "vi",
    );
    expect(sources).toEqual([
      { id: "project:prep4u", title: "Prep4u", href: "/vi/work/prep4u" },
      { id: "exp:musashi", title: "Musashi Việt Nam", href: "/vi#about" },
      { id: "skills", title: "Kỹ năng", href: "/vi#skills" },
      { id: "knowledge:career", title: "Định hướng công việc", href: null },
    ]);
  });

  it("sends projects without a case study to the project list", async () => {
    const [source] = await toSources(["project:snacktime-afp"], "en");
    expect(source?.href).toBe("/en/work");
  });
});
