"use client";

import { useRef } from "react";
import { cases, TRIPO_ASSETS } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const motionCards = [
  { image: cases[0].image, label: "JEWELRY" },
  { image: TRIPO_ASSETS.serviceInput, label: "IMAGE TO 3D" },
  { image: TRIPO_ASSETS.factModel, label: "CHARACTER" },
  { image: cases[1].image, label: "SCULPTURE" },
  { image: TRIPO_ASSETS.servicePrint, label: "PRINT READY" },
  { image: TRIPO_ASSETS.workflowLeft, label: "DETAIL" },
  { image: cases[2].image, label: "MINIATURE" },
  { image: TRIPO_ASSETS.factTexture, label: "TEXTURE" },
  { image: TRIPO_ASSETS.serviceTopology, label: "TOPOLOGY" },
  { image: TRIPO_ASSETS.serviceDetail, label: "HIGH FIDELITY" },
];

export function HelixGallery() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const ribbonP = ease(p / 0.72);
  const gridP = ease((p - 0.74) / 0.2);
  const ribbonOpacity = 1 - gridP;

  return (
    <section ref={ref} className="trionn-motion" id="stories" aria-label="Design in motion">
      <div className="trionn-motion-sticky">
        <div className="trionn-motion-headline" style={{ opacity: 1 - gridP * 0.35 }}>
          <span>DESIGN IN</span><span>MOTION</span>
        </div>
        <div className="trionn-motion-copy">
          <span>TRIPO IN MOTION</span>
          <p>Ideas become usable assets through one continuous AI 3D workflow.</p>
        </div>
        <a className="trionn-motion-link" href="https://www.tripo3d.ai/zh" target="_blank" rel="noreferrer">EXPLORE THE GALLERY ↗</a>

        <div className="trionn-ribbon" style={{ opacity: ribbonOpacity }}>
          {motionCards.map((card, index) => {
            const offset = index - ribbonP * 8.2;
            const x = offset * 20;
            const y = Math.sin(offset * 0.7) * 9 + Math.abs(offset) * 1.9;
            const z = 180 - Math.abs(offset) * 34;
            const rotateY = -offset * 8;
            return (
              <figure
                className="trionn-ribbon-card"
                key={`${card.image}-${index}`}
                style={{ transform: `translate3d(calc(-50% + ${x}vw),calc(-50% + ${y}vh),${z}px) rotateY(${rotateY}deg)` }}
              >
                <img src={card.image} alt={`Tripo ${card.label.toLowerCase()} showcase`} />
                <figcaption>{card.label}</figcaption>
              </figure>
            );
          })}
        </div>

        <div className="trionn-motion-grid" style={{ opacity: gridP, transform: `translate3d(-50%,${(1 - gridP) * 46}px,0) scale(${0.94 + gridP * 0.06})` }}>
          {motionCards.slice(0, 9).map((card, index) => (
            <figure key={`grid-${card.image}-${index}`}>
              <img src={card.image} alt={`Tripo ${card.label.toLowerCase()} workflow`} />
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{card.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="trionn-motion-index">04 / DESIGN IN MOTION</div>
      </div>
    </section>
  );
}
