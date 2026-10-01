import { Download, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { GitHubMark, LinkedInMark } from "@/components/ui/brand-icon";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { trackAttrs } from "@/lib/analytics/track";
import type { SiteProfileView } from "@/lib/content";

const iconLinkClass =
  "flex size-13 items-center justify-center rounded-control border border-white/15 text-night-ink transition-colors hover:bg-white/10 [&_svg]:size-5";

function ExternalIconLink({
  href,
  label,
  newTabHint,
  tracking,
  children,
}: {
  href: string;
  label: string;
  newTabHint: string;
  tracking: ReturnType<typeof trackAttrs>;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={iconLinkClass}
      {...tracking}
    >
      {children}
      <span className="sr-only">
        {label} {newTabHint}
      </span>
    </a>
  );
}

// Dark band that runs straight into the footer (same night background).
export async function Contact({ profile }: { profile: SiteProfileView }) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { contact } = t.home;

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-night">
      <Container className="flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="max-w-xl">
          <h2 id="contact-title" className="text-title text-white">
            {contact.title}
          </h2>
          <p className="mt-3 leading-relaxed text-night-muted">
            {contact.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.links.email}`}
            className={buttonVariants({ size: "lg" })}
            {...trackAttrs("email_clicked", { locale })}
          >
            <Mail aria-hidden="true" />
            {contact.email}
          </a>
          <ExternalIconLink
            href={profile.links.github}
            label={contact.github}
            newTabHint={t.a11y.opensInNewTab}
            tracking={trackAttrs("github_clicked", { locale })}
          >
            <GitHubMark />
          </ExternalIconLink>
          <ExternalIconLink
            href={profile.links.linkedin}
            label={contact.linkedin}
            newTabHint={t.a11y.opensInNewTab}
            tracking={trackAttrs("linkedin_clicked", { locale })}
          >
            <LinkedInMark />
          </ExternalIconLink>
          {profile.cvHref && (
            <a
              href={profile.cvHref}
              className={iconLinkClass}
              {...trackAttrs("resume_downloaded", {
                locale,
                source: "contact",
              })}
            >
              <Download aria-hidden="true" />
              <span className="sr-only">{contact.cv}</span>
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
