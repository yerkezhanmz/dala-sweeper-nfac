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
    <div className="flex items-center justify-between gap-4 w-full max-w-3xl px-4 py-3 rounded-lg bg-card/60 backdrop-blur border border-border">
      <div className="flex items-center gap-2 font-mono text-lg tabular-nums">
        <Bomb className="size-5 text-muted-foreground" />
        <span className="font-bold w-10 text-left">{remaining}</span>
        <Flag className="size-4 text-muted-foreground ml-2" />
        <span className="text-muted-foreground w-10">{state.flagsPlaced}</span>
      </div>

      <Button
        variant="secondary"
        size="lg"
        onClick={onReset}
        className="rounded-full size-12 p-0"
        aria-label="New game"
      >
        <FaceIcon className="size-5" />
      </Button>

      <div className="flex items-center gap-2 font-mono text-lg tabular-nums">
        <RotateCcw className="size-4 text-muted-foreground opacity-0" />
        <span className="font-bold w-16 text-right">{formatTime(elapsed)}</span>
      </div>
    </div>
  );
}
