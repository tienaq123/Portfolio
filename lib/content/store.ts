import { z } from "zod";
import { experiencesData } from "./data/experiences";
import { metricsData, strengthsData } from "./data/highlights";
import { knowledgeData } from "./data/knowledge";
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
} from "./schema";

/**
 * Everything the site renders, validated as one unit: a missing
 * translation or a bad shape fails the build (static data) or the
 * revalidation (database), never a page half-way.
 */
export const contentStoreSchema = z.object({
  profile: siteProfileSchema,
  metrics: z.array(metricSchema),
  strengths: z.array(strengthSchema),
  skillCategories: z.array(skillCategorySchema),
  skills: z.array(skillSchema),
  experiences: z.array(experienceSchema),
  projects: z.array(projectSchema),
  knowledge: z.array(knowledgeSchema),
});

export type ContentStore = z.infer<typeof contentStoreSchema>;

/**
 * The static files in lib/content/data. Since M7 they are the seed of the
 * database (scripts/generate-seed.ts) and the fallback when no database is
 * configured (local development without Supabase, CI).
 */
export function staticContent(): ContentStore {
  return contentStoreSchema.parse({
    profile: siteProfileData,
    metrics: metricsData,
    strengths: strengthsData,
    skillCategories: skillCategoriesData,
    skills: skillsData,
    experiences: experiencesData,
    projects: projectsData,
    knowledge: knowledgeData,
  });
}
