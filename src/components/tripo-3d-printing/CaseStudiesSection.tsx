"use client";
import { useRef } from "react";
import { cases } from "./content";
import { useScrollProgress } from "./useScrollProgress";

export function CaseStudiesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const p = useScrollProgress(ref);
  const x = p * 178;
  return (
    <section ref={ref} className="case-shell" id="cases">
      <div className="case-sticky">
        <div className="case-heading"><span>02 / CASE STUDIES</span><h2>Built for real<br/>3D workflows.</h2><p>Three production scenarios where speed, structure and detail all matter.</p></div>
        <div className="case-track" style={{transform:`translate3d(-${x}vw,0,0)`}}>
          {cases.map((item,i)=><article className="case-card" key={item.kicker}>
            <div className="case-card-media"><img src={item.image} alt={item.kicker}/><span>0{i+1}</span></div>
            <div className="case-card-copy"><small>{item.kicker}</small><h3>{item.title}</h3><p>{item.body}</p><a href="#benefits">VIEW WORKFLOW ↗</a></div>
          </article>)}
          <article className="case-outro"><span>DISCOVER MORE</span><h3>One workspace.<br/>More ways to create.</h3><a href="https://www.tripo3d.ai/" target="_blank" rel="noreferrer">EXPLORE TRIPO ↗</a></article>
        </div>
        <div className="case-progress"><span style={{width:`${Math.max(8,p*100)}%`}}/></div>
      </div>
    </section>
  );
}
