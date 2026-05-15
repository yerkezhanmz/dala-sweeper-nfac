import { DIFFICULTIES, type DifficultyKey } from "@/lib/minesweeper";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface Props {
  current: DifficultyKey;
  onChange: (d: DifficultyKey) => void;
}

export function DifficultyPicker({ current, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="inline-flex flex-wrap justify-center items-center gap-1 p-1 rounded-xl bg-card/70 backdrop-blur border border-border shadow-sm">
      {Object.keys(DIFFICULTIES).map((key) => {
        const cfg = DIFFICULTIES[key];
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key as DifficultyKey)}
            className={cn(
              "px-6 py-3 rounded-lg text-base font-semibold transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <div>{t(`diff.${key}`)}</div>
            <div className="text-xs opacity-70 font-mono">
              {cfg.rows}×{cfg.cols} · {cfg.mines}
            </div>
          </button>
        );
      })}
    </div>
  );
}
