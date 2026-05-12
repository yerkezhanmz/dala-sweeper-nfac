export type CellState = "hidden" | "revealed" | "flagged";

export interface Cell {
  mine: boolean;
  adjacent: number;
  state: CellState;
}

export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTIES: Record<string, DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export type DifficultyKey = keyof typeof DIFFICULTIES | "custom";

export interface GameState {
  board: Cell[][];
  rows: number;
  cols: number;
  mines: number;
  status: GameStatus;
  flagsPlaced: number;
  startedAt: number | null;
  endedAt: number | null;
  difficulty: DifficultyKey;
  minesPlaced: boolean;
  explodedAt: { r: number; c: number } | null;
}

export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      adjacent: 0,
      state: "hidden" as CellState,
    })),
  );
}

export function createGame(
  difficulty: DifficultyKey,
  config?: DifficultyConfig,
): GameState {
  const cfg =
    difficulty === "custom" && config ? config : DIFFICULTIES[difficulty as string];
  return {
    board: createEmptyBoard(cfg.rows, cfg.cols),
    rows: cfg.rows,
    cols: cfg.cols,
    mines: cfg.mines,
    status: "idle",
    flagsPlaced: 0,
    startedAt: null,
    endedAt: null,
    difficulty,
    minesPlaced: false,
    explodedAt: null,
  };
}

const NEIGHBORS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function placeMines(
  board: Cell[][],
  rows: number,
  cols: number,
  mineCount: number,
  safeR: number,
  safeC: number,
): Cell[][] {
  const newBoard = board.map((row) => row.map((c) => ({ ...c })));
  const forbidden = new Set<number>();
  for (const [dr, dc] of [[0, 0], ...NEIGHBORS]) {
    const r = safeR + dr;
    const c = safeC + dc;
    if (r >= 0 && r < rows && c >= 0 && c < cols) forbidden.add(r * cols + c);
  }
  const positions: number[] = [];
  for (let i = 0; i < rows * cols; i++) {
    if (!forbidden.has(i)) positions.push(i);
  }
  // Fisher-Yates partial
  for (let i = 0; i < mineCount && i < positions.length; i++) {
    const j = i + Math.floor(Math.random() * (positions.length - i));
    [positions[i], positions[j]] = [positions[j], positions[i]];
    const idx = positions[i];
    newBoard[Math.floor(idx / cols)][idx % cols].mine = true;
  }
  // adjacency
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].mine) continue;
      let count = 0;
      for (const [dr, dc] of NEIGHBORS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].mine) {
          count++;
        }
      }
      newBoard[r][c].adjacent = count;
    }
  }
  return newBoard;
}

function floodReveal(board: Cell[][], rows: number, cols: number, r: number, c: number) {
  const stack = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const cell = board[cr][cc];
    if (cell.state !== "hidden") continue;
    cell.state = "revealed";
    if (cell.adjacent === 0 && !cell.mine) {
      for (const [dr, dc] of NEIGHBORS) {
        const nr = cr + dr;
        const nc = cc + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].state === "hidden") {
          stack.push([nr, nc]);
        }
      }
    }
  }
}

function checkWin(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.mine && cell.state !== "revealed") return false;
    }
  }
  return true;
}

export function revealCell(state: GameState, r: number, c: number): GameState {
  if (state.status === "won" || state.status === "lost") return state;
  const cell = state.board[r][c];
  if (cell.state === "revealed" || cell.state === "flagged") return state;

  let board = state.board.map((row) => row.map((c) => ({ ...c })));
  let minesPlaced = state.minesPlaced;
  let startedAt = state.startedAt;

  if (!minesPlaced) {
    board = placeMines(board, state.rows, state.cols, state.mines, r, c);
    minesPlaced = true;
    startedAt = Date.now();
  }

  const target = board[r][c];
  if (target.mine) {
    // reveal all mines
    for (const row of board) {
      for (const cc of row) {
        if (cc.mine) cc.state = "revealed";
      }
    }
    return {
      ...state,
      board,
      minesPlaced,
      startedAt,
      status: "lost",
      endedAt: Date.now(),
      explodedAt: { r, c },
    };
  }

  floodReveal(board, state.rows, state.cols, r, c);

  const won = checkWin(board);
  if (won) {
    // auto-flag remaining mines
    let flags = state.flagsPlaced;
    for (const row of board) {
      for (const cc of row) {
        if (cc.mine && cc.state !== "flagged") {
          cc.state = "flagged";
          flags++;
        }
      }
    }
    return {
      ...state,
      board,
      minesPlaced,
      startedAt,
      flagsPlaced: flags,
      status: "won",
      endedAt: Date.now(),
    };
  }

  return {
    ...state,
    board,
    minesPlaced,
    startedAt,
    status: "playing",
  };
}

export function toggleFlag(state: GameState, r: number, c: number): GameState {
  if (state.status === "won" || state.status === "lost") return state;
  const cell = state.board[r][c];
  if (cell.state === "revealed") return state;
  const board = state.board.map((row) => row.map((c) => ({ ...c })));
  const target = board[r][c];
  let flags = state.flagsPlaced;
  if (target.state === "flagged") {
    target.state = "hidden";
    flags--;
  } else {
    target.state = "flagged";
    flags++;
  }
  return {
    ...state,
    board,
    flagsPlaced: flags,
    status: state.status === "idle" ? "idle" : "playing",
  };
}

export function chordReveal(state: GameState, r: number, c: number): GameState {
  if (state.status !== "playing") return state;
  const cell = state.board[r][c];
  if (cell.state !== "revealed" || cell.adjacent === 0) return state;
  let flagCount = 0;
  const toReveal: [number, number][] = [];
  for (const [dr, dc] of NEIGHBORS) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= state.rows || nc < 0 || nc >= state.cols) continue;
    const n = state.board[nr][nc];
    if (n.state === "flagged") flagCount++;
    else if (n.state === "hidden") toReveal.push([nr, nc]);
  }
  if (flagCount !== cell.adjacent) return state;
  let next = state;
  for (const [nr, nc] of toReveal) {
    next = revealCell(next, nr, nc);
    if (next.status === "lost") return next;
  }
  return next;
}
