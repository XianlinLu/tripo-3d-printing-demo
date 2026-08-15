"use client";

import { useRef } from "react";
import { statement } from "./content";
import { useScrollProgress } from "./useScrollProgress";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

function splitWords(text: string) {
  return text.trim().split(/\s+/);
}

function RevealLine({
  text,
  progress,
  start,
  end,
  indent = 0,
}: {
  text: string;
  progress: number;
  start: number;
  end: number;
  indent?: number;
}) {
  const words = splitWords(text);
  const span = Math.max(0.0001, end - start);

  return (
    <span
      className="statement-reveal-line"
      style={{ paddingLeft: `${indent}vw` }}
    >
      {words.map((word, index) => {
        const stagger = words.length <= 1 ? 0 : index / (words.length - 1);
        const localStart = start + span * stagger * 0.72;
        const localEnd = localStart + span * 0.28;
        const t = smooth((progress - localStart) / Math.max(0.0001, localEnd - localStart));
        const light = Math.round(58 + t * 182);
        const alpha = 0.28 + t * 0.72;

        return (
          <span
            key={`${word}-${index}`}
            className="statement-word"
            style={{
              color: `rgba(${light},${light},${Math.max(0, light - 3)},${alpha})`,
              filter: `blur(${(1 - t) * 0.55}px)`,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </span>
  );
}

export function StatementSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);

  const intro = smooth((p - 0.02) / 0.10);
  const revealP = clamp01((p - 0.06) / 0.29);
  const copyExit = smooth((p - 0.43) / 0.16);

  const marqueeIn = smooth((p - 0.46) / 0.16);
  const marqueeHold = clamp01((p - 0.58) / 0.10);
  const marqueeExit = smooth((p - 0.72) / 0.12);

  const wipe = smooth((p - 0.77) / 0.21);

  const line1 = statement.line1;
  const line2Words = splitWords(statement.line2);
  const splitAt = Math.max(2, Math.ceil(line2Words.length * 0.68));
  const line2 = line2Words.slice(0, splitAt).join(" ");
  const line3 = line2Words.slice(splitAt).join(" ");

  const marqueeY =
    (1 - marqueeIn) * 42 -
    marqueeHold * 11 -
    marqueeExit * 26;

  const stripeCount = 6;

  return (
    <section ref={ref} className="statement-shell statement-shell-match">
      <div className="statement-sticky statement-sticky-match">
        <div className="statement-grid-lines" aria-hidden="true">
          <i /><i /><i /><i />
        </div>

        <div
          className="statement-kicker-match"
          style={{
            opacity: intro * (1 - copyExit),
            transform: `translate3d(0,${(1 - intro) * 18 - copyExit * 25}px,0)`,
          }}
        >
          {statement.kicker}
        </div>

        <div
          className="statement-main-match"
          style={{
            opacity: 1 - copyExit * 0.92,
            transform: `translate3d(0,${(1 - intro) * 78 - copyExit * 210}px,0)`,
          }}
        >
          <h2 aria-label={`${line1} ${statement.line2}`}>
            <RevealLine
              text={line1}
              progress={revealP}
              start={0}
              end={0.46}
              indent={7.8}
            />
            <RevealLine
              text={line2}
              progress={revealP}
              start={0.23}
              end={0.79}
            />
            {line3 ? (
              <RevealLine
                text={line3}
                progress={revealP}
                start={0.52}
                end={1}
              />
            ) : null}
          </h2>
        </div>

        <p
          className="statement-body-match"
          style={{
            opacity: smooth((p - 0.19) / 0.11) * (1 - copyExit),
            transform: `translate3d(0,${(1 - smooth((p - 0.19) / 0.11)) * 24 - copyExit * 70}px,0)`,
          }}
        >
          {statement.body}
        </p>

        <div
          className="statement-marquee statement-marquee-match"
          style={{
            opacity: marqueeIn * (1 - marqueeExit * 0.72),
            transform: `translate3d(0,${marqueeY}vh,0)`,
          }}
        >
          {statement.marquee.map((word, index) => (
            <span key={word}>
              {word}
              {index < statement.marquee.length - 1 ? <b>+</b> : null}
            </span>
          ))}
        </div>

        <div className="stripe-wipe stripe-wipe-match" aria-hidden="true">
          {Array.from({ length: stripeCount }).map((_, index) => {
            const stripeT = smooth((wipe - index * 0.075) / 0.62);
            return (
              <i
                key={index}
                style={{
                  transform: `translate3d(0,${(1 - stripeT) * 112}%,0)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
