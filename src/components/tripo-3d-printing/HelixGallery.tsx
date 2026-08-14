"use client";
import { useRef } from "react";
import { helixCards } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const WORKFLOW_MEDIA = `${BASE}/tripo/raygun.jpg`;

export function HelixGallery() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const introOpacity = Math.max(0, 1 - p * 4.2);
  const gridProgress = Math.max(0, Math.min(1, (p - .08) / .48));
  const y = (1 - gridProgress) * 32;

  return (
    <section ref={ref} className="helix-shell workflow-grid-shell" id="stories">
      <div className="helix-sticky workflow-grid-sticky">
        <div
          className="stories-intro"
          style={{ opacity: introOpacity, transform: `translateY(${-p * 68}px)` }}
        >
          <span>04 / CREATOR STORIES</span>
          <h2>Great 3D starts<br />with a clear idea.</h2>
          <p>Move from concept to generation, refinement and production without breaking the creative flow.</p>
        </div>

        <div
          className="workflow-grid-head"
          style={{ opacity: gridProgress, transform: `translateY(${y}px)` }}
        >
          <span>EXPLORE THE WORKFLOW</span>
          <h2>Every stage,<br />one connected system.</h2>
        </div>

        <img className="workflow-accent workflow-accent-top" src={WORKFLOW_MEDIA} alt="" aria-hidden="true" />
        <img className="workflow-accent workflow-accent-bottom" src={WORKFLOW_MEDIA} alt="" aria-hidden="true" />

        <div
          className="workflow-card-grid"
          style={{ opacity: gridProgress, transform: `translate3d(0,${y}px,0)` }}
        >
          {helixCards.map((c, i) => (
            <article className="workflow-card" key={c.title} style={{ transitionDelay: `${i * 18}ms` }}>
              <span>{c.eyebrow}</span>
              <div className="workflow-card-corner">↗</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>

        <div className="helix-count workflow-count">
          <b>09</b><span>/ 09</span>
        </div>
      </div>
    </section>
  );
}
