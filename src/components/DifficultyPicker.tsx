import { DIFFICULTIES, type DifficultyKey } from "@/lib/minesweeper";
import { cn } from "@/lib/utils";

interface Props {
  current: DifficultyKey;
  onChange: (d: DifficultyKey) => void;
}

const LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

export function DifficultyPicker({ current, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card/60 backdrop-blur border border-border">
      {Object.keys(DIFFICULTIES).map((key) => {
        const cfg = DIFFICULTIES[key];
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key as DifficultyKey)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <div>{LABELS[key]}</div>
            <div className="text-[10px] opacity-70 font-mono">
              {cfg.rows}×{cfg.cols} · {cfg.mines}
            </div>
          </button>
        );
      })}
    </div>
  );
}
