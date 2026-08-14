import { formatCards } from "./content";
export function FormatSection(){return <section className="formats-section" id="formats">
  <div className="formats-head"><span>03 / ALL FORMATS SUPPORT</span><h2>From Tripo to your slicer,<br/>renderer, or 3D pipeline.</h2><p>Use one print-ready model across manufacturing, review, rendering, and downstream production workflows.</p></div>
  <div className="format-grid">{formatCards.map((c,i)=><article key={c.title}><span>0{i+1}</span><h3>{c.title}</h3><p>{c.text}</p><div className="format-arrow">↗</div></article>)}</div>
</section>}
