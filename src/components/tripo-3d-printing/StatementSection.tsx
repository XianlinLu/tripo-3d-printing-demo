"use client";

import { useRef } from "react";
import { statement } from "./content";
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

  // Very short transition window, matching the supplied recording.
  const wipe = clamp01((p - 0.885) / 0.105);
  const bandA = smooth(wipe / 0.43);
  const bandB = smooth((wipe - 0.18) / 0.43);
  const paper = smooth((wipe - 0.34) / 0.66);
  const keyPreview = smooth((wipe - 0.72) / 0.28);

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

        <div className="flow-transition-wipe" aria-hidden="true">
          <i
            className="flow-transition-band flow-transition-band-a"
            style={{ transform: `translate3d(0,${(1 - bandA) * 125}%,0)` }}
          />
          <i
            className="flow-transition-band flow-transition-band-b"
            style={{ transform: `translate3d(0,${(1 - bandB) * 125}%,0)` }}
          />
          <i
            className="flow-transition-paper"
            style={{ transform: `translate3d(0,${(1 - paper) * 102}%,0)` }}
          />
          <div
            className="flow-transition-keyfacts-preview"
            style={{
              opacity: keyPreview,
              transform: `translate3d(-50%,${(1 - keyPreview) * 22}px,0)`,
            }}
          >
            <strong>Key facts</strong>
            <span>
              A snapshot of a global AI 3D workspace built to move
              <br />
              from inspiration to usable assets faster.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
