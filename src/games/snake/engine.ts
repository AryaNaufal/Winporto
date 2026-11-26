/** Snake rules, with no UI or DOM dependency. */
export const COLS = 20;
export const ROWS = 20;

export type Dir = 'up' | 'down' | 'left' | 'right';
export type Cell = [x: number, y: number];

const DELTA: Record<Dir, Cell> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const FOOD_SCORE = 10;

export class Snake {
  /** Head first. */
  body: Cell[];
  dir: Dir = 'right';
  food: Cell = [0, 0];
  score = 0;
  over = false;
  won = false;
  private queue: Dir[] = [];

  constructor(private rng: () => number = Math.random) {
    const y = Math.floor(ROWS / 2);
    this.body = [[5, y], [4, y], [3, y]];
    this.placeFood();
  }

  /** Milliseconds per step: speeds up every 5 foods, never below 70ms. */
  get interval(): number {
    return Math.max(70, 140 - Math.floor(this.score / (FOOD_SCORE * 5)) * 10);
  }

  /** Queue a turn. Reversing into yourself and repeats are ignored; two quick turns are buffered. */
  turn(d: Dir) {
    const last = this.queue.length ? this.queue[this.queue.length - 1] : this.dir;
    if (d === last || d === OPPOSITE[last] || this.queue.length >= 2) return;
    this.queue.push(d);
  }

  private placeFood() {
    const taken = new Set(this.body.map(([x, y]) => `${x},${y}`));
    const free: Cell[] = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (!taken.has(`${x},${y}`)) free.push([x, y]);
    if (!free.length) {
      this.won = true;
      this.over = true;
      return;
    }
    this.food = free[Math.floor(this.rng() * free.length)];
  }

  step() {
    if (this.over) return;
    if (this.queue.length) this.dir = this.queue.shift()!;

    const [dx, dy] = DELTA[this.dir];
    const head: Cell = [this.body[0][0] + dx, this.body[0][1] + dy];
    const eats = head[0] === this.food[0] && head[1] === this.food[1];

    // The tail cell is free to enter unless we are growing this step.
    const solid = eats ? this.body : this.body.slice(0, -1);
    const hitWall = head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS;
    if (hitWall || solid.some(([x, y]) => x === head[0] && y === head[1])) {
      this.over = true;
      return;
    }

    this.body.unshift(head);
    if (eats) {
      this.score += FOOD_SCORE;
      this.placeFood();
    } else {
      this.body.pop();
    }
  }
}
