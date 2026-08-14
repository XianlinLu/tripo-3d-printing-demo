"use client";
import { useRef } from "react";
import { capabilities } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const STONE = `${BASE}/tripo/visuals/capability-stone.png`;

export function ServicesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const wordPhase = Math.min(.46, p);
  const index = Math.min(capabilities.length - 1, Math.floor(wordPhase / .115));
  const explode = Math.max(0, Math.min(1, (p - .46) / .16));
  const cards = Math.max(0, Math.min(1, (p - .60) / .33));
  const stoneRotate = -3 + p * 7;
  const stoneScale = 0.92 + Math.min(1, p * 1.8) * 0.08;
  const stoneY = (p - .46) * -20;

  return (
    <section ref={ref} className="services-shell" id="benefits">
      <div className="services-sticky">
        <div className="services-cloud services-cloud-a" />
        <div className="services-cloud services-cloud-b" />
        <div className="services-cloud services-cloud-c" />

        <div
          className="capability-stone-wrap"
          style={{ transform: `translate3d(-50%, calc(-50% + ${stoneY}px), 0) rotate(${stoneRotate}deg) scale(${stoneScale})` }}
        >
          <img src={STONE} alt="TRIPO carved stone" />
        </div>

        <div className="services-label">03 / SMARTER CREATION · SIMPLIFIED WORKFLOW</div>

        <div className="services-giant" aria-hidden="true">
          {capabilities.map((b, i) => (
            <div key={b.short} className={`giant-word ${index === i ? "is-active" : ""}`}>
              {Array.from(b.short).map((ch, j) => {
                const a = ((j * 53 + 17) % 360) * Math.PI / 180;
                const dist = explode * (110 + (j % 6) * 42);
                return (
                  <span
                    key={j}
                    style={{
                      transform: `translate3d(${Math.cos(a) * dist}px,${Math.sin(a) * dist}px,${explode * (j % 3) * 14}px) rotate(${explode * (j % 2 ? 52 : -42)}deg)`,
                      opacity: index === i ? 1 - explode * .86 : 0,
                    }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        <div className="service-cards" style={{ opacity: cards }}>
          {capabilities.map((b, i) => {
            const local = Math.max(0, Math.min(1, (cards - i * .08) / .72));
            return (
              <article
                key={b.title}
                className={`service-card service-card-${i + 1}`}
                style={{
                  opacity: local,
                  transform: `translate3d(${(i % 2 ? 1 : -1) * (1 - local) * 10}vw,${(i < 2 ? -1 : 1) * (1 - local) * 10}vh,0)`,
                }}
              >
                <div><span>{b.number}</span><i>＋</i></div>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </article>
            );
          })}
        </div>

        <div className="services-progress"><span style={{ height: `${p * 100}%` }} /></div>
      </div>
    </section>
  );
}
