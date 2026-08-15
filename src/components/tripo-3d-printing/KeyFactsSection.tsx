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

  // Visible immediately when the white page arrives.
  const headingP = smooth((p + 0.06) / 0.07);
  const leftP = smooth((p - 0.025) / 0.20);
  const centerP = smooth((p - 0.085) / 0.20);
  const rightP = smooth((p - 0.145) / 0.20);
  const partnersP = smooth((p - 0.40) / 0.14);
  const exitP = smooth((p - 0.92) / 0.08);

  const contentY = -exitP * 18;

  return (
    <section ref={ref} className="facts-section flow-facts-shell" id="facts">
      <div className="flow-facts-sticky">
        <div
          className="flow-facts-heading"
          style={{
            opacity: headingP * (1 - exitP * 0.2),
            transform: `translate3d(-50%,${(1 - headingP) * 12 - exitP * 12}px,0)`,
          }}
        >
          <h2>Key facts</h2>
          <p>
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
                `perspective(1000px) translate3d(${(1 - leftP) * -64}px,${(1 - leftP) * 170}px,0) ` +
                `rotateX(${(1 - leftP) * 17}deg) rotateY(${(1 - leftP) * 11}deg) ` +
                `rotateZ(${(1 - leftP) * -5}deg) scale(${0.82 + leftP * 0.18})`,
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
                `translate3d(0,${(1 - centerP) * 170}px,0) ` +
                `scale(${0.84 + centerP * 0.16})`,
            }}
          >
            <span className="flow-fact-top">3D MODELS CREATED</span>
            <div
              className="flow-fact-circle"
              style={{
                opacity: centerP,
                transform: `translate3d(-50%,-50%,0) scale(${0.62 + centerP * 0.38})`,
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
                `perspective(1000px) translate3d(${(1 - rightP) * 64}px,${(1 - rightP) * 170}px,0) ` +
                `rotateX(${(1 - rightP) * 17}deg) rotateY(${(1 - rightP) * -11}deg) ` +
                `rotateZ(${(1 - rightP) * 5}deg) scale(${0.82 + rightP * 0.18})`,
            }}
          >
            <span className="flow-fact-top">INDUSTRY CLIENTS</span>
            <img src={TRIPO_ASSETS.factTexture} alt="TRIPO featured textured 3D model" />
            <div className="flow-fact-gradient" />
            <p>Production teams using Tripo in real workflows.</p>
            <strong>{facts[2].value}</strong>
          </article>
        </div>

        <div
          className="flow-facts-partners"
          style={{
            opacity: partnersP * (1 - exitP),
            transform: `translate3d(-50%,${(1 - partnersP) * 20 + contentY}px,0)`,
          }}
        >
          <small>{facts[1].value} ACTIVE DEVELOPERS</small>
          <div>
            <span>IMAGE TO 3D</span>
            <span>TEXT TO 3D</span>
            <span>SEGMENTATION</span>
            <span>TEXTURING</span>
            <span>RIGGING</span>
          </div>
        </div>
      </div>
    </section>
  );
}
