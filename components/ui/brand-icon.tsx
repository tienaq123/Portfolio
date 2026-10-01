import type { ComponentProps } from "react";
import {
  siClaude,
  siCloudflareworkers,
  siDocker,
  siFastify,
  siFirebase,
  siGithub,
  siGithubactions,
  siGoogle,
  siHono,
  siInertia,
  siJavascript,
  siLaravel,
  siLivewire,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siRailway,
  siReact,
  siRedis,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

// Keyed by the tech names used in lib/content. Brands simple-icons no longer
// ships (OpenAI, Slack, LinkedIn…) fall back to a monogram.
const techIcons: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "Vue 3": siVuedotjs,
  React: siReact,
  "Next.js": siNextdotjs,
  "Inertia.js": siInertia,
  Livewire: siLivewire,
  "Tailwind CSS": siTailwindcss,
  PHP: siPhp,
  Laravel: siLaravel,
  "Node.js": siNodedotjs,
  Hono: siHono,
  Fastify: siFastify,
  MySQL: siMysql,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Redis: siRedis,
  Supabase: siSupabase,
  "Cloudflare Workers": siCloudflareworkers,
  "Cloudflare Workers/Queues/R2": siCloudflareworkers,
  Docker: siDocker,
  "GitHub Actions": siGithubactions,
  Vercel: siVercel,
  Railway: siRailway,
  "Claude API": siClaude,
  "Anthropic Claude": siClaude,
  "Google Business Profile API": siGoogle,
  "Firebase FCM": siFirebase,
};

/** Decorative brand logo for a technology; the visible name carries the meaning. */
export function TechLogo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const icon = techIcons[name];

  if (!icon) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center rounded-[0.25rem] bg-surface-muted text-[0.625rem] font-bold text-muted",
          className,
        )}
      >
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={`#${icon.hex}`}
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}

export function GitHubMark(props: ComponentProps<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d={siGithub.path} />
    </svg>
  );
}

/** LinkedIn's "in" mark, drawn locally because simple-icons dropped it. */
export function LinkedInMark(props: ComponentProps<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
