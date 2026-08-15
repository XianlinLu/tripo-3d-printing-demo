"use client";

import { useEffect, useState } from "react";
import { SITE } from "./content";
import { subscribeSound, toggleSound } from "./soundState";

export function AudioToggle() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return subscribeSound(setPlaying);
  }, []);

  return (
    <button
      className={`sound-orb ${playing ? "is-playing" : "is-muted"}`}
      onClick={() => void toggleSound(SITE.audio)}
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
