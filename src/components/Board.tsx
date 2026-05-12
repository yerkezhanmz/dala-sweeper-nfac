import { useEffect, useState } from "react";
import { Cell } from "./Cell";
import type { GameState } from "@/lib/minesweeper";

interface Props {
  state: GameState;
  onReveal: (r: number, c: number) => void;
  onFlag: (r: number, c: number) => void;
  onChord: (r: number, c: number) => void;
}

export function Board({ state, onReveal, onFlag, onChord }: Props) {
  const [size, setSize] = useState(32);

  useEffect(() => {
    function compute() {
      const maxW = Math.min(window.innerWidth - 32, 1100);
      const maxH = window.innerHeight - 240;
      const byW = Math.floor(maxW / state.cols);
      const byH = Math.floor(maxH / state.rows);
      setSize(Math.max(20, Math.min(40, Math.min(byW, byH))));
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [state.rows, state.cols]);

  return (
    <div
      className="inline-grid p-2 rounded-lg bg-card/60 backdrop-blur border border-border shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${state.cols}, ${size}px)`,
        gap: 2,
      }}
    >
      {state.board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            r={r}
            c={c}
            size={size}
            exploded={
              !!state.explodedAt && state.explodedAt.r === r && state.explodedAt.c === c
            }
            onReveal={onReveal}
            onFlag={onFlag}
            onChord={onChord}
          />
        )),
      )}
    </div>
  );
}
