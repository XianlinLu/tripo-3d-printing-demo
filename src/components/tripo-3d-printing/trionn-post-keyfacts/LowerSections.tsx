"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cases, SITE, TRIPO_ASSETS } from "../content";

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
  TRIPO_ASSETS.caseJewelry,
  TRIPO_ASSETS.serviceInput,
  TRIPO_ASSETS.caseSculpture,
  TRIPO_ASSETS.servicePrint,
  TRIPO_ASSETS.caseMiniature,
];

export function LowerSections() {
  const [story, setStory] = useState(0);
  const [time, setTime] = useState("--:--");
  const active = stories[story];

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

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

      <section id="motion" className="tkf-motion">
        <h2>Design in<br />motion</h2>
        <div className="tkf-motion-arc">
          {motionImages.map((image, index) => (
            <figure key={`${image}-${index}`} style={{ "--index": index } as CSSProperties}>
              <img src={image} alt="TRIPO AI-generated 3D project" />
            </figure>
          ))}
        </div>
        <p>Generation, refinement, texturing, and output move together in one continuous AI 3D workflow.</p>
        <a className="tkf-text-link" href="https://studio.tripo3d.ai/" target="_blank" rel="noreferrer">
          Explore Tripo Studio <span>→</span>
        </a>
      </section>

      <footer id="footer" className="tkf-footer">
        <div className="tkf-footer-glow tkf-footer-glow-a" />
        <div className="tkf-footer-glow tkf-footer-glow-b" />
        <div className="tkf-footer-topline"><span>LET&apos;S BUILD WHAT&apos;S NEXT IN 3D.</span><span>JST → {time}</span></div>
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
