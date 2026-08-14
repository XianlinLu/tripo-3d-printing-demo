import Image from "next/image";
import { SITE } from "./content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const FOOTER_ROCK = `${BASE}/tripo/visuals/footer-rock.png`;

export function FooterSection() {
  return (
    <footer id="footer" className="footer-section footer-section-compact">
      <div className="footer-cloud footer-cloud-a" />
      <div className="footer-cloud footer-cloud-b" />
      <Image src={SITE.logo} alt="TRIPO" width={472} height={128} className="footer-top-logo" />

      <div className="footer-top footer-compact-copy">
        <span>READY FOR YOUR NEXT 3D IDEA?</span>
        <h2>Ready to build<br />something bold?</h2>
        <div className="footer-actions">
          <a href="https://www.tripo3d.ai/" target="_blank" rel="noreferrer">TRY TRIPO WEB ↗</a>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>

      <div className="footer-rock-wrap" aria-hidden="true">
        <img src={FOOTER_ROCK} alt="" />
      </div>

      <div className="footer-legal footer-legal-compact">
        <span>© 2026 TRIPO. ALL RIGHTS RESERVED.</span>
        <span>IMAGE TO 3D · TEXT TO 3D · PRODUCTION-READY</span>
      </div>
    </footer>
  );
}
