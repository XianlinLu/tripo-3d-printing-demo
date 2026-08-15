"use client";

type Listener = (enabled: boolean) => void;

let enabled = false;
let sharedAudio: HTMLAudioElement | null = null;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener(enabled));
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("tripo:sound-state", { detail: { enabled } })
    );
  }
}

function ensureAudio(src: string) {
  if (typeof window === "undefined") return null;

  if (!sharedAudio) {
    sharedAudio = new Audio(src);
    sharedAudio.loop = true;
    sharedAudio.preload = "auto";
    sharedAudio.volume = 0.82;

    sharedAudio.addEventListener("ended", () => {
      enabled = false;
      notify();
    });
  }

  return sharedAudio;
}

export function isSoundEnabled() {
  return enabled;
}

export function subscribeSound(listener: Listener) {
  listeners.add(listener);
  listener(enabled);

  return () => {
    listeners.delete(listener);
  };
}

export async function toggleSound(src: string) {
  const audio = ensureAudio(src);
  if (!audio) return false;

  if (!enabled) {
    try {
      await audio.play();
      enabled = true;
    } catch {
      enabled = false;
    }
  } else {
    audio.pause();
    enabled = false;
  }

  notify();
  return enabled;
}
