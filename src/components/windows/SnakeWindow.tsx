/** Snake: canvas rendering + input (keyboard, swipe, on-screen arrows). Rules in games/snake/engine.ts. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { COLS, ROWS, Snake, type Dir } from '../../games/snake/engine';
import { getBest, submitScore } from '../../games/scores';
import { useFitBoard } from '../../games/useFitBoard';
import { $activeId } from '../../stores/windowStore';

const GAME_ID = 'snake';
const CELL = 20; // logical pixels per cell; CSS scales the canvas in whole steps
type Status = 'ready' | 'playing' | 'paused' | 'over';

/** One beveled Win98-style block. */
function block(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const px = x * CELL;
  const py = y * CELL;
  ctx.fillStyle = color;
  ctx.fillRect(px, py, CELL, CELL);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(px, py, CELL, 2);
  ctx.fillRect(px, py, 2, CELL);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(px, py + CELL - 2, CELL, 2);
  ctx.fillRect(px + CELL - 2, py, 2, CELL);
}

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

export default function SnakeWindow() {
  const active = useStore($activeId) === 'snake';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { wrapRef, box } = useFitBoard(COLS, ROWS);

  const game = useRef(new Snake());
  const statusRef = useRef<Status>('ready');
  const activeRef = useRef(active);
  const acc = useRef(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  activeRef.current = active;

  const [status, setStatusState] = useState<Status>('ready');
  const [hud, setHud] = useState({ score: 0, length: 3, best: 0, won: false });

  const setStatus = useCallback((s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  const syncHud = useCallback(() => {
    const g = game.current;
    setHud((h) => (h.score === g.score && h.length === g.body.length ? h : { ...h, score: g.score, length: g.body.length }));
  }, []);

  const finish = useCallback(() => {
    const g = game.current;
    const best = submitScore(GAME_ID, g.score);
    setHud((h) => ({ ...h, score: g.score, length: g.body.length, best, won: g.won }));
    setStatus('over');
  }, [setStatus]);

  const newGame = useCallback(() => {
    game.current = new Snake();
    acc.current = 0;
    setHud((h) => ({ ...h, score: 0, length: 3, won: false }));
    setStatus('playing');
  }, [setStatus]);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'playing') setStatus('paused');
    else if (statusRef.current === 'paused') setStatus('playing');
  }, [setStatus]);

  const turn = useCallback((d: Dir) => {
    if (statusRef.current === 'playing') game.current.turn(d);
  }, []);

  useEffect(() => setHud((h) => ({ ...h, best: getBest(GAME_ID) })), []);

  // Pause automatically when the window loses focus or is minimized.
  useEffect(() => {
    if (!active && statusRef.current === 'playing') setStatus('paused');
  }, [active, setStatus]);

  // Keyboard. Capture phase so Escape pauses before the window's own Esc-to-close runs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeRef.current || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) return;
      const s = statusRef.current;

      const dir = KEY_DIRS[e.key];
      if (dir) {
        e.preventDefault();
        turn(dir);
        return;
      }
      if (e.repeat) return;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape' || e.key === ' ') {
        if (s === 'playing' || s === 'paused') {
          e.preventDefault();
          togglePause();
        } else if (e.key === ' ') {
          e.preventDefault();
          newGame();
        }
      } else if (e.key === 'Enter' && s !== 'playing') {
        e.preventDefault();
        if (s === 'paused') togglePause();
        else newGame();
      }
    };
    // Stop Space from also "clicking" a focused button on key release.
    const onKeyUp = (e: KeyboardEvent) => {
      if (activeRef.current && e.key === ' ') e.preventDefault();
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('keyup', onKeyUp, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('keyup', onKeyUp, true);
    };
  }, [newGame, togglePause, turn]);

  // Game loop: movement + drawing.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      const g = game.current;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      ctx.fillStyle = '#161616';
      for (let x = 1; x < COLS; x++) ctx.fillRect(x * CELL, 0, 1, ROWS * CELL);
      for (let y = 1; y < ROWS; y++) ctx.fillRect(0, y * CELL, COLS * CELL, 1);

      if (!g.won) block(ctx, g.food[0], g.food[1], '#c00000');
      g.body.forEach(([x, y], i) => block(ctx, x, y, i === 0 ? '#40e040' : '#00a000'));
      // Eyes on the head, placed by direction.
      const [hx, hy] = g.body[0];
      ctx.fillStyle = '#000';
      const horizontal = g.dir === 'left' || g.dir === 'right';
      const ex = hx * CELL + (g.dir === 'left' ? 4 : g.dir === 'right' ? 12 : 5);
      const ey = hy * CELL + (g.dir === 'up' ? 4 : g.dir === 'down' ? 12 : 5);
      ctx.fillRect(ex, ey, 3, 3);
      ctx.fillRect(horizontal ? ex : ex + 8, horizontal ? ey + 8 : ey, 3, 3);

      const s = statusRef.current;
      if (s !== 'playing') {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 24px Tahoma, "MS Sans Serif", sans-serif';
        const title = s === 'paused' ? 'PAUSED' : s === 'over' ? (g.won ? 'YOU WIN!' : 'GAME OVER') : 'SNAKE';
        ctx.fillText(title, (COLS * CELL) / 2, (ROWS * CELL) / 2 - 6);
        ctx.font = '14px Tahoma, "MS Sans Serif", sans-serif';
        ctx.fillText(s === 'paused' ? 'Press P to resume' : 'Press Enter to play', (COLS * CELL) / 2, (ROWS * CELL) / 2 + 20);
      }
    };

    const frame = (t: number) => {
      const dt = Math.min(t - last, 100);
      last = t;
      const g = game.current;
      if (statusRef.current === 'playing' && activeRef.current) {
        acc.current += dt;
        while (acc.current >= g.interval && !g.over) {
          acc.current -= g.interval;
          g.step();
        }
        if (g.over) finish();
        else syncHud();
      }
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish, syncHud]);

  // Swipe on the board.
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  };

  const label = status === 'ready' ? 'New Game' : status === 'over' ? 'Play Again' : 'Restart';

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex min-h-0 flex-1 gap-3">
        <div ref={wrapRef} className="field98 flex min-h-0 min-w-0 flex-1 items-center justify-center !bg-shadow !p-1">
          <canvas
            ref={canvasRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            role="img"
            aria-label={`Snake board. Score ${hud.score}, length ${hud.length}.`}
            className="touch-none"
            style={{ width: box.w, height: box.h, imageRendering: 'pixelated' }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          />
        </div>

        <div className="flex w-[7.5rem] shrink-0 flex-col gap-2">
          <dl className="field98 m-0 grid grid-cols-1 gap-1 !bg-paper !p-2">
            <div><dt className="text-muted">Score</dt><dd className="m-0 text-lg font-bold">{hud.score}</dd></div>
            <div><dt className="text-muted">Length</dt><dd className="m-0 font-bold">{hud.length}</dd></div>
            <div><dt className="text-muted">Best</dt><dd className="m-0 font-bold">{hud.best}</dd></div>
          </dl>
          <button type="button" className="btn98" onClick={(e) => { newGame(); e.currentTarget.blur(); }}>{label}</button>
          <button type="button" className="btn98" disabled={status !== 'playing' && status !== 'paused'} onClick={(e) => { togglePause(); e.currentTarget.blur(); }}>
            {status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <p role="status" className="m-0 text-muted">
            {status === 'over' ? (hud.won ? `You win! Score ${hud.score}.` : `Game over. Score ${hud.score}.`) : status === 'paused' ? 'Paused.' : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1" role="group" aria-label="Touch controls">
          <button type="button" className="btn98 icon" aria-label="Turn left" onClick={() => turn('left')}>←</button>
          <button type="button" className="btn98 icon" aria-label="Turn up" onClick={() => turn('up')}>↑</button>
          <button type="button" className="btn98 icon" aria-label="Turn down" onClick={() => turn('down')}>↓</button>
          <button type="button" className="btn98 icon" aria-label="Turn right" onClick={() => turn('right')}>→</button>
        </div>
        <p className="m-0 text-muted">Arrows / WASD · swipe · P pause</p>
      </div>
    </div>
  );
}
