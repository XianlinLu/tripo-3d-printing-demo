"use client";

import { useRef } from "react";
import { HeroAnimatedTitle } from "./HeroAnimatedTitle";
import { HeroSymbolScene } from "./HeroSymbolScene";
import { SiteNav } from "./SiteNav";
import { hero } from "./content";
import { useScrollProgress } from "./useScrollProgress";

export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const exit = Math.max(0, Math.min(1, (p - 0.58) / 0.42));

  const stageStyle = {
    transform: `translate3d(${exit * -4}vw, ${exit * -7}vh, 0) rotate(${exit * -7.5}deg) scale(${1 - exit * 0.08})`,
    opacity: 1 - exit * 0.7,
  } as React.CSSProperties;

  return (
    <section ref={ref} id="top" className="hero-shell" data-hero-shell>
      <div className="hero-sticky">
        <SiteNav />
        <div className="hero-stage">
          <HeroSymbolScene />

          <div className="hero-ui-stage" style={stageStyle}>
            <div className="hero-copy hero-copy-target" data-vibrate>
              <div className="hero-eyebrow">{hero.eyebrow}</div>
              <HeroAnimatedTitle />

              <div className="hero-cta-row">
                <a href="#facts">{hero.primary}<span>→</span></a>
                <a href="#cases">{hero.secondary}<span>→</span></a>
              </div>
            </div>

            <div className="hero-right-meta" data-vibrate>
              <div className="hero-mini-metrics">
                {hero.metrics.map((m) => (
                  <div key={m.value}>
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
              <p>{hero.description}</p>
            </div>

            <div className="hero-instruction" data-vibrate>
              <strong>HOLD TO <b>✹</b> BLAST</strong>
              <span>DARE <b>⚡</b> TO TOUCH THE LINES.</span>
            </div>

            <div className="hero-scroll-dot" aria-hidden="true">
              <span>↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
