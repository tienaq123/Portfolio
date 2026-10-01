import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";
import { SelectedWork } from "@/components/home/selected-work";
import { Strengths } from "@/components/home/strengths";
import { TechStack } from "@/components/home/tech-stack";
import { getLocale } from "@/i18n/dictionaries";
import {
  getExperiences,
  getFeaturedProjects,
  getMetrics,
  getSiteProfile,
  getSkillGroups,
  getStrengths,
} from "@/lib/content";

// Section ids match the header nav anchors: work, skills, about, contact.
export default async function HomePage() {
  const locale = await getLocale();
  const [profile, metrics, projects, strengths, skillGroups, experiences] =
    await Promise.all([
      getSiteProfile(locale),
      getMetrics(locale),
      getFeaturedProjects(locale),
      getStrengths(locale),
      getSkillGroups(locale),
      getExperiences(locale),
    ]);

  return (
    <main id="main" className="flex-1">
      <Hero profile={profile} />
      <ProofStrip metrics={metrics} />
      <SelectedWork projects={projects} />
      <div id="skills">
        <Strengths strengths={strengths} />
        <TechStack groups={skillGroups} />
      </div>
      <Experience items={experiences} />
      <Contact profile={profile} />
    </main>
  );
}
