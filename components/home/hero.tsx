import {
  ArrowRight,
  BookOpen,
  Download,
  FolderCode,
  Hammer,
  Repeat,
  Send,
  User,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { trackAttrs } from "@/lib/analytics/track";
import type { SiteProfileView } from "@/lib/content";

/** Renders `accent` (a substring of `text`) in the accent color. */
function Accented({ text, accent }: { text: string; accent: string | null }) {
  const start = accent ? text.indexOf(accent) : -1;
  if (!accent || start < 0) return text;
  return (
    <>
      {text.slice(0, start)}
      <span className="text-accent">{accent}</span>
      {text.slice(start + accent.length)}
    </>
  );
}

const loopIcons = [Hammer, Send, BookOpen, Repeat];

function HeroVisual({ profile }: { profile: SiteProfileView }) {
  const { photo, hero } = profile;
  const lastIdea = hero.codeIdeas.length - 1;
  const codeLines: { key: string; content: ReactNode }[] = [
    {
      key: "open",
      content: (
        <>
          <span className="text-code-keyword">const</span> ideas = [
        </>
      ),
    },
    ...hero.codeIdeas.map((idea, index) => ({
      key: idea,
      content: (
        <>
          {"  "}
          <span className="text-code-string">&quot;{idea}&quot;</span>
          {index < lastIdea ? "," : ""}
        </>
      ),
    })),
    { key: "close", content: "]" },
    {
      key: "comment",
      content: (
        <span className="text-code-comment">{`// ${hero.codeComment}`}</span>
      ),
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl pt-8 lg:max-w-none">
      <div className="relative ml-auto aspect-5/4 w-full overflow-hidden rounded-panel border border-border bg-surface shadow-card motion-safe:animate-rise sm:w-[88%]">
        {photo ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 34rem, 90vw"
            // Portrait photo in a landscape frame: keep the head in view.
            className="object-cover object-[50%_18%]"
          />
        ) : (
          // Placeholder until the real photo lands (see lib/content/data/site.ts).
          <div className="flex h-full items-center justify-center bg-linear-to-br from-accent-soft via-surface to-violet-soft">
            <User
              aria-hidden="true"
              strokeWidth={0.75}
              className="size-40 text-accent/25"
            />
          </div>
        )}
      </div>

      {/* Decorative accents; the same facts are in the text column. They
          settle in once after the photo (no loop). */}
      <div aria-hidden="true">
        <div className="absolute top-0 right-2 w-60 rounded-card bg-night p-4 font-mono text-[0.6875rem] leading-relaxed text-night-ink shadow-raised motion-safe:animate-rise-fade motion-safe:[animation-delay:120ms] sm:right-0 sm:w-68 sm:text-xs">
          <ol>
            {codeLines.map((line, index) => (
              <li key={line.key} className="flex gap-3 whitespace-pre">
                <span className="w-3 text-right text-night-muted/60 select-none">
                  {index + 1}
                </span>
                <span>{line.content}</span>
              </li>
            ))}
          </ol>
        </div>

        <ul className="absolute top-1/3 left-0 hidden flex-col gap-3 rounded-card border border-border bg-surface/90 p-4 text-sm font-medium text-ink shadow-card backdrop-blur motion-safe:animate-rise-fade motion-safe:[animation-delay:200ms] sm:flex">
          {hero.loop.map((step, index) => {
            const Icon = loopIcons[index] ?? Repeat;
            return (
              <li key={step} className="flex items-center gap-2.5">
                <Icon className="size-4 text-accent" />
                {step}
              </li>
            );
          })}
        </ul>

        {/* Notes sit on a light backdrop so they stay legible over the photo. */}
        <p className="absolute right-4 bottom-4 -rotate-3 rounded-control bg-surface/85 px-3 py-1.5 text-right font-hand text-base leading-snug whitespace-pre-line text-accent-ink shadow-card backdrop-blur motion-safe:animate-rise-fade motion-safe:[animation-delay:280ms] sm:text-lg">
          {hero.tagline}
        </p>

        <p className="absolute bottom-10 -left-6 hidden -rotate-6 rounded-control bg-surface/85 px-3 py-1.5 font-hand text-xl leading-snug whitespace-pre-line text-muted shadow-card backdrop-blur motion-safe:animate-rise-fade motion-safe:[animation-delay:360ms] xl:block">
          {hero.note}
        </p>
      </div>
    </div>
  );
}

export async function Hero({ profile }: { profile: SiteProfileView }) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    // Pulled up under the transparent sticky header so the glow reaches the top.
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mt-16 overflow-hidden pt-16 lg:-mt-18 lg:pt-18"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 hero-glow" />
      <Container className="grid grid-cols-1 items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
        {/* Entrance moves only: no opacity, so text paints immediately. */}
        <div className="flex flex-col items-start motion-safe:animate-rise">
          {profile.availability && (
            <Badge tone="success" dot className="shadow-sm">
              {profile.availability}
            </Badge>
          )}
          <h1 id="hero-title" className="mt-6 text-display">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-xl text-lead text-ink">
            <Accented text={profile.headline} accent={profile.headlineAccent} />
          </p>
          <p className="mt-5 max-w-xl leading-relaxed sm:text-lg">
            {profile.summary}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={`/${locale}#work`} size="lg">
              <FolderCode aria-hidden="true" />
              {t.home.viewProjects}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            {profile.cvHref && (
              <a
                href={profile.cvHref}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
                {...trackAttrs("resume_downloaded", { locale, source: "hero" })}
              >
                <Download aria-hidden="true" />
                {t.home.downloadCv}
              </a>
            )}
          </div>
        </div>

        <HeroVisual profile={profile} />
      </Container>
    </section>
  );
}
