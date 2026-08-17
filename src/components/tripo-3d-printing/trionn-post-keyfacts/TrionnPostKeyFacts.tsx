"use client";

import { LowerSections } from "./LowerSections";
import { WorkShowcase } from "./WorkShowcase";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function TrionnPostKeyFacts() {
  return (
    <div className="tkf-root">
      <style>{`
        @font-face{font-family:"TKF Familjen";src:url("${BASE}/tripo/trionn-reference/fonts/familjen-grotesk.woff2") format("woff2");font-style:normal;font-weight:100 900;font-display:swap}
        @font-face{font-family:"TKF Haas";src:url("${BASE}/tripo/trionn-reference/fonts/neue-haas.woff2") format("woff2");font-style:normal;font-weight:400;font-display:swap}
        @font-face{font-family:"TKF Martian";src:url("${BASE}/tripo/trionn-reference/fonts/martian-mono.woff2") format("woff2");font-style:normal;font-weight:300;font-display:swap}
      `}</style>
      <WorkShowcase />
      <LowerSections />
    </div>
  );
}
