"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "./content";

export function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const audio = new Audio(SITE.audio);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.82;
    audioRef.current = audio;
    const tick = () => {
      if (!audio.paused) {
        const bpm = 184.57;
        const phase = ((audio.currentTime * bpm) / 60) % 1;
        setBeat(Math.exp(-phase * 8));
      } else setBeat(0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); setPlaying(true); } catch { setPlaying(false); }
    } else { audio.pause(); setPlaying(false); }
  };

  return (
    <button
      className={`sound-orb ${playing ? "is-playing" : ""}`}
      onClick={toggle}
      aria-label={playing ? "Pause site audio" : "Play site audio"}
      style={{ "--beat": beat } as React.CSSProperties}
      title={playing ? "Sound on" : "Sound off"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.2 10.2v3.6h3.1l3.4 2.8V7.4l-3.4 2.8H5.2Z" />
        <path className="sound-wave" d="M14.6 9.1c.9.7 1.4 1.7 1.4 2.9s-.5 2.2-1.4 2.9M17 7c1.5 1.2 2.3 2.9 2.3 5s-.8 3.8-2.3 5" />
      </svg>
    </button>
  );
}
