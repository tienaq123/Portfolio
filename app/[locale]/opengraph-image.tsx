import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { hasLocale, locales } from "@/i18n/config";
import { getMetrics, getSiteProfile } from "@/lib/content";
import {
  og,
  ogContentType,
  OgFrame,
  ogFonts,
  ogHost,
  OgMetric,
  ogPhoto,
  ogSize,
} from "@/lib/og/shared";

// Same alt in both locales: name + role ("Full-stack Engineer" in either).
export const alt = "Bùi Hữu Tiến — Full-stack Engineer";
export const size = ogSize;
export const contentType = ogContentType;

// Metadata image routes don't inherit the layout's params: prerender per locale.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const [profile, metrics] = await Promise.all([
    getSiteProfile(locale),
    getMetrics(locale),
  ]);
  const [domains] = profile.hero.tagline.split("\n").slice(-1);

  return new ImageResponse(
    <OgFrame>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 500, color: og.muted }}>
          {ogHost}
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            {profile.name}
          </span>
          <span
            style={{
              marginTop: 16,
              fontSize: 42,
              fontWeight: 800,
              color: og.accent,
            }}
          >
            {profile.role}
          </span>
          <span
            style={{
              marginTop: 12,
              fontSize: 30,
              fontWeight: 500,
              color: og.body,
            }}
          >
            {domains}
          </span>
        </div>
        <div style={{ display: "flex", gap: 56 }}>
          {metrics.slice(0, 2).map((metric) => (
            <OgMetric
              key={metric.id}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>
      </div>
      <img
        src={ogPhoto}
        alt=""
        width={340}
        height={425}
        style={{
          alignSelf: "center",
          borderRadius: 32,
          border: `1px solid ${og.border}`,
          objectFit: "cover",
        }}
      />
    </OgFrame>,
    { ...size, fonts: ogFonts },
  );
}
