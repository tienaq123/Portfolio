import { techIconPath, techIcons, techIconSvg } from "@/lib/tech-icons";

const icons = new Map(
  Object.values(techIcons).map((icon) => [techIconPath(icon), icon]),
);

// Brand logos for tech badges, prerendered as static SVG files.
export function generateStaticParams() {
  return [...icons.keys()].map((path) => ({ file: path.split("/").pop() }));
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/icons/tech/[file]">,
) {
  const { file } = await ctx.params;
  const icon = icons.get(`/icons/tech/${file}`);

  if (!icon) return new Response("Not found", { status: 404 });

  return new Response(techIconSvg(icon), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
    },
  });
}
