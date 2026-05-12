# Minesweep — A modern take on Minesweeper

A clean, fast, modern Minesweeper for the web. Built with React, TanStack Start, and Tailwind CSS.

## What it is

Most online Minesweeper sites still look like Windows 95. **Minesweep** is a 2026-era rebuild: minimal UI, dark mode by default, smooth interactions, fully responsive board, and quality-of-life features the original never had.

## Who it's for

Casual puzzle players who want a polished, distraction-free Minesweeper they can pick up on any device — and people who want their progress and stats remembered without signing up for anything.

## Why it's valuable

- **First-click safety** — the first cell you click is never a mine.
- **Auto-resume** — refresh or close the tab; your in-progress game comes back.
- **Persistent stats** — best times per difficulty, win rate, current and best streaks, last 20 games.
- **Three difficulties** — Beginner (9×9, 10), Intermediate (16×16, 40), Expert (16×30, 99).
- **Chord reveal** — click a satisfied number to open all its non-flagged neighbors.
- **Light & dark themes** that both actually look good.
- **Responsive** — the board scales to fit any screen, from phones to ultrawides.
- **No accounts, no servers** — everything lives in your browser's LocalStorage.

## Tech

- **React 19** + **TanStack Start** (file-based routing, SSR-ready)
- **Tailwind CSS v4** with semantic design tokens
- Pure-function game logic in `src/lib/minesweeper.ts`
- `useReducer` for game state, `useEffect` for LocalStorage persistence
- No backend

## Project structure

```
src/
  routes/         # / (game), /stats, /about
  components/     # Board, Cell, HUD, DifficultyPicker, NavBar, ThemeToggle
  hooks/useGame.ts
  lib/
    minesweeper.ts  # board generation, reveal, flood-fill, chord, win detection
    storage.ts      # LocalStorage: game, stats, theme
```

## Run locally

```
bun install
bun dev
```

## Controls

- **Left-click** — reveal a cell (or chord if it's a revealed number)
- **Right-click** — toggle a flag
- Reveal every non-mine cell to win.
