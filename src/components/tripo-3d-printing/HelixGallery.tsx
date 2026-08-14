"use client";
import { useEffect,useRef } from "react";
import { helixCards, TRIPO_ASSETS } from "./content";
import { useScrollProgress } from "./useScrollProgress";

export function HelixGallery(){
 const ref=useRef<HTMLElement|null>(null); const p=useScrollProgress(ref); const cardRefs=useRef<(HTMLElement|null)[]>([]);
 useEffect(()=>{
   const vw=window.innerWidth,vh=window.innerHeight; const unfold=Math.max(0,Math.min(1,(p-.70)/.30));
   cardRefs.current.forEach((el,i)=>{ if(!el)return; const rel=i-p*7.2; const angle=rel*.57; const hx=Math.sin(angle)*Math.min(440,vw*.30); const hy=rel*82; const hz=Math.cos(angle)*440-320; const hr=angle*31;
     const cols=3,row=Math.floor(i/cols),col=i%cols; const gx=(col-1)*Math.min(360,vw*.255),gy=(row-1)*Math.min(220,vh*.25);
     const x=hx+(gx-hx)*unfold,y=hy+(gy-hy)*unfold,z=hz*(1-unfold),r=hr*(1-unfold);
     el.style.transform=`translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) rotateY(${r}deg) rotateZ(${Math.sin(angle)*6*(1-unfold)}deg)`;
     el.style.opacity=String(Math.max(.12,1-Math.abs(rel)*.13)); el.style.zIndex=String(30-Math.min(29,Math.abs(Math.round(rel))));
   });
 },[p]);
 return <section ref={ref} className="helix-shell" id="stories"><div className="helix-sticky">
   <div className="stories-intro" style={{opacity:Math.max(0,1-p*3.4),transform:`translateY(${-p*80}px)`}}><span>04 / CREATOR STORIES</span><h2>Great 3D starts<br/>with a clear idea.</h2><p>Move from concept to generation, refinement and production without breaking the creative flow.</p></div>
   <div className="helix-head" style={{opacity:Math.max(0,Math.min(1,(p-.12)*6))}}><span>EXPLORE THE WORKFLOW</span><h2>Every stage,<br/>one connected system.</h2></div>
   <div className="helix-line helix-line-a"/><div className="helix-line helix-line-b"/>
   <div className="helix-media helix-media-a"><img src={TRIPO_ASSETS.communityLeft} alt="TRIPO community work"/></div>
   <div className="helix-media helix-media-b"><img src={TRIPO_ASSETS.communityRight} alt="TRIPO creator work"/></div>
   <div className="helix-stage">{helixCards.map((c,i)=><article key={c.title} ref={(el)=>{cardRefs.current[i]=el}} className="helix-card"><span>{c.eyebrow}</span><h3>{c.title}</h3><p>{c.body}</p><div className="helix-card-corner">↗</div></article>)}</div>
   <div className="helix-count"><b>{String(Math.min(9,Math.floor(p*9)+1)).padStart(2,"0")}</b><span>/ 09</span></div>
 </div></section>;
}
