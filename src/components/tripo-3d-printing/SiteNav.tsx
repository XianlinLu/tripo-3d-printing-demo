"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AudioToggle } from "./AudioToggle";
import { SITE } from "./content";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`site-nav ${open ? "is-menu-open" : ""}`} data-vibrate>
        <a href="#top" className="brand" aria-label="Tripo home">
          <Image
            src={SITE.logo}
            alt="TRIPO"
            width={1046}
            height={293}
            priority
            className="brand-image"
          />
        </a>

        <div className="nav-actions">
          <AudioToggle />
          <a
            className="nav-cta"
            href="https://studio.tripo3d.ai/"
            target="_blank"
            rel="noreferrer"
          >
            TRY TRIPO WEB
          </a>
          <button
            className="menu-pill"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open menu"
          >
            MENU <i /><i />
          </button>
        </div>
      </header>

      <div
        className={`menu-overlay menu-drawer-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <aside className="menu-drawer" aria-label="Site menu">
          <div className="menu-drawer-actions">
            <AudioToggle />
            <a
              className="menu-drawer-cta"
              href="https://studio.tripo3d.ai/"
              target="_blank"
              rel="noreferrer"
            >
              TRY TRIPO WEB
            </a>
            <button
              className="menu-drawer-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              MENU <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className="menu-drawer-nav">
            <a href="#facts" onClick={() => setOpen(false)}>3D Printing</a>
            <a href="#cases" onClick={() => setOpen(false)}>Case Studies</a>
            <a href="#benefits" onClick={() => setOpen(false)}>Benefits</a>
            <a href="#stories" onClick={() => setOpen(false)}>Workflow</a>
          </nav>

          <a
            className="menu-story-pill"
            href="#top"
            onClick={() => setOpen(false)}
          >
            ✦ TRIPO 3D WORKFLOW
          </a>

          <div className="menu-drawer-bottom">
            <div className="menu-drawer-block menu-drawer-primary-info">
              <small>CREATE WITH TRIPO</small>
              <a
                href="https://studio.tripo3d.ai/"
                target="_blank"
                rel="noreferrer"
              >
                studio.tripo3d.ai
              </a>
              <a
                href="https://www.tripo3d.ai/"
                target="_blank"
                rel="noreferrer"
              >
                tripo3d.ai
              </a>
            </div>

            <div className="menu-drawer-block menu-drawer-secondary-info">
              <small>RESOURCES</small>
              <div className="menu-resource-grid">
                <a href="https://www.tripo3d.ai/" target="_blank" rel="noreferrer">Product</a>
                <a href="https://www.tripo3d.ai/blog" target="_blank" rel="noreferrer">Blog</a>
                <a href="https://studio.tripo3d.ai/" target="_blank" rel="noreferrer">Studio</a>
                <a href="https://www.tripo3d.ai/pricing" target="_blank" rel="noreferrer">Pricing</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
