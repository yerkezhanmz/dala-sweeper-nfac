import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

function GamePage() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>("beginner");
  const { state, reveal, flag, chord, reset } = useGame(difficulty);

  function handlePick(d: DifficultyKey) {
    setDifficulty(d);
    reset(d);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <NavBar />

      <main className="flex-1 flex flex-col items-center gap-6 px-4 py-8">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Minesweep
          </h1>
          <p className="text-sm text-muted-foreground">
            Click to reveal · Right-click to flag · Click a number to chord
          </p>
        </div>

        <DifficultyPicker current={state.difficulty} onChange={handlePick} />

        <HUD state={state} onReset={() => reset(state.difficulty)} />

        <div className="relative">
          <Board state={state} onReveal={reveal} onFlag={flag} onChord={chord} />

          {(state.status === "won" || state.status === "lost") && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-lg animate-in fade-in duration-300">
              <div className="text-center p-6 rounded-xl bg-card border border-border shadow-2xl">
                <h2 className="text-2xl font-bold mb-2">
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
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground">
        Your game auto-saves locally — refresh anytime.
      </footer>
    </div>
  );
}
