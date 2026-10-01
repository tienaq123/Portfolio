import { ProjectCard } from "@/components/projects/project-card";
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
        />
        {/* First project spans the row; the rest form a 2-column grid. */}
        <ul className="mt-10 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className={index === 0 ? "lg:col-span-2" : undefined}
            >
              <ProjectCard
                project={project}
                wide={index === 0}
                href={
                  project.hasCaseStudy
                    ? `/${locale}/work/${project.slug}`
                    : undefined
                }
                readCaseStudyLabel={t.home.work.readCaseStudy}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
