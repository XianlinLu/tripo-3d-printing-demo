import { facts, TRIPO_ASSETS } from "./content";

export function KeyFactsSection() {
  return (
    <section className="facts-section" id="facts">
      <div className="facts-topline">
        <span>✦ FROM IDEA TO OUTCOME.</span>
        <span>01 / TRIPO AT A GLANCE</span>
      </div>
      <div className="facts-heading">
        <div className="facts-blank" />
        <div>
          <h2>Key facts</h2>
          <p>A snapshot of a global AI 3D workspace built to move from inspiration to usable assets faster.</p>
        </div>
      </div>
      <div className="facts-editorial-grid">
        <article className="facts-image-card facts-image-a">
          <img src={TRIPO_ASSETS.factModel} alt="Featured TRIPO 3D gallery model" />
          <div><strong>{facts[0].value}</strong><span>{facts[0].label}</span></div>
        </article>
        <article className="facts-number-card">
          <small>CREATION ENGINE</small>
          <strong>{facts[3].value}</strong>
          <p>{facts[3].label}</p>
          <i>↗</i>
        </article>
        <article className="facts-image-card facts-image-b">
          <img src={TRIPO_ASSETS.factTexture} alt="Featured TRIPO textured 3D model" />
          <div><strong>{facts[2].value}</strong><span>{facts[2].label}</span></div>
        </article>
        <article className="facts-number-card facts-number-small">
          <small>DEVELOPER ECOSYSTEM</small>
          <strong>{facts[1].value}</strong>
          <p>{facts[1].label}</p>
          <i>↗</i>
        </article>
      </div>
      <div className="facts-partners">
        <span>IMAGE TO 3D</span><span>TEXT TO 3D</span><span>SEGMENTATION</span>
        <span>TEXTURING</span><span>RIGGING</span><span>3D PRINTING</span>
      </div>
    </section>
  );
}
