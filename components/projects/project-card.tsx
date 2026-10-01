import { ArrowRight, CircleCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TechBadge } from "@/components/ui/tech-badge";
import type { ProjectSummary } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./project-visual";

type ProjectCardProps = {
  project: ProjectSummary;
  /** Case study URL; omitted while the project has no case study. */
  href?: string;
  readCaseStudyLabel: string;
  /** Full-row layout on desktop: screenshot left, details right. */
  wide?: boolean;
};

export function ProjectCard({
  project,
  href,
  readCaseStudyLabel,
  wide = false,
}: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden",
        wide && "lg:flex-row",
        // The stretched link draws the focus ring around the whole card.
        href &&
          "transition-colors hover:border-accent/40 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
      )}
    >
      <div
        className={cn(
          "relative aspect-video border-b border-border bg-surface-muted",
          wide &&
            "lg:aspect-auto lg:w-1/2 lg:shrink-0 lg:border-r lg:border-b-0",
        )}
      >
        <ProjectVisual
          title={project.title}
          thumbnail={project.thumbnail}
          // Half of the row when wide, one grid column otherwise: ~36rem either way.
          sizes="(min-width: 1024px) 36rem, 100vw"
        />
        <ul className="absolute top-4 left-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag.label}>
              <Badge tone={tag.tone} className="shadow-sm">
                {tag.label}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("flex flex-1 flex-col p-6", wide && "lg:p-8")}>
        <h3 className="text-xl font-bold tracking-tight">
          {href ? (
            // Stretched link: the whole card is one click target.
            <Link
              href={href}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-2 leading-relaxed">{project.summary}</p>

        <ul className="mt-5 space-y-2.5 text-sm">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5">
              <CircleCheck
                aria-hidden="true"
                className="mt-0.5 size-4.5 shrink-0 text-accent"
              />
              {highlight}
            </li>
          ))}
        </ul>

        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
          {project.techStack.map((tech) => (
            <li key={tech}>
              <TechBadge name={tech} />
            </li>
          ))}
        </ul>

        {href && (
          <p
            aria-hidden="true"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            {readCaseStudyLabel}
            <ArrowRight className="size-4" />
          </p>
        )}
      </div>
    </Card>
  );
}
