import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { reveal } from "./motion/reveal";

type SectionHeadingProps = {
  /** Put on the <h2> so the section can use aria-labelledby. */
  id?: string;
  title: string;
  description?: string;
  /** Right-aligned on wide screens, e.g. a "View all projects" link. */
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      {...reveal()}
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <h2 id={id} className="text-title">
          {title}
        </h2>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
