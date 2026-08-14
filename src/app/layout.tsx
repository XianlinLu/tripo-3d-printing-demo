import type { Metadata } from "next";
import "./globals.css";
import "./visual-overrides.css";
import "./seo-v2.css";

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
