import { Inter } from "next/font/google";

// Placeholder font with Vietnamese glyphs; the final choice is made in M1-T3.
export const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});
