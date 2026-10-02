import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { reveal } from "@/components/ui/motion/reveal";
import type { ProjectSummary } from "@/lib/content";
import { ProjectCard } from "./project-card";

/** First project spans the row on desktop; the rest form a 2-column grid. */
export async function ProjectGrid({
  projects,
  headingLevel,
}: {
  projects: ProjectSummary[];
  headingLevel?: 2 | 3;
}) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    // grid-cols-1 = minmax(0, 1fr): an implicit `auto` column lets WebKit grow
    // it past the container (aspect-ratio screenshot frames), so be explicit.
    <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {projects.map((project, index) => (
        <li
          key={project.slug}
          {...reveal(index)}
          className={index === 0 ? "lg:col-span-2" : undefined}
        >
          <ProjectCard
            project={project}
            wide={index === 0}
            headingLevel={headingLevel}
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
