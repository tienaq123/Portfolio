import { ArrowRight, CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TechBadge } from "@/components/ui/tech-badge";
import type { ProjectSummary } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Stand-in until real screenshots arrive: an abstract app window. */
function ScreenshotPlaceholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-full items-end justify-center bg-linear-to-br from-accent-soft via-surface-muted to-violet-soft px-8 pt-16 sm:px-12"
    >
      <div className="w-full max-w-md rounded-t-xl border border-b-0 border-border bg-surface shadow-raised">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5">
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="ml-3 h-2 w-24 rounded-full bg-surface-muted" />
        </div>
        <div className="grid grid-cols-[3.5rem_1fr] gap-4 p-4">
          <div className="space-y-2">
            <span className="block h-2 rounded-full bg-accent/25" />
            <span className="block h-2 rounded-full bg-surface-muted" />
            <span className="block h-2 rounded-full bg-surface-muted" />
          </div>
          <div className="space-y-2.5">
            <p className="text-sm font-bold text-ink">{title}</p>
            <span className="block h-2 w-4/5 rounded-full bg-surface-muted" />
            <span className="block h-2 w-3/5 rounded-full bg-surface-muted" />
            <div className="grid grid-cols-3 gap-2 pt-1">
              <span className="h-8 rounded-md bg-accent-soft" />
              <span className="h-8 rounded-md bg-violet-soft" />
              <span className="h-8 rounded-md bg-success-soft" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      )}
    >
      <div
        className={cn(
          "relative aspect-video border-b border-border bg-surface-muted",
          wide &&
            "lg:aspect-auto lg:w-1/2 lg:shrink-0 lg:border-r lg:border-b-0",
        )}
      >
        {project.thumbnail ? (
          <Image
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            fill
            // Half of the row when wide, one grid column otherwise: ~36rem either way.
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="object-cover"
          />
        ) : (
          <ScreenshotPlaceholder title={project.title} />
        )}
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
            <Link href={href} className="after:absolute after:inset-0">
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
