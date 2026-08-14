"use client";
import { ElementType, useEffect, useRef } from "react";
import gsap from "gsap";

export function BlurText({ text, as = "div", className = "", delay = 0, stagger = 0.035 }: { text: string; as?: ElementType; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll("[data-char]");
    gsap.set(chars, { opacity: 0, filter: "blur(12px)", y: 8 });
    const tween = gsap.to(chars, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      duration: 0.75,
      delay,
      stagger: { each: stagger, from: "random" },
      ease: "power2.out",
      onComplete: () => gsap.set(chars, { clearProps: "filter,willChange" }),
    });
    return () => tween.kill();
  }, [text, delay, stagger]);
  return <Tag ref={ref as never} className={className} aria-label={text}>{Array.from(text).map((ch, i) => <span data-char key={`${ch}-${i}`} className="blur-char">{ch === " " ? "\u00A0" : ch}</span>)}</Tag>;
}
