import type { Metadata } from "next";
import "./globals.css";
import "./visual-overrides.css";
import "./seo-v2.css";
import "./sound-toggle-v2.css";
import "./menu-target.css";
import "./hero-title-target.css";

export const metadata: Metadata = {
  title: "Tripo 3D Printing — Interactive Experience",
  description: "Production-ready 3D printing models from image or text with Tripo AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
