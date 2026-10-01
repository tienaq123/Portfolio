import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackView } from "@/components/analytics/track-view";
import { CaseStudyBody } from "@/components/projects/case-study-body";
import { CaseStudyHeader } from "@/components/projects/case-study-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCaseStudy, getCaseStudySlugs, getSiteProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const [study, profile, t] = await Promise.all([
    getCaseStudy(slug, locale),
    getSiteProfile(locale),
    getDictionary(),
  ]);
  if (!study) return {};
  const title = t.caseStudy.documentTitle.replace("{title}", study.title);
  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: `${title} — ${profile.name}`,
    description: study.summary,
    siteName: profile.name,
    type: "article",
  });
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const study = await getCaseStudy(slug, locale);
  if (!study) notFound();

  return (
    <main id="main" className="flex-1">
      <TrackView
        event="project_case_study_viewed"
        data={{ slug: study.slug, locale }}
      />
      <article>
        <CaseStudyHeader study={study} />
        <CaseStudyBody study={study} />
      </article>
    </main>
  );
}
