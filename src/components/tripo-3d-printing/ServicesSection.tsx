"use client";

import { useRef } from "react";
import { capabilities, TRIPO_ASSETS } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const explosiveWords = ["AI.", "DESIGN", "DEVELOPMENT", "BRANDING"];

export function ServicesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const darkP = ease((p - 0.19) / 0.19);
  const explodeP = ease((p - 0.31) / 0.23);
  const detailP = ease((p - 0.55) / 0.25);
  const exitP = ease((p - 0.94) / 0.06);

  return (
    <section ref={ref} className="trionn-services" id="benefits" aria-label="Tripo workflow benefits">
      <div className="trionn-services-sticky">
        <div className="trionn-services-light" style={{ opacity: 1 - darkP }} />
        <div className="trionn-services-dark" style={{ opacity: darkP }}>
          <i className="trionn-smoke trionn-smoke-a" />
          <i className="trionn-smoke trionn-smoke-b" />
          <i className="trionn-smoke trionn-smoke-c" />
        </div>

        <span className="trionn-services-label" style={{ color: darkP > 0.55 ? "#c9cac7" : "#242424" }}>OUR SERVICES</span>

        <div className="trionn-explosive-title" style={{ opacity: (1 - detailP) * (1 - exitP) }}>
          {explosiveWords.map((word, row) => (
            <div className={`trionn-explosive-row trionn-explosive-row-${row + 1}`} key={word}>
              {Array.from(word).map((character, index) => {
                const direction = (index + row) % 2 ? 1 : -1;
                const x = explodeP * direction * (38 + index * 16 + row * 8);
                const y = explodeP * ((index % 3) - 1) * (35 + row * 10);
                const rotate = explodeP * direction * (8 + index * 5);
                return (
                  <span
                    key={`${row}-${index}`}
                    style={{
                      color: darkP > 0.48 ? "#d7d7d3" : "#181818",
                      opacity: 1 - explodeP * 0.76,
                      transform: `translate3d(${x}px,${y}px,0) rotate(${rotate}deg)`,
                    }}
                  >{character}</span>
                );
              })}
            </div>
          ))}
        </div>

        <div
          className="trionn-service-detail"
          style={{ opacity: detailP * (1 - exitP), transform: `translate3d(0,${(1 - detailP) * 34 - exitP * 18}px,0)` }}
        >
          <article className="trionn-service-side trionn-service-side-left">
            <span>01 / CREATE</span>
            <h3>AI &amp; Intelligent<br />3D Generation</h3>
            <p>Generate strong 3D starting points from images, text or sketches — in seconds.</p>
            <img src={TRIPO_ASSETS.serviceInput} alt="Tripo AI 3D generation" />
          </article>

          <figure className="trionn-service-core">
            <img src={TRIPO_ASSETS.serviceCore} alt="Tripo production-ready 3D model" />
            <figcaption>One connected 3D workspace</figcaption>
          </figure>

          <article className="trionn-service-side trionn-service-side-right">
            <span>02 / REFINE &amp; EXPORT</span>
            <h3>Clean topology.<br />Ready to print.</h3>
            <p>Segment, texture and refine your model, then export to the formats your production workflow needs.</p>
            <a href="https://www.tripo3d.ai/zh" target="_blank" rel="noreferrer">OUR WORKFLOW <b>↗</b></a>
          </article>
        </div>

        <div className="trionn-service-footer" style={{ color: darkP > 0.55 ? "#b7b8b6" : "#313131" }}>
          <span>✦ A WORKSPACE THAT MOVES FROM IDEA TO PRODUCTION.</span>
          <span>{capabilities.length.toString().padStart(2, "0")} CORE CAPABILITIES</span>
        </div>
      </div>
    </section>
  );
}
