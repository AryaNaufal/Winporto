/**
 * Tetris rules, with no UI or DOM dependency (easy to test and reuse).
 * Board cells hold 0 (empty) or a piece id 1..7.
 */
export const COLS = 10;
export const ROWS = 20;

/** Piece colours (Win98-ish palette) indexed by piece id (index 0 unused). */
export const COLORS = ['', '#00c0c0', '#e0c000', '#a000a0', '#00a000', '#c00000', '#0000c0', '#e08000'];

// Base shapes in piece order: I, O, T, S, Z, J, L (ids 1..7).
const BASE: number[][][] = [
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
];

function rotateCW(m: number[][]): number[][] {
  const n = m.length;
  const r = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) r[x][n - 1 - y] = m[y][x];
  return r;
}

/** SHAPES[type][rotation] -> square matrix. */
export const SHAPES: number[][][][] = BASE.map((m) => {
  const rots = [m];
  for (let i = 0; i < 3; i++) rots.push(rotateCW(rots[i]));
  return rots;
});

export interface Piece {
  type: number; // index into SHAPES (0..6); board id is type + 1
  rot: number;
  x: number;
  y: number;
}

export type Cell = [x: number, y: number];

export function pieceCells(p: Piece): Cell[] {
  const m = SHAPES[p.type][p.rot];
  const out: Cell[] = [];
  for (let y = 0; y < m.length; y++) for (let x = 0; x < m.length; x++) if (m[y][x]) out.push([p.x + x, p.y + y]);
  return out;
}

const LINE_SCORES = [0, 100, 300, 500, 800];
const KICKS = [0, -1, 1, -2, 2]; // simple horizontal wall kicks

export class Tetris {
  board: number[][] = Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
  piece!: Piece;
  next: number;
  score = 0;
  lines = 0;
  level = 1;
  over = false;
  private bag: number[] = [];

  constructor(private rng: () => number = Math.random) {
    this.next = this.draw();
    this.spawn();
  }

  /** Milliseconds per gravity step at the current level. */
  get interval(): number {
    return Math.max(60, 800 * Math.pow(0.85, this.level - 1));
  }

  /** 7-bag randomiser: every piece appears once per bag. */
  private draw(): number {
    if (this.bag.length === 0) {
      this.bag = [0, 1, 2, 3, 4, 5, 6];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.pop()!;
  }

  private spawn() {
    const type = this.next;
    this.next = this.draw();
    const n = SHAPES[type][0].length;
    this.piece = { type, rot: 0, x: Math.floor((COLS - n) / 2), y: type === 0 ? -1 : 0 };
    if (this.collides(this.piece)) this.over = true;
  }

  collides(p: Piece): boolean {
    for (const [x, y] of pieceCells(p)) {
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && this.board[y][x]) return true;
    }
    return false;
  }

  move(dx: number): boolean {
    if (this.over) return false;
    const p = { ...this.piece, x: this.piece.x + dx };
    if (this.collides(p)) return false;
    this.piece = p;
    return true;
  }

  rotate(dir: 1 | -1): boolean {
    if (this.over) return false;
    const rot = (this.piece.rot + dir + 4) % 4;
    for (const k of KICKS) {
      const p = { ...this.piece, rot, x: this.piece.x + k };
      if (!this.collides(p)) {
        this.piece = p;
        return true;
      }
    }
    return false;
  }

  /** One automatic step down; locks the piece when it cannot move. */
  gravity() {
    if (this.over) return;
    const p = { ...this.piece, y: this.piece.y + 1 };
    if (this.collides(p)) this.lock();
    else this.piece = p;
  }

  /** Player-controlled step down (+1 point per cell). */
  softDrop(): boolean {
    if (this.over) return false;
    const p = { ...this.piece, y: this.piece.y + 1 };
    if (this.collides(p)) {
      this.lock();
      return false;
    }
    this.piece = p;
    this.score += 1;
    return true;
  }

  /** Row where the current piece would land. */
  ghostY(): number {
    let y = this.piece.y;
    while (!this.collides({ ...this.piece, y: y + 1 })) y++;
    return y;
  }

  hardDrop() {
    if (this.over) return;
    const y = this.ghostY();
    this.score += 2 * (y - this.piece.y);
    this.piece = { ...this.piece, y };
    this.lock();
  }

  private lock() {
    for (const [x, y] of pieceCells(this.piece)) {
      if (y < 0) {
        this.over = true; // locked above the visible board
        return;
      }
      this.board[y][x] = this.piece.type + 1;
    }
    this.clearLines();
    this.spawn();
  }

  private clearLines() {
    const kept = this.board.filter((row) => row.some((c) => c === 0));
    const cleared = ROWS - kept.length;
    if (!cleared) return;
    while (kept.length < ROWS) kept.unshift(Array<number>(COLS).fill(0));
    this.board = kept;
    this.score += LINE_SCORES[cleared] * this.level;
    this.lines += cleared;
    this.level = 1 + Math.floor(this.lines / 10);
  }
}
