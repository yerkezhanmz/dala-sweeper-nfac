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
        "flex items-center justify-center font-bold select-none transition-all duration-100 rounded-[3px]",
        "border border-border/40",
        !isRevealed &&
          "bg-secondary hover:bg-accent active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        isRevealed && !cell.mine && "bg-background/50",
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
