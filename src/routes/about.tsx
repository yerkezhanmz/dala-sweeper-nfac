import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Minesweep" },
      {
        name: "description",
        content:
          "About Minesweep — a modern, minimal Minesweeper for the web with smart QoL features.",
      },
      { property: "og:title", content: "About — Minesweep" },
      {
        property: "og:description",
        content: "Why we built a modern Minesweeper and what makes it different.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <NavBar />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">About Minesweep</h1>
        <p className="text-muted-foreground leading-relaxed">
          Minesweep is a modern take on the classic Minesweeper. Most online versions
          look like Windows 95 — we wanted one that feels at home on a 2026 browser:
          clean typography, smooth interactions, dark mode by default, and a fully
          responsive board that scales to your screen.
        </p>

        <div>
          <h2 className="text-lg font-semibold mb-2">What's different</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>First click is always safe — no more instant-loss openings.</li>
            <li>Auto-save: refresh anytime, your in-progress game is restored.</li>
            <li>Per-difficulty best times, win rate, and streak tracking.</li>
            <li>Chord reveal: click a satisfied number to open its neighbors.</li>
            <li>Light & dark themes that actually look good in both modes.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">How to play</h2>
          <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            <li>Left-click a hidden cell to reveal it.</li>
            <li>Right-click to flag a suspected mine.</li>
            <li>Numbers show how many mines touch that cell.</li>
            <li>Reveal every non-mine cell to win.</li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          All progress lives in your browser's local storage. Nothing is sent to a server.
        </p>
      </main>
    </div>
  );
}
