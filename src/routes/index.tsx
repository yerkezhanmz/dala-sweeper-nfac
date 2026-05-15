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
import { useI18n } from "@/lib/i18n";
import heroBg from "@/assets/hero-bg.png";

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
  const { t } = useI18n();

  const RULES = [
    { icon: MousePointerClick, title: t("rule.reveal.t"), body: t("rule.reveal.b") },
    { icon: Hash, title: t("rule.numbers.t"), body: t("rule.numbers.b") },
    { icon: Flag, title: t("rule.flag.t"), body: t("rule.flag.b") },
    { icon: Trophy, title: t("rule.win.t"), body: t("rule.win.b") },
  ];

  function handlePick(d: DifficultyKey) {
    setDifficulty(d);
    reset(d);
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* ── Background Base Layer ── */}
      <div className="fixed inset-0 -z-20 bg-background" />

      {/* ── Hero background ─────────────────────────────────────────────────
          Covers NavBar → hero text → difficulty picker → HUD → Board.
          Fades completely to background color before the How-to-Play cards.
      ─────────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10"
        style={{ height: "min(140vh, 1200px)" }}
      >
        {/* 1. The image */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
            opacity: 0.9,
          }}
        />

        {/* 2. Darkening layer — lighter to ensure image is visible */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/45" />

        {/* 3. Subtle radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, transparent 20%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* 4. Tall gradient transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, var(--background) 95%)",
          }}
        />
      </div>

      <NavBar />

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center gap-6 px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-foreground text-white ring-1 ring-primary/20">
            <Sparkles className="size-3 text-primary text-white" />
            {t("home.badge")}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            {t("home.title.a")}
            <span className="text-primary text-white">{t("home.title.b")}</span>.
          </h1>
          <p className="text-sm sm:text-base text-foreground max-w-md font-medium text-white">
            {t("home.subtitle")}
          </p>
        </div>

        <DifficultyPicker current={state.difficulty} onChange={handlePick} />

        <HUD state={state} onReset={() => reset(state.difficulty)} />

        <div className="relative max-w-full">
          <Board state={state} onReveal={reveal} onFlag={flag} onChord={chord} />

          {(state.status === "won" || state.status === "lost") && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-lg animate-in fade-in duration-300">
              <div className="text-center p-6 rounded-xl bg-card border border-border shadow-2xl">
                <h2 className="font-display text-2xl font-bold mb-2">
                  {state.status === "won" ? t("result.won") : t("result.lost")}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {state.status === "won"
                    ? t("result.cleared", {
                      s: Math.round(((state.endedAt ?? 0) - (state.startedAt ?? 0)) / 1000),
                    })
                    : t("result.bad")}
                </p>
                <Button onClick={() => reset(state.difficulty)}>{t("result.again")}</Button>
              </div>
            </div>
          )}
        </div>

        <section className="w-full mt-8 sm:mt-12">
          <div className="flex items-end justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {t("home.howto")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{t("home.howto.sub")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {RULES.map((r, i) => (
              <div
                key={r.title}
                className="relative p-5 rounded-2xl bg-card/70 backdrop-blur border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="size-10 grid place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <r.icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base mb-1">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        {t("footer.autosave")}
      </footer>
    </div>
  );
}
