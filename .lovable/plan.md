# Modern Minesweeper Platform

A polished take on Minesweeper that stands out via design, smooth UX, and quality-of-life features — not just another clone.

## What we'll build

A single-page React app (TanStack Start, already set up) with:

1. **Game board** — classic Minesweeper logic
   - Mine generation with first-click safety (first click never hits a mine)
   - Flood-fill reveal for empty cells
   - Number display (1–8) for adjacent mines, color-coded
   - Right-click / long-press to flag, middle-click chord to reveal neighbors
   - Win/loss detection with end-game overlay

2. **Difficulty levels**
   - Beginner: 9×9, 10 mines
   - Intermediate: 16×16, 40 mines
   - Expert: 16×30, 99 mines
   - Custom: user-defined width/height/mines

3. **HUD**
   - Mine counter (mines − flags placed)
   - Timer (starts on first click, stops on game end)
   - Reset button with face-state (smile / surprise / dead / win)
   - Difficulty selector

4. **Persistence (LocalStorage)**
   - Current in-progress game (board, flags, timer, difficulty) — auto-resume on refresh
   - Best times per difficulty
   - Stats: games played, won, win rate, current streak
   - Theme preference

5. **Design (what makes it stand out)**
   - Modern minimal aesthetic, not the Win95 look
   - Light/dark mode toggle
   - Smooth cell-reveal animation (cascading flood-fill)
   - Subtle haptic-feel hover/press states
   - Accessible color palette for numbers (works in both themes)
   - Responsive: works on desktop and touch devices
   - Keyboard support (arrow keys + space/F)

6. **Stats page** — best times, recent games, win rate per difficulty

## Routes

- `/` — game (home)
- `/stats` — personal stats and best times
- `/about` — short about page

## Technical notes

- Pure frontend, no backend needed → no Lovable Cloud
- Game logic in `src/lib/minesweeper.ts` (board generation, reveal, flood-fill, win check)
- React state via `useReducer` for the game; `useEffect` syncs to LocalStorage (debounced)
- Tailwind v4 + design tokens in `src/styles.css`
- File structure:
  - `src/routes/index.tsx` — game page
  - `src/routes/stats.tsx`, `src/routes/about.tsx`
  - `src/components/Board.tsx`, `Cell.tsx`, `HUD.tsx`, `DifficultyPicker.tsx`, `EndGameOverlay.tsx`, `ThemeToggle.tsx`
  - `src/lib/minesweeper.ts` — pure game logic
  - `src/lib/storage.ts` — LocalStorage helpers
  - `src/hooks/useGame.ts` — reducer + persistence

## Deliverables

- Working preview URL (already provided by Lovable)
- GitHub repo (you connect via the GitHub button in the Lovable UI)
- README.md describing the product, audience (casual puzzle players who want a clean, modern Minesweeper with stats and resume), and value (polished UX + persistence + multiple difficulties in one lightweight site)

## Open question

Design direction — do you want me to generate 2–3 visual concepts to choose from (recommended), or pick one cohesive modern style and run with it?
