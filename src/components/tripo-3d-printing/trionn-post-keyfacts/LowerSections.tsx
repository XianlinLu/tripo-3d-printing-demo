"use client";

import { useMemo, useRef, useState } from "react";
import { cases, SITE, TRIPO_ASSETS } from "../content";
import { useScrollProgress } from "../useScrollProgress";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const stories = [
  {
    label: "Personalized Jewelry",
    quote: cases[0].body,
    detail: "High-precision geometry · Production workflow",
    image: cases[0].image,
  },
  {
    label: "Art Sculpture",
    quote: cases[1].body,
    detail: "Complex printable forms · Cleaner surfaces",
    image: cases[1].image,
  },
  {
    label: "Tabletop Miniatures",
    quote: cases[2].body,
    detail: "Stable poses · Detail that survives printing",
    image: cases[2].image,
  },
];

const motionImages = [
  { src: TRIPO_ASSETS.factModel, alt: "Stylized TRIPO character portrait" },
  { src: TRIPO_ASSETS.workflowLeft, alt: "Colorful TRIPO fantasy character" },
  { src: TRIPO_ASSETS.serviceTopology, alt: "Detailed TRIPO fantasy fish model" },
  { src: TRIPO_ASSETS.factTexture, alt: "TRIPO cinematic character model" },
  { src: TRIPO_ASSETS.workflowRight, alt: "TRIPO armored creature model" },
];

function MotionSection() {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useScrollProgress(ref);
  const titleExit = ease((progress - 0.08) / 0.12);
  const ribbonProgress = ease((progress - 0.2) / 0.62);
  const ribbonEnter = ease((progress - 0.24) / 0.08);
  const ribbonLeave = 1 - ease((progress - 0.86) / 0.08);
  const ribbonOpacity = ribbonEnter * ribbonLeave;
  const cardStyles = useMemo(
    () => motionImages.map((_, index) => {
      const offset = index + 1 - ribbonProgress * 6;
      const distance = Math.abs(offset);
      const edgeOpacity = clamp((2.35 - distance) / 0.5);
      const x = offset * 16.5;
      const y = -13 + offset * offset * 4.2;
      const z = 180 - distance * 48;
      const rotateZ = offset * 7;
      const rotateY = -offset * 4.5;
      const scale = 0.94 + clamp((2 - distance) / 2) * 0.06;
      return {
        opacity: ribbonOpacity * edgeOpacity,
        transform: `translate3d(calc(-50% + ${x.toFixed(2)}vw), calc(-50% + ${y.toFixed(2)}vh), ${z.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
      };
    }),
    [ribbonOpacity, ribbonProgress],
  );

  return (
    <section ref={ref} id="motion" className="tkf-motion" aria-label="Design in motion">
      <div className="tkf-motion-sticky">
        <h2
          style={{
            opacity: 1 - titleExit,
            transform: `translate3d(-50%, calc(-50% - ${(titleExit * 42).toFixed(2)}px), 0) scale(${(1 - titleExit * 0.06).toFixed(3)})`,
          }}
        >
          Design in<br />motion
        </h2>
        <div className="tkf-motion-orbit" style={{ opacity: ribbonOpacity * 0.72 }} aria-hidden="true" />
        <div className="tkf-motion-ribbon">
          {motionImages.map((image, index) => (
            <figure className="tkf-motion-card" key={image.src} style={cardStyles[index]}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </figure>
          ))}
        </div>
        <p style={{ opacity: ribbonOpacity }}>Generation, refinement, texturing, and output move together in one continuous AI 3D workflow.</p>
        <a
          className="tkf-text-link"
          href="https://studio.tripo3d.ai/"
          target="_blank"
          rel="noreferrer"
          style={{ opacity: ribbonOpacity }}
        >
          Explore Tripo Studio <span>→</span>
        </a>
      </div>
    </section>
  );
}

export function LowerSections() {
  const [story, setStory] = useState(0);
  const active = stories[story];

  return (
    <>
      <section id="stories" className="tkf-stories">
        <div className="tkf-stories-top">
          <h2>Production stories</h2>
          <p>Practical 3D printing workflows shaped by clean geometry, useful detail, and faster iteration.</p>
        </div>
        <div className="tkf-story-body">
          <div className="tkf-story-tabs">
            {stories.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={story === index ? "is-active" : ""}
                onClick={() => setStory(index)}
              >
                0{index + 1} — {item.label}
              </button>
            ))}
          </div>
          <div className="tkf-story-quote">
            <blockquote>“{active.quote}”</blockquote>
            <div>
              <img src={active.image} alt={active.label} />
              <span><strong>{active.label}</strong>{active.detail}</span>
            </div>
          </div>
        </div>
        <div className="tkf-story-progress"><span style={{ width: `${(story + 1) * 33.333}%` }} /></div>
      </section>

      <MotionSection />

      <footer id="footer" className="tkf-footer">
        <div className="tkf-footer-glow tkf-footer-glow-a" />
        <div className="tkf-footer-glow tkf-footer-glow-b" />
        <div className="tkf-footer-topline"><span>LET&apos;S BUILD WHAT&apos;S NEXT IN 3D.</span></div>
        <div className="tkf-footer-lead">
          <h2>Ready to build<br />something bold?</h2>
          <a className="tkf-footer-button" href="https://studio.tripo3d.ai/" target="_blank" rel="noreferrer">
            Start creating in Tripo <span>→</span>
          </a>
        </div>
        <div className="tkf-footer-grid">
          <div className="tkf-footer-brand"><img src={SITE.logo} alt="TRIPO" /><p>Production-ready 3D assets from images, text, and sketches.</p></div>
          <div><span>Explore</span><a href="#cases">3D Printing</a><a href="#benefits">AI 3D Workflow</a><a href="#stories">Production Stories</a></div>
          <div><span>Product</span><a href="https://studio.tripo3d.ai/">Tripo Studio</a><a href="https://www.tripo3d.ai/">Tripo 3D</a><a href="https://www.tripo3d.ai/pricing">Pricing</a></div>
          <div><span>Social</span><a href="https://www.youtube.com/@TripoAI">YouTube</a><a href="https://discord.com/invite/tripoai">Discord</a></div>
        </div>
        <div className="tkf-footer-end"><span>TRIPO®</span><span>© 2026</span><span>Generate · Refine · Export · Print</span></div>
      </footer>
    </>
  );
}
