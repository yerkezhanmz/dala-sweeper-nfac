import type { GameState, DifficultyKey } from "./minesweeper";

const GAME_KEY = "ms:game:v1";
const STATS_KEY = "ms:stats:v1";
const THEME_KEY = "ms:theme:v1";

export interface GameStats {
  bestTimes: Partial<Record<DifficultyKey, number>>;
  played: number;
  won: number;
  currentStreak: number;
  bestStreak: number;
  recent: { difficulty: DifficultyKey; won: boolean; time: number; at: number }[];
}

const defaultStats: GameStats = {
  bestTimes: {},
  played: 0,
  won: 0,
  currentStreak: 0,
  bestStreak: 0,
  recent: [],
};

function safeWindow(): Window | null {
  if (typeof window === "undefined") return null;
  return window;
}

export function loadGame(): GameState | null {
  const w = safeWindow();
  if (!w) return null;
  try {
    const raw = w.localStorage.getItem(GAME_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState | null) {
  const w = safeWindow();
  if (!w) return;
  try {
    if (state === null) w.localStorage.removeItem(GAME_KEY);
    else w.localStorage.setItem(GAME_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function loadStats(): GameStats {
  const w = safeWindow();
  if (!w) return defaultStats;
  try {
    const raw = w.localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats: GameStats) {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function recordResult(
  difficulty: DifficultyKey,
  won: boolean,
  timeMs: number,
): GameStats {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.won++;
    stats.currentStreak++;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
    const prev = stats.bestTimes[difficulty];
    if (prev === undefined || timeMs < prev) {
      stats.bestTimes[difficulty] = timeMs;
    }
  } else {
    stats.currentStreak = 0;
  }
  stats.recent = [
    { difficulty, won, time: timeMs, at: Date.now() },
    ...stats.recent,
  ].slice(0, 20);
  saveStats(stats);
  return stats;
}

export function loadTheme(): "light" | "dark" {
  const w = safeWindow();
  if (!w) return "dark";
  try {
    const raw = w.localStorage.getItem(THEME_KEY);
    if (raw === "light" || raw === "dark") return raw;
    return w.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "dark";
  }
}

export function saveTheme(t: "light" | "dark") {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(THEME_KEY, t);
  } catch {
    // ignore
  }
}
