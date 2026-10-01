import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyBody } from "@/components/projects/case-study-body";
import { CaseStudyHeader } from "@/components/projects/case-study-header";
import { getLocale } from "@/i18n/dictionaries";
import { getCaseStudy, getCaseStudySlugs, getSiteProfile } from "@/lib/content";

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const [study, profile] = await Promise.all([
    getCaseStudy(slug, locale),
    getSiteProfile(locale),
  ]);
  if (!study) return {};
  return {
    title: `${study.title} — ${profile.name}`,
    description: study.impactStatement,
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const study = await getCaseStudy(slug, locale);
  if (!study) notFound();

  return (
    <main id="main" className="flex-1">
      <article>
        <CaseStudyHeader study={study} />
        <CaseStudyBody study={study} />
      </article>
    </main>
  );
}
