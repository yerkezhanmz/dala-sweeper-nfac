import { create } from "zustand";

interface AnimationState {
  hasPlayed: boolean;
  setHasPlayed: (v: boolean) => void;
}

// Simple singleton state to track if the entry animation has played in this session/mount.
// Using a variable outside the component to persist across page transitions.
let globalHasPlayed = false;

export function useEntryAnimation() {
  const [hasPlayed, setHasPlayedState] = (typeof window !== "undefined")
    ? [globalHasPlayed, (v: boolean) => { globalHasPlayed = v; }]
    : [true, () => { }]; // SSR fallback

  return {
    hasPlayed,
    markAsPlayed: () => setHasPlayedState(true),
  };
}
