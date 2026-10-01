import Image from "next/image";
import type { Media } from "@/lib/content";

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

type ProjectVisualProps = {
  title: string;
  thumbnail: Media | null;
  sizes: string;
  /** Above-the-fold image on a case study page. */
  priority?: boolean;
};

/** Fills its (relative, sized) parent with the screenshot or a placeholder. */
export function ProjectVisual({
  title,
  thumbnail,
  sizes,
  priority = false,
}: ProjectVisualProps) {
  if (!thumbnail) return <ScreenshotPlaceholder title={title} />;

  return (
    <Image
      src={thumbnail.src}
      alt={thumbnail.alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className="object-cover"
    />
  );
}
