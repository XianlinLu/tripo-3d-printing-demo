"use client";

import { useRef } from "react";
import { capabilities, TRIPO_ASSETS } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

const serviceImages = [
  TRIPO_ASSETS.serviceInput,
  TRIPO_ASSETS.servicePrint,
  TRIPO_ASSETS.serviceTopology,
  TRIPO_ASSETS.serviceDetail,
];

export function ServicesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);

  const introP = smooth(p / 0.13);
  const darkP = smooth((p - 0.16) / 0.20);
  const explodeP = smooth((p - 0.34) / 0.20);
  const cardsP = smooth((p - 0.56) / 0.30);
  const coreP = smooth((p - 0.22) / 0.20) * (1 - smooth((p - 0.94) / 0.06));
  const wordOpacity = 1 - smooth((p - 0.43) / 0.17);
  const fragmentOpacity = Math.max(0, 1 - smooth((p - 0.68) / 0.18));

  return (
    <section ref={ref} className="services-shell target-services-shell" id="benefits">
      <div className="services-sticky target-services-sticky">
        <div className="target-services-paper" style={{ opacity: 1 - darkP }} />
        <div className="target-services-dark" style={{ opacity: darkP }}>
          <div className="target-smoke target-smoke-a" />
          <div className="target-smoke target-smoke-b" />
          <div className="target-smoke target-smoke-c" />
        </div>

        <div className="target-services-label" style={{ color: darkP > 0.55 ? "#e5e5e2" : "#222" }}>
          OUR WORKFLOW
        </div>

        <div
          className="target-services-word-stack"
          style={{ opacity: wordOpacity, transform: `translate3d(-50%,calc(-50% + ${(1 - introP) * 34}px),0)` }}
        >
          {capabilities.map((item, i) => (
            <div
              key={item.short}
              className={`target-services-word target-services-word-${i + 1}`}
              style={{
                transform: `translate3d(${(1 - introP) * (i % 2 ? 9 : -9)}vw,0,0)`,
                color: darkP > 0.52 ? "#e5e5e1" : "#111",
              }}
            >
              {item.short}
            </div>
          ))}
        </div>

        <div
          className="target-service-core"
          style={{
            opacity: coreP,
            transform: `translate3d(-50%,-50%,0) rotate(${(-5 + p * 7).toFixed(2)}deg) scale(${(0.82 + coreP * 0.18).toFixed(3)})`,
          }}
        >
          <img src={TRIPO_ASSETS.serviceCore} alt="Tripo 3D workflow visual" />
          <div className="target-service-core-shade" />
        </div>

        <div className="target-service-fragments" aria-hidden="true" style={{ opacity: fragmentOpacity }}>
          {capabilities.map((item, i) => (
            <div className={`target-fragment-word target-fragment-word-${i + 1}`} key={item.short}>
              {Array.from(item.short).map((ch, j) => {
                const angle = (((j * 47 + i * 83) % 360) * Math.PI) / 180;
                const radius = 110 + ((j + i * 3) % 7) * 31;
                const x = Math.cos(angle) * radius * explodeP;
                const y = Math.sin(angle) * radius * explodeP;
                const rot = explodeP * (((j + i) % 2 ? 1 : -1) * (18 + ((j * 9) % 48)));
                return (
                  <span
                    key={`${i}-${j}`}
                    style={{
                      transform: `translate3d(${x}px,${y}px,0) rotate(${rot}deg)`,
                      opacity: ch === " " ? 0 : 0.18 + explodeP * 0.62,
                    }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        <div className="target-service-cards">
          {capabilities.map((item, i) => {
            const local = smooth((cardsP - i * 0.09) / 0.64);
            const dx = i % 2 ? 72 : -72;
            const dy = i < 2 ? -48 : 48;
            return (
              <article
                key={item.title}
                className={`target-service-card target-service-card-${i + 1}`}
                style={{
                  opacity: local,
                  transform: `translate3d(${(1 - local) * dx}px,${(1 - local) * dy}px,0) scale(${0.94 + local * 0.06})`,
                }}
              >
                <div className="target-service-card-media">
                  <img src={serviceImages[i]} alt={`${item.title} — Tripo`} />
                </div>
                <div className="target-service-card-copy">
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="target-service-caption" style={{ opacity: Math.max(darkP, cardsP) }}>
          ✦ ONE AI 3D WORKSPACE. FROM IDEA TO PRODUCTION.
        </div>
        <a className="target-service-link" href="#stories" style={{ color: darkP > 0.5 ? "#f0f0ed" : "#111" }}>
          EXPLORE WORKFLOW <b>→</b>
        </a>
      </div>
    </section>
  );
}
