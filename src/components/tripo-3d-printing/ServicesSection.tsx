"use client";
import { useRef } from "react";
import { capabilities } from "./content";
import { StoneScene } from "./StoneScene";
import { useScrollProgress } from "./useScrollProgress";

export function ServicesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const wordPhase = Math.min(.46, p);
  const index = Math.min(capabilities.length-1, Math.floor(wordPhase / .115));
  const explode = Math.max(0, Math.min(1, (p-.46)/.16));
  const cards = Math.max(0, Math.min(1, (p-.60)/.33));
  return (
    <section ref={ref} className="services-shell" id="benefits">
      <div className="services-sticky">
        <div className="smoke smoke-a"/><div className="smoke smoke-b"/><div className="smoke smoke-c"/>
        <StoneScene progress={p}/>
        <div className="services-label">03 / SMARTER CREATION · SIMPLIFIED WORKFLOW</div>
        <div className="services-giant" aria-hidden="true">
          {capabilities.map((b,i)=><div key={b.short} className={`giant-word ${index===i?"is-active":""}`}>
            {Array.from(b.short).map((ch,j)=>{
              const a=(j*53+17)%360*Math.PI/180; const dist=explode*(110+(j%6)*42);
              return <span key={j} style={{transform:`translate3d(${Math.cos(a)*dist}px,${Math.sin(a)*dist}px,${explode*(j%3)*14}px) rotate(${explode*(j%2?52:-42)}deg)`,opacity:index===i?1-explode*.86:0}}>{ch===" "?"\u00A0":ch}</span>;
            })}
          </div>)}
        </div>
        <div className="service-cards" style={{opacity:cards}}>
          {capabilities.map((b,i)=>{const local=Math.max(0,Math.min(1,(cards-i*.08)/.72)); return <article key={b.title} className={`service-card service-card-${i+1}`} style={{opacity:local,transform:`translate3d(${(i%2?1:-1)*(1-local)*18}vw,${(i<2?-1:1)*(1-local)*18}vh,0)`}}><div><span>{b.number}</span><i>✦</i></div><h3>{b.title}</h3><p>{b.body}</p></article>})}
        </div>
        <div className="services-side-word">AI 3D WORKSPACE</div>
        <div className="services-progress"><span style={{height:`${p*100}%`}}/></div>
      </div>
    </section>
  );
}
