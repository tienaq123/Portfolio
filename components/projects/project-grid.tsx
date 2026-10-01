import { getDictionary, getLocale } from "@/i18n/dictionaries";
import type { ProjectSummary } from "@/lib/content";
import { ProjectCard } from "./project-card";

/** First project spans the row on desktop; the rest form a 2-column grid. */
export async function ProjectGrid({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <ul className="grid gap-6 lg:grid-cols-2">
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
  );
}
