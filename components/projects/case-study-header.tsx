import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/motion/count-up";
import { reveal } from "@/components/ui/motion/reveal";
import { TechBadge } from "@/components/ui/tech-badge";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import type { CaseStudyView } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ProjectTitle } from "./project-title";
import { ProjectVisual } from "./project-visual";

export async function CaseStudyHeader({ study }: { study: CaseStudyView }) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const labels = t.caseStudy;

  const facts = [
    { label: labels.role, value: study.role },
    {
      label: labels.team,
      value:
        study.teamSize === "1"
          ? labels.solo
          : `${study.teamSize} ${labels.people}`,
    },
    { label: labels.timeline, value: study.timeline },
    // Unknown status is left out rather than shown as a dash.
    ...(study.status
      ? [{ label: labels.status, value: labels.statuses[study.status] }]
      : []),
  ];

  // Three items read better as one row of three than as a 2 + 1 grid;
  // otherwise pairs, even on phones, to keep the header short.
  const columns = (count: number) =>
    count === 3 ? "sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";

  return (
    <header className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 hero-glow" />
      <Container className="pt-8 pb-12 lg:pt-12">
        <Link
          href={`/${locale}/work`}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {labels.allProjects}
        </Link>

        <ul className="mt-6 flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li key={tag.label}>
              <Badge tone={tag.tone}>{tag.label}</Badge>
            </li>
          ))}
        </ul>
        <h1 className="mt-4 text-display">
          <ProjectTitle slug={study.slug}>{study.title}</ProjectTitle>
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink sm:text-xl">
          {study.impactStatement}
        </p>
        {study.liveUrl && (
          <a
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "secondary" }), "mt-6")}
          >
            {labels.visitSite}
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only">{` ${t.a11y.opensInNewTab}`}</span>
          </a>
        )}

        <dl
          className={cn(
            "mt-10 grid gap-px overflow-hidden rounded-card border border-border bg-border",
            columns(facts.length),
          )}
        >
          {facts.map((fact) => (
            <div key={fact.label} className="bg-surface px-5 py-4">
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1 font-semibold text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>

        {study.keyMetrics.length > 0 && (
          <section aria-label={labels.keyMetrics} className="mt-6">
            <ul className={cn("grid gap-4", columns(study.keyMetrics.length))}>
              {study.keyMetrics.map((metric, index) => (
                <li key={metric.label} {...reveal(index)}>
                  <Card className="h-full p-5">
                    <p className="text-3xl font-bold tracking-tight text-accent">
                      <CountUp value={metric.value} />
                    </p>
                    <p className="mt-1 text-sm">{metric.label}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label={labels.techStack} className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {study.techStack.map((tech) => (
              <li key={tech}>
                <TechBadge name={tech} />
              </li>
            ))}
          </ul>
        </section>

        <div
          className={cn(
            "relative mt-10 overflow-hidden rounded-panel border border-border bg-surface-muted shadow-card",
            // The placeholder has no intrinsic size; a screenshot keeps its own.
            !study.thumbnail && "aspect-video lg:aspect-[21/9]",
          )}
        >
          <ProjectVisual
            title={study.title}
            thumbnail={study.thumbnail}
            sizes="(min-width: 1200px) 66rem, 100vw"
            priority
            fit="natural"
          />
        </div>
      </Container>
    </header>
  );
}
