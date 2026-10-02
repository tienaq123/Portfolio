import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { reveal } from "@/components/ui/motion/reveal";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import type { CaseStudyView, Media } from "@/lib/content";
import { MarkdownContent } from "./markdown";

/** Diagrams keep a readable minimum width and scroll sideways on phones. */
function Figure({ media, hint }: { media: Media; hint: string }) {
  return (
    <figure className="mt-8">
      <div
        tabIndex={0}
        role="region"
        aria-label={media.alt}
        className="overflow-x-auto rounded-card border border-border bg-surface"
      >
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          // SVG diagrams are served as-is; the optimizer only handles bitmaps.
          unoptimized={media.src.endsWith(".svg")}
          className="h-auto w-full min-w-176"
        />
      </div>
      <figcaption className="mt-2 text-xs text-muted md:hidden">
        {hint}
      </figcaption>
    </figure>
  );
}

export async function CaseStudyBody({ study }: { study: CaseStudyView }) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const labels = t.caseStudy;
  const sections = study.sections.map((section) => ({
    ...section,
    heading: section.title ?? labels.sections[section.type],
  }));

  return (
    <>
      <Container className="grid gap-12 py-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 lg:py-16">
        <nav aria-label={labels.onThisPage} className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              {labels.onThisPage}
            </p>
            <ol className="mt-3 space-y-0.5 border-l border-border text-sm">
              {sections.map((section) => (
                <li key={section.type}>
                  <a
                    href={`#${section.type}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted transition-colors hover:border-accent hover:text-ink"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="max-w-3xl min-w-0 space-y-14">
          {sections.map((section) => (
            <section
              key={section.type}
              id={section.type}
              aria-labelledby={`${section.type}-title`}
              {...reveal()}
            >
              <h2 id={`${section.type}-title`} className="text-title">
                {section.heading}
              </h2>
              <MarkdownContent className="mt-6">{section.body}</MarkdownContent>
              {section.media.map((media) => (
                <Figure
                  key={media.src}
                  media={media}
                  hint={labels.diagramHint}
                />
              ))}
            </section>
          ))}
        </div>
      </Container>

      {study.next && (
        <Container className="pb-16 lg:pb-24">
          <div {...reveal()}>
            <Link
              href={`/${locale}/work/${study.next.slug}`}
              className="group flex items-center justify-between gap-6 rounded-panel border border-border bg-surface p-6 shadow-card transition-colors hover:border-accent/40 sm:p-8"
            >
              <span>
                <span className="block text-sm text-muted">
                  {labels.nextProject}
                </span>
                <span className="mt-1 block text-2xl font-bold tracking-tight text-ink">
                  {study.next.title}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-6 shrink-0 text-accent transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Container>
      )}
    </>
  );
}
