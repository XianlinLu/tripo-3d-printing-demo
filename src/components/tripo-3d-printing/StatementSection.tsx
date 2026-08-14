"use client";
import { useRef } from "react";
import { statement } from "./content";
import { useScrollProgress } from "./useScrollProgress";

export function StatementSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const reveal = Math.min(1, p / .28);
  const depart = Math.max(0, Math.min(1, (p - .43) / .25));
  const marqueeP = Math.max(0, Math.min(1, (p - .42) / .38));
  const wipe = Math.max(0, Math.min(1, (p - .80) / .20));
  return (
    <section ref={ref} className="statement-shell">
      <div className="statement-sticky">
        <div className="statement-grid-lines" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="statement-copy" style={{opacity: 1-depart, transform:`translate3d(0,${(1-reveal)*60 - depart*100}px,0) scale(${.94 + reveal*.06 - depart*.08}) rotate(${depart*-5}deg)`}}>
          <span>{statement.kicker}</span>
          <h2>{statement.line1}<br/><em>{statement.line2}</em></h2>
          <p>{statement.body}</p>
        </div>
        <div className="statement-marquee" style={{opacity:marqueeP, transform:`translate3d(${36-marqueeP*96}vw,0,0) rotate(${-3+marqueeP*1.5}deg)`}}>
          {statement.marquee.map((w,i)=><span key={w}>{w}{i<statement.marquee.length-1?<b>·</b>:null}</span>)}
        </div>
        <div className="stripe-wipe" aria-hidden="true">
          {Array.from({length:5}).map((_,i)=><i key={i} style={{transform:`scaleY(${Math.max(0,Math.min(1,(wipe-i*.05)*1.25))})`}} />)}
        </div>
      </div>
    </section>
  );
}
