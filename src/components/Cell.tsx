import { memo } from "react";
import type { Cell as CellType } from "@/lib/minesweeper";
import { cn } from "@/lib/utils";

const NUMBER_COLORS = [
  "",
  "text-sky-500",
  "text-emerald-500",
  "text-rose-500",
  "text-indigo-500",
  "text-amber-500",
  "text-cyan-500",
  "text-fuchsia-500",
  "text-foreground",
];

interface Props {
  cell: CellType;
  r: number;
  c: number;
  size: number;
  exploded: boolean;
  onReveal: (r: number, c: number) => void;
  onFlag: (r: number, c: number) => void;
  onChord: (r: number, c: number) => void;
}

function CellInner({ cell, r, c, size, exploded, onReveal, onFlag, onChord }: Props) {
  const isRevealed = cell.state === "revealed";
  const isFlagged = cell.state === "flagged";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRevealed) onChord(r, c);
    else onReveal(r, c);
  };

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    onFlag(r, c);
  };

  let content: React.ReactNode = null;
  if (isFlagged) content = "🚩";
  else if (isRevealed) {
    if (cell.mine) content = "💣";
    else if (cell.adjacent > 0) content = cell.adjacent;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onContextMenu={handleContext}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      className={cn(
        "flex items-center justify-center font-bold select-none transition-colors duration-75 rounded-[2px]",
        "border border-border",
        !isRevealed &&
          "bg-secondary hover:bg-accent active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.25)] ring-1 ring-black/10 dark:ring-white/5",
        isRevealed && !cell.mine && "bg-background/80 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        isRevealed && cell.mine && exploded && "bg-destructive",
        isRevealed && cell.mine && !exploded && "bg-destructive/40",
        isRevealed && !cell.mine && cell.adjacent > 0 && NUMBER_COLORS[cell.adjacent],
      )}
      aria-label={`Cell ${r},${c}`}
    >
      {content}
    </button>
  );
}

export const Cell = memo(CellInner);
