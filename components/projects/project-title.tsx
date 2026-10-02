import { ViewTransition, type ReactNode } from "react";

/**
 * The title morphs into the case study heading on navigation (same name on
 * both pages). `default="none"` keeps it out of unrelated transitions.
 */
export function ProjectTitle({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name={`project-title-${slug}`}
      share="project-title"
      default="none"
    >
      <span className="inline-block">{children}</span>
    </ViewTransition>
  );
}
