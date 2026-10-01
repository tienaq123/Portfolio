import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/env";

/*
 * Shared pieces of the generated Open Graph images. ImageResponse (Satori)
 * supports flexbox only and its default font has no Vietnamese glyphs, so the
 * site font is loaded explicitly: static instances of Plus Jakarta Sans,
 * subset to Latin + Vietnamese (assets/fonts, OFL).
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type ImageOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;

const asset = (path: string) => readFile(join(process.cwd(), "assets", path));

const [medium, extraBold, photo] = await Promise.all([
  asset("fonts/PlusJakartaSans-Medium.ttf"),
  asset("fonts/PlusJakartaSans-ExtraBold.ttf"),
  asset("og/profile.jpg"),
]);

export const ogFonts: ImageOptions["fonts"] = [
  { name: "Jakarta", data: medium, weight: 500, style: "normal" },
  { name: "Jakarta", data: extraBold, weight: 800, style: "normal" },
];

/** 360×450 crop of the profile photo, small enough for the 500 KB image budget. */
export const ogPhoto = `data:image/jpeg;base64,${photo.toString("base64")}`;

export const ogHost = new URL(siteUrl).host;

// Mirrors the @theme tokens in app/globals.css.
export const og = {
  canvas: "#f8f9fc",
  surface: "#ffffff",
  ink: "#0e1225",
  body: "#3f4559",
  muted: "#646a80",
  border: "#e4e7f0",
  accent: "#2e5bf0",
  accentSoft: "#ebf0ff",
  accentInk: "#1f3fb8",
};

/** Cuts at a word boundary so a long summary fits its lines. */
export function clampText(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:—–-]+$/, "")}…`;
}

export function OgFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: "64px 72px",
        fontFamily: "Jakarta",
        color: og.ink,
        backgroundColor: og.canvas,
        backgroundImage:
          "radial-gradient(circle at 88% 0%, rgba(46, 91, 240, 0.16), transparent 48%), radial-gradient(circle at 0% 100%, rgba(124, 92, 255, 0.10), transparent 42%)",
      }}
    >
      {children}
    </div>
  );
}

export function OgMetric({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
      <span style={{ fontSize: 44, fontWeight: 800, color: og.accent }}>
        {value}
      </span>
      <span style={{ fontSize: 22, fontWeight: 500, color: og.muted }}>
        {label}
      </span>
    </div>
  );
}
