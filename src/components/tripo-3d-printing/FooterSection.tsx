"use client";

import { type CSSProperties } from "react";

const footerLetters = ["T", "R", "I", "P", "O"];

export function FooterSection() {
  return (
    <footer id="footer" className="trionn-footer">
      <div className="trionn-footer-smoke trionn-footer-smoke-a" />
      <div className="trionn-footer-smoke trionn-footer-smoke-b" />
      <div className="trionn-footer-smoke trionn-footer-smoke-c" />

      <div className="trionn-footer-topline">
        <span>LET&apos;S BUILD WHAT&apos;S NEXT IN 3D.</span>
      </div>

      <h2>Ready to build<br />something bold?</h2>

      <a className="trionn-footer-cta" href="https://studio.tripo3d.ai/" target="_blank" rel="noreferrer">
        <span>START CREATING IN TRIPO</span><b>→</b>
      </a>

      <div className="trionn-footer-meta">
        <div>
          <span>EXPLORE</span>
          <a href="https://studio.tripo3d.ai/" target="_blank" rel="noreferrer">Tripo Studio</a>
          <a href="https://www.tripo3d.ai/zh" target="_blank" rel="noreferrer">Tripo 3D</a>
        </div>
        <div>
          <span>PRODUCT</span>
          <a href="#cases">3D Printing</a>
          <a href="#benefits">AI 3D Workflow</a>
        </div>
        <div>
          <span>FOLLOW</span>
          <a href="https://www.youtube.com/@TripoAI" target="_blank" rel="noreferrer">YouTube</a>
          <a href="https://discord.com/invite/tripoai" target="_blank" rel="noreferrer">Discord</a>
        </div>
      </div>

      <div className="trionn-footer-note">
        <span>© TRIPO® 2026</span>
        <span>SOUND ON ♪ — HOVER THE LINES.</span>
      </div>

      <div className="trionn-line-logo" aria-label="TRIPO">
        {footerLetters.map((letter, index) => <span key={letter} style={{ "--letter": index } as CSSProperties}>{letter}</span>)}
      </div>
    </footer>
  );
}
