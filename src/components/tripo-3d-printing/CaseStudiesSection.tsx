"use client";

import { useRef } from "react";
import { cases } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

export function CaseStudiesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const travel = smooth(p) * 154;
  const lift = smooth((p - 0.02) / 0.12);

  return (
    <section ref={ref} className="case-shell target-work-shell" id="cases">
      <div className="case-sticky target-work-sticky">
        <div className="target-work-rule" />

        <div
          className="target-work-track"
          style={{ transform: `translate3d(-${travel}vw,0,0)` }}
        >
          <section className="target-work-intro">
            <span>02 / CASE STUDIES</span>
            <div>
              <h2>Selected 3D printing<br />workflows.</h2>
              <p>Three production scenarios where speed, structure and detail all matter.</p>
              <a href="#benefits">VIEW ALL WORKFLOWS <b>→</b></a>
            </div>
          </section>

          {cases.map((item, i) => {
            const local = smooth((p - i * 0.11) / 0.28);
            return (
              <article
                className="target-work-card"
                key={item.kicker}
                style={{
                  opacity: 0.52 + local * 0.48,
                  transform: `translate3d(0,${(1 - Math.max(lift, local)) * 18}px,0) scale(${0.982 + local * 0.018})`,
                }}
              >
                <div className="target-work-image-wrap">
                  <img src={item.image} alt={`${item.kicker} — Tripo 3D workflow`} />
                  <div className="target-work-index">0{i + 1}</div>
                </div>
                <div className="target-work-meta">
                  <div>
                    <h3>{item.kicker}</h3>
                    <p>{item.title}</p>
                  </div>
                  <a href="#benefits">VIEW WORKFLOW <b>→</b></a>
                </div>
              </article>
            );
          })}

          <section className="target-work-outro">
            <div>
              <p>Discover more ways to move from inspiration to production-ready 3D assets.</p>
              <a href="https://www.tripo3d.ai/" target="_blank" rel="noreferrer">
                EXPLORE TRIPO <b>→</b>
              </a>
            </div>
          </section>
        </div>

        <a className="target-work-next" href="#benefits">VIEW WORKFLOW <b>→</b></a>
      </div>
    </section>
  );
}
