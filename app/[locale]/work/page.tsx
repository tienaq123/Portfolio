import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Container } from "@/components/ui/container";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getProjects, getSiteProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { name } = await getSiteProfile(locale);
  return pageMetadata({
    locale,
    path: "/work",
    title: `${t.work.title} — ${name}`,
    description: t.work.description,
    siteName: name,
  });
}

export default async function WorkPage() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const projects = await getProjects(locale);

  return (
    <main id="main" className="flex-1">
      <Container className="py-12 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="text-display">{t.work.title}</h1>
          <p className="mt-4 text-lg leading-relaxed">{t.work.description}</p>
        </div>
        <div className="mt-10 lg:mt-12">
          <ProjectGrid projects={projects} headingLevel={2} />
        </div>
      </Container>
    </main>
  );
}
