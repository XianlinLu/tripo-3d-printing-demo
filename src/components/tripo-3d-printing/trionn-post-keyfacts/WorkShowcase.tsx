"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cases, helixCards } from "../content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.max(minimum, Math.min(maximum, value));

function UnderlineLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a className="tkf-underline-link" href={href}>
      <span>{children}</span><i aria-hidden="true">→</i>
    </a>
  );
}

function ProjectPanel({ index, horizontalProgress }: {
  index: number;
  horizontalProgress: number;
}) {
  const item = cases[index];
  const normalizedCenter = 0.75 + index * 0.5 - horizontalProgress * 1.5;
  const lift = normalizedCenter > 1.2
    ? 550
    : normalizedCenter <= 0.5
      ? 0
      : 550 * Math.pow((normalizedCenter - 0.5) / 0.7, 3);
  const reveal = clamp((1.18 - normalizedCenter) / 0.33);

  return (
    <article className="tkf-work-panel">
      <span
        className="tkf-panel-line"
        style={{ transform: `scaleY(${clamp((1.04 - normalizedCenter) * 8)})` }}
      />
      <div
        className="tkf-project-inner"
        style={{
          transform: `translate3d(0, ${lift.toFixed(2)}px, 0)`,
          opacity: reveal,
        }}
      >
        <a className="tkf-project-image" href="https://studio.tripo3d.ai/" target="_blank" rel="noreferrer">
          <img src={item.image} alt={item.title} />
        </a>
        <div className="tkf-project-copy">
          <span>{item.kicker}</span>
          <h3>{item.title}</h3>
          <div>
            <p>{item.body}</p>
            <UnderlineLink href="https://studio.tripo3d.ai/">Create project</UnderlineLink>
          </div>
        </div>
      </div>
    </article>
  );
}

const services = helixCards.slice(0, 6);

function ServiceGlyph({ index }: { index: number }) {
  const glyphs = ["|||", "◎", "▦", ")(", "◉", "≋"];
  return <span className="tkf-service-glyph" aria-hidden="true">{glyphs[index]}</span>;
}

function ServicesScene({ progress, frame }: { progress: number; frame: number }) {
  const darkReveal = clamp(progress / 0.12);
  const cardsProgress = clamp((progress - 0.5) / 0.5);
  const cardStyles = useMemo(
    () => services.map((_, index) => {
      const pair = Math.floor(index / 2);
      const side = index % 2 === 0 ? -1 : 1;
      const local = clamp((cardsProgress - pair * 0.22) / 0.42);
      const opacity = Math.sin(local * Math.PI);
      const y = 112 - local * 155;
      const arc = Math.sin(local * Math.PI) * 10;
      const x = side < 0 ? -30 + local * 39 - arc : 100 - local * 40 + arc;
      return {
        opacity,
        transform: `translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}vh, 0)`,
      };
    }),
    [cardsProgress],
  );

  return (
    <section id="benefits" className="tkf-services-scene" aria-label="TRIPO AI 3D services">
      <img
        className="tkf-stone-frame"
        src={`${BASE}/tripo/trionn-reference/stone/frame_${String(frame).padStart(4, "0")}.webp`}
        alt=""
      />
      <video
        className="tkf-services-smoke"
        autoPlay
        muted
        loop
        playsInline
        src={`${BASE}/tripo/trionn-reference/homepage-services-video.mp4`}
        style={{ opacity: darkReveal * 0.52 }}
      />
      <div className="tkf-services-white-cover" style={{ opacity: 1 - darkReveal }} />
      <p className="tkf-services-label">TRIPO AI 3D WORKFLOW</p>
      <div className="tkf-services-words" aria-hidden="true">
        <span>A.I.</span>
        <span>3D Design</span>
        <span>Topology</span>
        <span>Printing</span>
      </div>
      <div className="tkf-service-cards">
        {services.map((service, index) => (
          <article key={service.title} style={cardStyles[index]}>
            <div><h3>{service.title}</h3><ServiceGlyph index={index} /></div>
            <p>{service.body}</p>
          </article>
        ))}
      </div>
      <div className="tkf-services-bottom">
        <span>
          {progress < 0.58
            ? "✦ From inspiration to a usable 3D asset."
            : "✦ Generate. Refine. Export. Print."}
        </span>
        <UnderlineLink href="https://studio.tripo3d.ai/">Try Tripo Studio</UnderlineLink>
      </div>
    </section>
  );
}

export function WorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    let rendered = -1;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const next = clamp(-rect.top / distance);
      if (Math.abs(next - rendered) > 0.0005) {
        rendered = next;
        setProgress(next);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const horizontalEnd = 200 / 1350;
  const transitionEnd = 350 / 1350;
  const servicesEnd = 1150 / 1350;
  const horizontalProgress = clamp(progress / horizontalEnd);
  const transitionProgress = clamp((progress - horizontalEnd) / (transitionEnd - horizontalEnd));
  const servicesProgress = clamp((progress - transitionEnd) / (servicesEnd - transitionEnd));
  const trackShift = horizontalProgress * 150 + transitionProgress * 100;
  const frame = Math.max(1, Math.min(371, Math.round(servicesProgress * 370) + 1));

  return (
    <section id="cases" ref={sectionRef} className="tkf-work-scroll">
      <div className="tkf-work-sticky">
        <ServicesScene progress={servicesProgress} frame={frame} />
        <div
          className="tkf-work-track"
          style={{
            transform: `translate3d(-${trackShift.toFixed(4)}vw, 0, 0)`,
            opacity: progress > 0.31 ? clamp(1 - (progress - 0.31) / 0.05) : 1,
          }}
        >
          <article className="tkf-work-panel tkf-work-intro">
            <div>
              <span>02 / SELECTED WORK</span>
              <h2>Selected 3D work<br />&amp; explorations</h2>
              <UnderlineLink href="#stories">View workflow stories</UnderlineLink>
            </div>
          </article>
          {cases.map((_, index) => (
            <ProjectPanel key={index} index={index} horizontalProgress={horizontalProgress} />
          ))}
          <article className="tkf-work-panel tkf-work-closing">
            <span className="tkf-panel-line" style={{ transform: "scaleY(1)" }} />
            <div>
              <span>TRIPO STUDIO</span>
              <h3>Discover one connected AI workspace for creating production-ready 3D assets.</h3>
              <UnderlineLink href="https://studio.tripo3d.ai/">Start creating</UnderlineLink>
            </div>
          </article>
        </div>
        <div className="tkf-scroll-meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, progress / transitionEnd)})` }} />
        </div>
      </div>
    </section>
  );
}
