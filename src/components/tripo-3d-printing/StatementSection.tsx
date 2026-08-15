"use client";

import { useRef } from "react";
import { statement } from "./content";
import { StatementLogoScene } from "./StatementLogoScene";
import { useScrollProgress } from "./useScrollProgress";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

const wordsOf = (value: string) => value.trim().split(/\s+/);

function ProgressiveWords({
  text,
  progress,
  start,
  end,
}: {
  text: string;
  progress: number;
  start: number;
  end: number;
}) {
  const words = wordsOf(text);
  const range = Math.max(0.0001, end - start);

  return (
    <>
      {words.map((word, index) => {
        const ratio = words.length <= 1 ? 0 : index / (words.length - 1);
        const wordStart = start + range * ratio * 0.78;
        const wordEnd = wordStart + range * 0.22;
        const t = smooth((progress - wordStart) / Math.max(0.0001, wordEnd - wordStart));
        const c = Math.round(62 + t * 174);
        const opacity = 0.36 + t * 0.64;

        return (
          <span
            className="flow-word"
            key={`${word}-${index}`}
            style={{
              color: `rgba(${c},${c},${Math.max(0, c - 3)},${opacity})`,
              filter: `blur(${(1 - t) * 0.7}px)`,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </>
  );
}

export function StatementSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);

  const headlineIn = smooth((p + 0.01) / 0.07);
  const reveal = clamp01((p - 0.005) / 0.34);
  const detailIn = smooth((p - 0.13) / 0.12);
  const headlineExit = smooth((p - 0.40) / 0.14);

  const marqueeIn = smooth((p - 0.38) / 0.12);
  const marqueeMove = clamp01((p - 0.42) / 0.45);

  // Do not start the transition while the statement copy is still revealing.
  // The blinds begin only after the giant PRINT / ITERATE / IMPACT marquee is established.
  const wipe = clamp01((p - 0.82) / 0.18);
  const blind1 = smooth(wipe / 0.40);
  const blind2 = smooth((wipe - 0.14) / 0.40);
  const blind3 = smooth((wipe - 0.28) / 0.40);

  const line1 = statement.line1;
  const secondWords = wordsOf(statement.line2);
  const split = Math.max(2, Math.ceil(secondWords.length * 0.72));
  const line2 = secondWords.slice(0, split).join(" ");
  const line3 = secondWords.slice(split).join(" ");

  const headlineY = (1 - headlineIn) * 42 - headlineExit * 235;
  const detailsY = (1 - detailIn) * 34 - headlineExit * 125;
  const marqueeX = 7 - marqueeMove * 36;
  const marqueeY = 77 - marqueeMove * 18;

  return (
    <section ref={ref} className="statement-shell flow-statement-shell">
      <div className="statement-sticky flow-statement-sticky">
        <StatementLogoScene progress={p} />

        <div className="flow-bg-lines" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>

        <div
          className="flow-side-label"
          style={{ opacity: 1 - headlineExit * 0.85 }}
        >
          {statement.kicker}
        </div>

        <div
          className="flow-statement-headline"
          style={{
            opacity: headlineIn * (1 - headlineExit * 0.96),
            transform: `translate3d(0,${headlineY}px,0)`,
          }}
        >
          <h2>
            <span className="flow-headline-line">
              <ProgressiveWords text={line1} progress={reveal} start={0.00} end={0.42} />
            </span>
            <span className="flow-headline-line">
              <ProgressiveWords text={line2} progress={reveal} start={0.20} end={0.80} />
            </span>
            {line3 ? (
              <span className="flow-headline-line">
                <ProgressiveWords text={line3} progress={reveal} start={0.52} end={1.00} />
              </span>
            ) : null}
          </h2>
        </div>

        <div
          className="flow-rule"
          style={{
            opacity: detailIn * (1 - headlineExit),
            transform: `scaleX(${detailIn})`,
          }}
          aria-hidden="true"
        >
          <b>+</b>
        </div>

        <p
          className="flow-statement-detail flow-statement-detail-left"
          style={{
            opacity: detailIn * (1 - headlineExit),
            transform: `translate3d(0,${detailsY}px,0)`,
          }}
        >
          FROM IDEA TO OUTCOME.
          <br />
          ONE CONNECTED AI 3D WORKFLOW.
        </p>

        <p
          className="flow-statement-detail flow-statement-detail-right"
          style={{
            opacity: detailIn * (1 - headlineExit),
            transform: `translate3d(0,${detailsY}px,0)`,
          }}
        >
          {statement.body}
        </p>

        <div
          className="statement-marquee flow-statement-marquee"
          style={{
            opacity: marqueeIn,
            transform: `translate3d(${marqueeX}vw,${marqueeY}vh,0)`,
          }}
        >
          {[...statement.marquee, ...statement.marquee].map((word, index) => (
            <span key={`${word}-${index}`}>
              {word}
              <b>+</b>
            </span>
          ))}
        </div>

        <div className="flow-venetian-transition" aria-hidden="true">
          <i
            className="flow-blind flow-blind-1"
            style={{ transform: `translate3d(0,${(1 - blind1) * 120}vh,0)` }}
          />
          <i
            className="flow-blind flow-blind-2"
            style={{ transform: `translate3d(0,${(1 - blind2) * 120}vh,0)` }}
          />
          <i
            className="flow-blind flow-blind-3"
            style={{ transform: `translate3d(0,${(1 - blind3) * 120}vh,0)` }}
          />
        </div>
      </div>
    </section>
  );
}
