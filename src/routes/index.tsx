import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MousePointerClick, Flag, Hash, Trophy, Sparkles } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Board } from "@/components/Board";
import { HUD } from "@/components/HUD";
import { DifficultyPicker } from "@/components/DifficultyPicker";
import { useGame } from "@/hooks/useGame";
import type { DifficultyKey } from "@/lib/minesweeper";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minesweep — A modern take on Minesweeper" },
      {
        name: "description",
        content:
          "Play Minesweeper online with a clean modern design, multiple difficulties, persistent stats, and resume-anywhere progress.",
      },
      { property: "og:title", content: "Minesweep — A modern take on Minesweeper" },
      {
        property: "og:description",
        content:
          "Clean, fast, modern Minesweeper with stats, difficulties and auto-save.",
      },
    ],
  }),
  component: GamePage,
});

const RULES = [
  {
    icon: MousePointerClick,
    title: "Reveal cells",
    body: "Left-click any hidden cell to reveal it. Your first click is always safe.",
  },
  {
    icon: Hash,
    title: "Read the numbers",
    body: "A number shows how many mines touch that cell. Use them to deduce safe spots.",
  },
  {
    icon: Flag,
    title: "Flag the mines",
    body: "Right-click (or long-press on touch) a cell you suspect to mark it with a flag.",
  },
  {
    icon: Trophy,
    title: "Win the round",
    body: "Reveal every non-mine cell to win. Hit a mine and it's game over.",
  },
];

function GamePage() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>("beginner");
  const { state, reveal, flag, chord, reset } = useGame(difficulty);

  function handlePick(d: DifficultyKey) {
    setDifficulty(d);
    reset(d);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 40rem at 10% -10%, color-mix(in oklab, var(--color-primary) 15%, transparent), transparent 60%), radial-gradient(50rem 35rem at 110% 10%, color-mix(in oklab, var(--color-chart-2) 12%, transparent), transparent 60%)",
        }}
      />

      <NavBar />

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center gap-6 px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="size-3" />
            Modern Minesweeper · 2026
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Sweep with <span className="text-primary">style</span>.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Click to reveal · Right-click to flag · Click a number to chord
          </p>
        </div>

        <DifficultyPicker current={state.difficulty} onChange={handlePick} />

        <HUD state={state} onReset={() => reset(state.difficulty)} />

        <div className="relative max-w-full overflow-x-auto">
          <Board state={state} onReveal={reveal} onFlag={flag} onChord={chord} />

          {(state.status === "won" || state.status === "lost") && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-lg animate-in fade-in duration-300">
              <div className="text-center p-6 rounded-xl bg-card border border-border shadow-2xl">
                <h2 className="font-display text-2xl font-bold mb-2">
                  {state.status === "won" ? "🎉 You won!" : "💥 Boom!"}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {state.status === "won"
                    ? `Cleared in ${Math.round(((state.endedAt ?? 0) - (state.startedAt ?? 0)) / 1000)}s`
                    : "Better luck next time."}
                </p>
                <Button onClick={() => reset(state.difficulty)}>Play again</Button>
              </div>
            </div>
          )}
        </div>

        {/* How to play */}
        <section className="w-full mt-8 sm:mt-12">
          <div className="flex items-end justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                How to play
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Four simple rules. Endless replayability.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {RULES.map((r, i) => (
              <div
                key={r.title}
                className="group relative p-5 rounded-2xl bg-card/70 backdrop-blur border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="size-10 grid place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <r.icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base mb-1">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        Your game auto-saves locally — refresh anytime.
      </footer>
    </div>
  );
}
