import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "../fonts";
import "../globals.css";

// Owner-only dashboard: its own root layout, outside the bilingual site.
export const metadata: Metadata = {
  title: "Quản lý trợ lý — Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${fontVariables} h-full`}>
      <body className="min-h-full bg-canvas">{children}</body>
    </html>
  );
}
