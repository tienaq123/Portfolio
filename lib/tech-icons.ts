import type { SimpleIcon } from "simple-icons";
import {
  siAlpinedotjs,
  siClaude,
  siCloudflareworkers,
  siDocker,
  siFastify,
  siFirebase,
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
} from "simple-icons";

// Keyed by the tech names used in lib/content. Brands simple-icons no longer
// ships (OpenAI, Slack, LinkedIn…) fall back to a monogram.
export const techIcons: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "Vue 3": siVuedotjs,
  React: siReact,
  "Next.js": siNextdotjs,
  "Inertia.js": siInertia,
  Livewire: siLivewire,
  "Alpine.js": siAlpinedotjs,
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

export const techIconPath = (icon: SimpleIcon) =>
  `/icons/tech/${icon.slug}.svg`;

/** One brand-coloured SVG file per icon, as served by app/icons/tech. */
export function techIconSvg(icon: SimpleIcon) {
  const title = icon.title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${icon.hex}"><title>${title}</title><path d="${icon.path}"/></svg>`;
}
