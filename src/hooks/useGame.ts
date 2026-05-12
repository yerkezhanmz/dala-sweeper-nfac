import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  createGame,
  revealCell,
  toggleFlag,
  chordReveal,
  type DifficultyKey,
  type DifficultyConfig,
  type GameState,
} from "@/lib/minesweeper";
import { loadGame, saveGame, recordResult } from "@/lib/storage";

type Action =
  | { type: "reveal"; r: number; c: number }
  | { type: "flag"; r: number; c: number }
  | { type: "chord"; r: number; c: number }
  | { type: "reset"; difficulty: DifficultyKey; config?: DifficultyConfig }
  | { type: "hydrate"; state: GameState };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "reveal":
      return revealCell(state, action.r, action.c);
    case "flag":
      return toggleFlag(state, action.r, action.c);
    case "chord":
      return chordReveal(state, action.r, action.c);
    case "reset":
      return createGame(action.difficulty, action.config);
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

export function useGame(initialDifficulty: DifficultyKey = "beginner") {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    createGame(initialDifficulty),
  );
  const [hydrated, setHydrated] = useState(false);
  const recordedRef = useRef(false);

  // hydrate from storage on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved && (saved.status === "playing" || saved.status === "idle")) {
      dispatch({ type: "hydrate", state: saved });
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    if (state.status === "won" || state.status === "lost") {
      saveGame(null);
    } else {
      saveGame(state);
    }
  }, [state, hydrated]);

  // record stats once on game end
  useEffect(() => {
    if (!hydrated) return;
    if ((state.status === "won" || state.status === "lost") && !recordedRef.current) {
      recordedRef.current = true;
      const time = (state.endedAt ?? Date.now()) - (state.startedAt ?? Date.now());
      recordResult(state.difficulty, state.status === "won", time);
    }
    if (state.status === "idle" || state.status === "playing") {
      recordedRef.current = false;
    }
  }, [state.status, state.endedAt, state.startedAt, state.difficulty, hydrated]);

  const reveal = useCallback((r: number, c: number) => dispatch({ type: "reveal", r, c }), []);
  const flag = useCallback((r: number, c: number) => dispatch({ type: "flag", r, c }), []);
  const chord = useCallback((r: number, c: number) => dispatch({ type: "chord", r, c }), []);
  const reset = useCallback(
    (difficulty: DifficultyKey, config?: DifficultyConfig) =>
      dispatch({ type: "reset", difficulty, config }),
    [],
  );

  return { state, hydrated, reveal, flag, chord, reset };
}
