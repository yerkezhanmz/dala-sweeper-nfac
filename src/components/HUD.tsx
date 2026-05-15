import { useEffect, useState } from "react";
import { Flag, Bomb, RotateCcw, Trophy, Skull, Smile } from "lucide-react";
import type { GameState } from "@/lib/minesweeper";
import { Button } from "@/components/ui/button";

interface Props {
  state: GameState;
  onReset: () => void;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function HUD({ state, onReset }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.status]);

  const elapsed =
    state.startedAt === null
      ? 0
      : (state.endedAt ?? now) - state.startedAt;

  const remaining = state.mines - state.flagsPlaced;

  const FaceIcon =
    state.status === "won" ? Trophy : state.status === "lost" ? Skull : Smile;

  return (
    <div className="grid grid-cols-3 items-center w-full max-w-3xl px-4 py-3 rounded-xl bg-card/70 backdrop-blur border border-border shadow-sm">
      <div className="flex items-center gap-2 font-mono text-lg tabular-nums">
        <Bomb className="size-5 text-muted-foreground" />
        <span className="font-bold w-10 text-left">{remaining}</span>
        <Flag className="size-4 text-muted-foreground ml-2" />
        <span className="text-muted-foreground w-10">{state.flagsPlaced}</span>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          className="rounded-full size-14 p-0 border-border dark:border-white/30 bg-secondary/30 dark:bg-secondary/50 hover:bg-secondary/80 transition-all shadow-md"
          aria-label="New game"
        >
          <FaceIcon className="size-7" />
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2 font-mono text-lg tabular-nums">
        <span className="font-bold w-16 text-right">{formatTime(elapsed)}</span>
      </div>
    </div>
  );
}
