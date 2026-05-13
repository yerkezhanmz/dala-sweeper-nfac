import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { loadStats, type GameStats } from "@/lib/storage";
import { DIFFICULTIES, type DifficultyKey } from "@/lib/minesweeper";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Stats — Minesweep" },
      {
        name: "description",
        content: "Your personal Minesweeper stats: best times, win rate, streaks.",
      },
      { property: "og:title", content: "Stats — Minesweep" },
      {
        property: "og:description",
        content: "Best times, win rate, streaks across all difficulties.",
      },
    ],
  }),
  component: StatsPage,
});

function fmt(ms: number) {
  const s = ms / 1000;
  return `${s.toFixed(1)}s`;
}

function StatsPage() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const { t, lang } = useI18n();

  const localeMap: Record<string, string> = { en: "en-US", ru: "ru-RU", kk: "kk-KZ" };
  const locale = localeMap[lang] ?? "en-US";

  function fmtDate(ts: number) {
    const d = new Date(ts);
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    const time = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    if (sameDay) return `${t("date.today")}, ${time}`;
    const date = d.toLocaleDateString(locale, { month: "short", day: "numeric" });
    return `${date}, ${time}`;
  }

  useEffect(() => {
    setStats(loadStats());
    const refresh = () => setStats(loadStats());
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!stats) return null;

  const winRate = stats.played === 0 ? 0 : Math.round((stats.won / stats.played) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <NavBar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("stats.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("stats.sub")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t("stats.played"), value: stats.played },
            { label: t("stats.won"), value: stats.won },
            { label: t("stats.winrate"), value: `${winRate}%` },
            { label: t("stats.bestStreak"), value: stats.bestStreak },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-lg bg-card border border-border">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold mt-1 tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">{t("stats.bestTimes")}</h2>
          <div className="rounded-lg bg-card border border-border divide-y divide-border">
            {Object.keys(DIFFICULTIES).map((d) => {
              const tb = stats.bestTimes[d as DifficultyKey];
              return (
                <div key={d} className="flex items-center justify-between px-4 py-3">
                  <span>{t(`diff.${d}`)}</span>
                  <span className="font-mono text-sm">
                    {tb === undefined ? "—" : fmt(tb)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">{t("stats.recent")}</h2>
          <div className="rounded-lg bg-card border border-border">
            {stats.recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {t("stats.empty")}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {stats.recent.map((r, i) => (
                  <div key={i} className="grid grid-cols-4 items-center gap-2 px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">{t(`diff.${r.difficulty}`)}</span>
                    <span className={r.won ? "text-emerald-500" : "text-rose-500"}>
                      {r.won ? t("stats.cell.won") : t("stats.cell.lost")}
                    </span>
                    <span className="font-mono tabular-nums">{fmt(r.time)}</span>
                    <span className="text-xs text-muted-foreground text-right tabular-nums">
                      {fmtDate(r.at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
