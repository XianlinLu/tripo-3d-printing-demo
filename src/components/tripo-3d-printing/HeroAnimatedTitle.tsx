"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const WORDS = ["inspiration", "idea", "concept", "text", "image", "sketches"];

function chars(text: string) {
  return Array.from(text);
}

export function HeroAnimatedTitle() {
  const rootRef = useRef<HTMLHeadingElement | null>(null);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fixed = root.querySelectorAll<HTMLElement>("[data-fixed-char]");
    gsap.set(fixed, {
      opacity: 0,
      filter: "blur(11px)",
      y: 7,
      willChange: "transform,filter,opacity",
    });

    const tween = gsap.to(fixed, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      duration: 0.72,
      delay: 0.22,
      stagger: { each: 0.018, from: "random" },
      ease: "power2.out",
      onComplete: () => {
        gsap.set(fixed, { clearProps: "filter,willChange" });
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  useEffect(() => {
    const el = wordRef.current;
    if (!el) return;

    const incoming = el.querySelectorAll<HTMLElement>("[data-rotating-char]");
    gsap.killTweensOf(incoming);
    gsap.set(incoming, {
      opacity: 0,
      filter: "blur(14px)",
      y: 5,
      scaleY: 0.96,
      willChange: "transform,filter,opacity",
    });

    gsap.to(incoming, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scaleY: 1,
      duration: 0.56,
      stagger: { each: 0.035, from: "random" },
      ease: "power2.out",
      onComplete: () => {
        gsap.set(incoming, { clearProps: "filter,willChange,transform" });
      },
    });

    timerRef.current = window.setTimeout(() => {
      const current = wordRef.current?.querySelectorAll<HTMLElement>("[data-rotating-char]");
      if (!current?.length) return;

      gsap.to(current, {
        opacity: 0,
        filter: "blur(15px)",
        y: -3,
        scaleY: 0.95,
        duration: 0.42,
        stagger: { each: 0.028, from: "random" },
        ease: "power2.in",
        onComplete: () => {
          setWordIndex((index) => (index + 1) % WORDS.length);
        },
      });
    }, wordIndex === 0 ? 3100 : 2450);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      gsap.killTweensOf(incoming);
    };
  }, [wordIndex]);

  const line1 = "Get Production-Ready";
  const line2 = "3D Print Files from";
  const word = `${WORDS[wordIndex]}.`;

  return (
    <h1
      ref={rootRef}
      className="hero-title hero-title-target"
      aria-label={`${line1} ${line2} ${word}`}
    >
      <span className="hero-title-line hero-title-line-1">
        {chars(line1).map((char, index) => (
          <span data-fixed-char className="hero-title-char" key={`a-${index}`}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span className="hero-title-line hero-title-line-2">
        {chars(line2).map((char, index) => (
          <span data-fixed-char className="hero-title-char" key={`b-${index}`}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      <span className="hero-title-line hero-title-line-3">
        <span
          ref={wordRef}
          className="hero-rotating-word"
          aria-live="polite"
          aria-atomic="true"
        >
          {chars(word).map((char, index) => (
            <span
              data-rotating-char
              className="hero-title-char"
              key={`${wordIndex}-${index}-${char}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
