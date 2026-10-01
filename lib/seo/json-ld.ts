import { locales, type Locale } from "@/i18n/config";
import type { ExperienceView, SiteProfileView } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import { localizedPath } from "./metadata";

const absolute = (path: string) => new URL(path, siteUrl).toString();

/** schema.org Person + WebSite for the homepage, linked by @id. */
export function homeJsonLd({
  locale,
  profile,
  experiences,
}: {
  locale: Locale;
  profile: SiteProfileView;
  experiences: ExperienceView[];
}) {
  const personId = absolute("/#person");
  const employer = experiences.find(
    (item) => item.type === "work" && item.endDate === null,
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        alternateName: profile.alternateName,
        jobTitle: profile.role,
        description: profile.summary,
        url: absolute(localizedPath(locale)),
        ...(profile.photo && { image: absolute(profile.photo.src) }),
        email: `mailto:${profile.links.email}`,
        homeLocation: { "@type": "Place", name: profile.location },
        ...(employer && {
          worksFor: { "@type": "Organization", name: employer.organization },
        }),
        sameAs: [profile.links.github, profile.links.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        url: absolute("/"),
        name: profile.name,
        inLanguage: [...locales],
        author: { "@id": personId },
      },
    ],
  };
}
