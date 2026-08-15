"use client";

import { useRef } from "react";
import { facts, TRIPO_ASSETS } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

export function KeyFactsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);

  const titleP = smooth((p - 0.00) / 0.13);
  const subtitleP = smooth((p - 0.045) / 0.13);

  const leftP = smooth((p - 0.16) / 0.25);
  const centerP = smooth((p - 0.23) / 0.25);
  const rightP = smooth((p - 0.30) / 0.25);
  const exitP = smooth((p - 0.90) / 0.10);

  const titleY = (1 - titleP) * 42 - exitP * 24;
  const subtitleY = (1 - subtitleP) * 28 - exitP * 20;
  const contentY = -exitP * 24;

  return (
    <section ref={ref} className="facts-section flow-facts-shell" id="facts">
      <div className="flow-facts-sticky">
        <div
          className="flow-facts-heading"
          style={{
            opacity: titleP * (1 - exitP * 0.25),
            transform: `translate3d(-50%,${titleY}px,0)`,
          }}
        >
          <h2>Key facts</h2>
          <p
            style={{
              opacity: subtitleP,
              transform: `translate3d(0,${subtitleY}px,0)`,
            }}
          >
            A snapshot of a global AI 3D workspace built to move
            <br />
            from inspiration to usable assets faster.
          </p>
        </div>

        <div
          className="flow-facts-cards"
          style={{ transform: `translate3d(-50%,${contentY}px,0)` }}
        >
          <article
            className="flow-fact-card flow-fact-card-dark flow-fact-card-left"
            style={{
              opacity: leftP,
              transform:
                `perspective(1000px) translate3d(${(1 - leftP) * -72}px,${(1 - leftP) * 185}px,0) ` +
                `rotateX(${(1 - leftP) * 18}deg) rotateY(${(1 - leftP) * 12}deg) ` +
                `rotateZ(${(1 - leftP) * -6}deg) scale(${0.80 + leftP * 0.20})`,
            }}
          >
            <span className="flow-fact-top">CREATORS WORLDWIDE</span>
            <img src={TRIPO_ASSETS.factModel} alt="TRIPO featured 3D model" />
            <div className="flow-fact-gradient" />
            <p>A global community creating with Tripo.</p>
            <strong>{facts[0].value}</strong>
          </article>

          <article
            className="flow-fact-card flow-fact-card-light flow-fact-card-center"
            style={{
              opacity: centerP,
              transform:
                `translate3d(0,${(1 - centerP) * 185}px,0) ` +
                `scale(${0.82 + centerP * 0.18})`,
            }}
          >
            <span className="flow-fact-top">3D MODELS CREATED</span>
            <div
              className="flow-fact-circle"
              style={{
                opacity: centerP,
                transform: `translate3d(-50%,-50%,0) scale(${0.58 + centerP * 0.42})`,
              }}
            >
              <strong>{facts[3].value}</strong>
            </div>
            <p>Production-ready assets created across Tripo workflows.</p>
          </article>

          <article
            className="flow-fact-card flow-fact-card-dark flow-fact-card-right"
            style={{
              opacity: rightP,
              transform:
                `perspective(1000px) translate3d(${(1 - rightP) * 72}px,${(1 - rightP) * 185}px,0) ` +
                `rotateX(${(1 - rightP) * 18}deg) rotateY(${(1 - rightP) * -12}deg) ` +
                `rotateZ(${(1 - rightP) * 6}deg) scale(${0.80 + rightP * 0.20})`,
            }}
          >
            <span className="flow-fact-top">INDUSTRY CLIENTS</span>
            <img src={TRIPO_ASSETS.factTexture} alt="TRIPO featured textured 3D model" />
            <div className="flow-fact-gradient" />
            <p>Production teams using Tripo in real workflows.</p>
            <strong>{facts[2].value}</strong>
          </article>
        </div>
      </div>
    </section>
  );
}
