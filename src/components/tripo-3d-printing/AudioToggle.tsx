"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "./content";

export function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(SITE.audio);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.82;
    audioRef.current = audio;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <button
      className={`sound-orb ${playing ? "is-playing" : "is-muted"}`}
      onClick={toggle}
      aria-label={playing ? "Turn sound off" : "Turn sound on"}
      aria-pressed={playing}
      title={playing ? "Sound on" : "Sound off"}
    >
      {playing ? (
        <svg className="sound-icon sound-icon-on" viewBox="0 0 24 24" aria-hidden="true">
          <path className="sound-speaker" d="M4.8 9.3v5.4h3.5l4.4 3.45V5.85L8.3 9.3H4.8Z" />
          <path className="sound-wave" d="M15.1 8.45c1.05.82 1.65 2.02 1.65 3.55 0 1.53-.6 2.73-1.65 3.55" />
          <path className="sound-wave sound-wave-outer" d="M17.45 6.35c1.72 1.42 2.7 3.25 2.7 5.65s-.98 4.23-2.7 5.65" />
        </svg>
      ) : (
        <svg className="sound-icon sound-icon-off" viewBox="0 0 24 24" aria-hidden="true">
          <path className="sound-speaker" d="M4.8 9.3v5.4h3.5l4.4 3.45V5.85L8.3 9.3H4.8Z" />
          <path className="sound-muted-slash" d="M6.1 5.6 18.2 18.4" />
        </svg>
      )}
    </button>
  );
}
