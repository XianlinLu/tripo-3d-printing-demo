import Image from "next/image";
import { SITE } from "./content";
export function FooterSection(){return <footer id="footer" className="footer-section">
  <div className="footer-smoke footer-smoke-a"/><div className="footer-smoke footer-smoke-b"/><div className="footer-smoke footer-smoke-c"/>
  <div className="footer-top"><span>READY FOR YOUR NEXT 3D IDEA?</span><h2>Ready to build<br/>something bold?</h2><div className="footer-actions"><a href="https://www.tripo3d.ai/" target="_blank" rel="noreferrer">TRY TRIPO WEB ↗</a><a href="#top">BACK TO TOP ↑</a></div></div>
  <div className="footer-grid">
    <div className="footer-brand"><Image src={SITE.logo} alt="TRIPO" width={472} height={128}/><p>AI-powered 3D creation from text, images and sketches to production-ready assets.</p></div>
    <div><small>PRODUCTS</small><a href="https://www.tripo3d.ai/">Tripo Studio</a><a href="https://www.tripo3d.ai/">Tripo API</a><a href="https://www.tripo3d.ai/">Game Hub</a></div>
    <div><small>FEATURES</small><a href="#benefits">Image to 3D</a><a href="#benefits">Text to 3D</a><a href="#stories">Texturing</a><a href="#stories">Rigging</a></div>
    <div><small>WORKFLOW</small><a href="#cases">3D Printing</a><a href="#stories">Segmentation</a><a href="#facts">High Detail</a></div>
    <div><small>RESOURCES</small><a href="https://www.tripo3d.ai/">Blog</a><a href="https://www.tripo3d.ai/">Tutorials</a><a href="https://www.tripo3d.ai/">Pricing</a></div>
  </div>
  <div className="footer-outline" aria-hidden="true">TRIPO</div>
  <div className="footer-legal"><span>© 2026 TRIPO. ALL RIGHTS RESERVED.</span><span>IMAGE TO 3D · TEXT TO 3D · PRODUCTION-READY</span></div>
</footer>}
