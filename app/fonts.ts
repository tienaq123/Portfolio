import { JetBrains_Mono, Plus_Jakarta_Sans, Sriracha } from "next/font/google";

// All three ship Vietnamese glyphs. Only the sans face is preloaded; the
// others are decorative (code cards, handwritten accents) and load on use.
export const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jakarta",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const hand = Sriracha({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-sriracha",
  display: "swap",
  preload: false,
});

export const fontVariables = `${sans.variable} ${mono.variable} ${hand.variable}`;
