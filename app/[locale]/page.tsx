import type { Metadata } from "next";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";
import { SelectedWork } from "@/components/home/selected-work";
import { Strengths } from "@/components/home/strengths";
import { TechStack } from "@/components/home/tech-stack";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import {
  getExperiences,
  getFeaturedProjects,
  getMetrics,
  getSiteProfile,
  getSkillGroups,
  getStrengths,
} from "@/lib/content";
import { homeJsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { name } = await getSiteProfile(locale);
  return pageMetadata({
    locale,
    title: t.metadata.title,
    description: t.metadata.description,
    siteName: name,
  });
}

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
      <JsonLd data={homeJsonLd({ locale, profile, experiences })} />
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
