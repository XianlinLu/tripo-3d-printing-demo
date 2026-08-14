"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AudioToggle } from "./AudioToggle";
import { SITE } from "./content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const MENU_LOGO = `${BASE}/tripo/visuals/menu-logo.png`;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="site-nav" data-vibrate>
        <a href="#top" className="brand" aria-label="Tripo home">
          <Image src={SITE.logo} alt="TRIPO" width={472} height={128} priority className="brand-image" />
        </a>
        <div className="nav-actions">
          <AudioToggle />
          <a className="nav-cta" href="#stories">TRY TRIPO WEB</a>
          <button className="menu-pill" onClick={() => setOpen(true)} aria-expanded={open}>MENU <i /><i /></button>
        </div>
      </header>

      <div className={`menu-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="menu-overlay-top">
          <Image src={MENU_LOGO} alt="TRIPO" width={1046} height={293} className="menu-logo menu-logo-exact" />
          <button className="menu-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <span className="menu-close-label">CLOSE</span>
            <span className="menu-close-icon">×</span>
          </button>
        </div>

        <div className="menu-overlay-main">
          <nav>
            <a href="#top" onClick={() => setOpen(false)}>Home <span>01</span></a>
            <a href="#facts" onClick={() => setOpen(false)}>3D Printing <span>02</span></a>
            <a href="#cases" onClick={() => setOpen(false)}>Case studies <span>03</span></a>
            <a href="#benefits" onClick={() => setOpen(false)}>Benefits <span>04</span></a>
            <a href="#stories" onClick={() => setOpen(false)}>Workflow <span>05</span></a>
          </nav>
          <div className="menu-aside">
            <small>CREATE WITH TRIPO</small>
            <p>From inspiration to production-ready 3D assets in one AI-powered workflow.</p>
            <a href="https://www.tripo3d.ai/" target="_blank" rel="noreferrer">VISIT TRIPO ↗</a>
          </div>
        </div>
      </div>
    </>
  );
}
