"use client";

import { useRef } from "react";
import { cases, TRIPO_ASSETS } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const gallery = [
  { image: cases[0].image, x: 9, y: 18, w: 12, drift: -38, rotate: -5 },
  { image: TRIPO_ASSETS.serviceInput, x: 27, y: 8, w: 8, drift: 46, rotate: 3 },
  { image: cases[1].image, x: 39, y: 57, w: 13, drift: -29, rotate: -2 },
  { image: TRIPO_ASSETS.factModel, x: 55, y: 13, w: 9, drift: 36, rotate: 5 },
  { image: TRIPO_ASSETS.servicePrint, x: 73, y: 23, w: 11, drift: -42, rotate: -4 },
  { image: TRIPO_ASSETS.workflowLeft, x: 86, y: 9, w: 7, drift: 35, rotate: 4 },
  { image: cases[2].image, x: 79, y: 60, w: 13, drift: -32, rotate: 3 },
  { image: TRIPO_ASSETS.factTexture, x: 17, y: 66, w: 9, drift: 44, rotate: 4 },
  { image: TRIPO_ASSETS.serviceTopology, x: 61, y: 72, w: 8, drift: -38, rotate: -3 },
  { image: TRIPO_ASSETS.serviceDetail, x: 92, y: 42, w: 7, drift: 33, rotate: 2 },
];

export function CaseStudiesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const galleryP = ease(p / 0.54);
  const collapseP = ease((p - 0.42) / 0.2);
  const featureP = ease((p - 0.58) / 0.24);
  const featureExit = ease((p - 0.94) / 0.06);

  return (
    <section ref={ref} className="trionn-work" id="cases" aria-label="Selected 3D printing work">
      <div className="trionn-work-sticky">
        <div className="trionn-work-grain" aria-hidden="true" />

        <div
          className="trionn-work-title"
          style={{
            opacity: 1 - collapseP,
            transform: `translate3d(-50%,${galleryP * -18}px,0) scale(${1 + galleryP * 0.035})`,
          }}
        >
          <div className="trionn-work-mark" aria-hidden="true"><i /><i /><i /></div>
          <h2>Our work</h2>
          <p>AI 3D workflows shaped for real production — from a single idea to a printable asset.</p>
        </div>

        <div className="trionn-floating-gallery" style={{ opacity: 1 - collapseP }}>
          {gallery.map((item, index) => {
            const local = ease((galleryP - index * 0.035) / 0.68);
            const direction = index % 2 ? 1 : -1;
            return (
              <figure
                className="trionn-floating-card"
                key={`${item.image}-${index}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.w}vw`,
                  opacity: 0.18 + local * 0.82,
                  transform: `translate3d(${direction * (1 - local) * 80 + collapseP * (50 - item.x) * 9}px,${(1 - local) * item.drift + collapseP * (50 - item.y) * 7}px,0) rotate(${item.rotate * (1 - collapseP)}deg) scale(${0.68 + local * 0.32 - collapseP * 0.28})`,
                }}
              >
                <img src={item.image} alt="Tripo generated 3D model" />
              </figure>
            );
          })}
        </div>

        <div
          className="trionn-feature-work"
          style={{ opacity: featureP * (1 - featureExit), transform: `translate3d(0,${(1 - featureP) * 42 - featureExit * 22}px,0)` }}
        >
          <div className="trionn-feature-copy">
            <span>PRINT-READY CHARACTER WORKFLOW</span>
            <h3>Turn one clear reference into a detailed, production-ready 3D model.</h3>
            <div className="trionn-feature-meta">
              <p><b>Tripo Studio</b><br />Image to 3D · Detail pass · Export</p>
              <a href="https://studio.tripo3d.ai/" target="_blank" rel="noreferrer">CREATE PROJECT <b>↗</b></a>
            </div>
          </div>
          <figure className="trionn-feature-media">
            <img src={cases[1].image} alt="Tripo 3D print-ready character model" />
            <figcaption><span>Art sculpture</span><span>High-detail geometry</span></figcaption>
          </figure>
        </div>

        <div className="trionn-work-index">02 / WORK</div>
      </div>
    </section>
  );
}
