import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { hasLocale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/dictionaries";
import { getCaseStudy, getSiteProfile } from "@/lib/content";
import {
  clampText,
  og,
  ogContentType,
  OgFrame,
  ogFonts,
  OgMetric,
  ogPhoto,
  ogSize,
} from "@/lib/og/shared";

type Params = { locale: string; slug: string };

// Localized alt text needs the params, hence image metadata over a static `alt`.
export async function generateImageMetadata({ params }: { params: Params }) {
  if (!hasLocale(params.locale)) return [];
  const [study, t, profile] = await Promise.all([
    getCaseStudy(params.slug, params.locale),
    loadDictionary(params.locale),
    getSiteProfile(params.locale),
  ]);
  if (!study) return [];
  const title = t.caseStudy.documentTitle.replace("{title}", study.title);
  return [
    {
      id: "og",
      alt: `${title} — ${profile.name}`,
      size: ogSize,
      contentType: ogContentType,
    },
  ];
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const [study, t, profile] = await Promise.all([
    getCaseStudy(slug, locale),
    loadDictionary(locale),
    getSiteProfile(locale),
  ]);
  if (!study) notFound();

  return new ImageResponse(
    <OgFrame>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 800,
              color: og.accentInk,
              backgroundColor: og.accentSoft,
            }}
          >
            {t.caseStudy.label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src={ogPhoto}
              alt=""
              width={56}
              height={56}
              style={{ borderRadius: 999, objectFit: "cover" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 22, fontWeight: 800 }}>
                {profile.name}
              </span>
              <span style={{ fontSize: 18, fontWeight: 500, color: og.muted }}>
                {profile.role}
              </span>
            </div>
          </div>
        </div>
        <span
          style={{
            marginTop: 28,
            fontSize: 100,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          {study.title}
        </span>
        <span
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.4,
            color: og.body,
          }}
        >
          {clampText(study.summary, 210)}
        </span>
        <div style={{ marginTop: "auto", display: "flex", gap: 48 }}>
          {study.keyMetrics.slice(0, 3).map((metric) => (
            <OgMetric
              key={metric.label}
              value={metric.value}
              label={metric.label}
            />
          ))}
        </div>
      </div>
    </OgFrame>,
    { ...ogSize, fonts: ogFonts },
  );
}
