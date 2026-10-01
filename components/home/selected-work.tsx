import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import type { ProjectSummary } from "@/lib/content";

export async function SelectedWork({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="pt-16 pb-12 lg:pt-24 lg:pb-16"
    >
      <Container>
        <SectionHeading
          id="work-title"
          title={t.home.work.title}
          description={t.home.work.description}
          action={
            <Link
              href={`/${locale}/work`}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              {t.home.work.viewAll}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          }
        />
        <div className="mt-10">
          <ProjectGrid projects={projects} />
        </div>
      </Container>
    </section>
  );
}
