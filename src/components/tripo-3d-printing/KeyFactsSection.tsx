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

  const titleP = smooth((p - 0.02) / 0.18);
  const leftP = smooth((p - 0.16) / 0.27);
  const centerP = smooth((p - 0.24) / 0.26);
  const rightP = smooth((p - 0.30) / 0.28);
  const partnersP = smooth((p - 0.49) / 0.20);
  const exitP = smooth((p - 0.84) / 0.14);

  const compositionY = -exitP * 34;

  return (
    <section ref={ref} className="facts-section facts-shell-match" id="facts">
      <div className="facts-sticky-match">
        <div
          className="facts-heading-match"
          style={{
            opacity: titleP * (1 - exitP * 0.34),
            transform: `translate3d(0,${(1 - titleP) * 64 + compositionY}px,0)`,
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
          className="facts-cards-match"
          style={{ transform: `translate3d(-50%,${compositionY}px,0)` }}
        >
          <article
            className="fact-card-match fact-card-image-match fact-card-left-match"
            style={{
              opacity: leftP,
              transform:
                `perspective(900px) translate3d(${(1 - leftP) * -165}px,${(1 - leftP) * 148}px,0) ` +
                `rotateX(${(1 - leftP) * 18}deg) rotateY(${(1 - leftP) * 14}deg) ` +
                `rotateZ(${(1 - leftP) * -8}deg) scale(${0.82 + leftP * 0.18})`,
            }}
          >
            <img src={TRIPO_ASSETS.factModel} alt="TRIPO featured 3D model" />
            <div className="fact-card-shade" />
            <span className="fact-card-label">CREATORS WORLDWIDE</span>
            <span className="fact-card-copy">A global community creating with Tripo.</span>
            <strong>{facts[0].value}</strong>
          </article>

          <article
            className="fact-card-match fact-card-center-match"
            style={{
              opacity: centerP,
              transform:
                `translate3d(0,${(1 - centerP) * 128}px,0) ` +
                `scale(${0.78 + centerP * 0.22})`,
            }}
          >
            <span className="fact-card-label">3D MODELS CREATED</span>
            <div
              className="fact-circle-match"
              style={{
                transform: `scale(${0.56 + centerP * 0.44})`,
                opacity: centerP,
              }}
            >
              <strong>{facts[3].value}</strong>
            </div>
            <p>Production-ready assets created across Tripo workflows.</p>
          </article>

          <article
            className="fact-card-match fact-card-image-match fact-card-right-match"
            style={{
              opacity: rightP,
              transform:
                `perspective(900px) translate3d(${(1 - rightP) * 165}px,${(1 - rightP) * 144}px,0) ` +
                `rotateX(${(1 - rightP) * 17}deg) rotateY(${(1 - rightP) * -14}deg) ` +
                `rotateZ(${(1 - rightP) * 7}deg) scale(${0.82 + rightP * 0.18})`,
            }}
          >
            <img src={TRIPO_ASSETS.factTexture} alt="TRIPO featured textured 3D model" />
            <div className="fact-card-shade" />
            <span className="fact-card-label">INDUSTRY CLIENTS</span>
            <span className="fact-card-copy">Production teams using Tripo in real workflows.</span>
            <strong>{facts[2].value}</strong>
          </article>
        </div>

        <div
          className="facts-partners-match"
          style={{
            opacity: partnersP * (1 - exitP * 0.44),
            transform: `translate3d(-50%,${(1 - partnersP) * 35 + compositionY}px,0)`,
          }}
        >
          <span className="facts-partners-title">
            {facts[1].value} ACTIVE DEVELOPERS
          </span>
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
