/** Tetris: canvas rendering + input. Game rules live in games/tetris/engine.ts. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { COLORS, COLS, ROWS, SHAPES, Tetris, pieceCells } from '../../games/tetris/engine';
import { getBest, submitScore } from '../../games/scores';
import { useFitBoard } from '../../games/useFitBoard';
import { $activeId } from '../../stores/windowStore';

const GAME_ID = 'tetris';
type Status = 'ready' | 'playing' | 'paused' | 'over';

/** One Win98-style beveled block. */
function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, id: number, ghost = false) {
  if (ghost) {
    ctx.strokeStyle = COLORS[id];
    ctx.lineWidth = 2;
    ctx.strokeRect(x * s + 2, y * s + 2, s - 4, s - 4);
    return;
  }
  const px = x * s;
  const py = y * s;
  ctx.fillStyle = COLORS[id];
  ctx.fillRect(px, py, s, s);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(px, py, s, 2);
  ctx.fillRect(px, py, 2, s);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(px, py + s - 2, s, 2);
  ctx.fillRect(px + s - 2, py, 2, s);
}

const CELL = 24; // logical pixels per cell; CSS scales the canvas in whole steps

export default function TetrisWindow() {
  const active = useStore($activeId) === 'tetris';
  const boardRef = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLCanvasElement>(null);
  const { wrapRef, box } = useFitBoard(COLS, ROWS);

  const game = useRef(new Tetris());
  const statusRef = useRef<Status>('ready');
  const activeRef = useRef(active);
  const acc = useRef(0);
  activeRef.current = active;

  const [status, setStatusState] = useState<Status>('ready');
  const [hud, setHud] = useState({ score: 0, lines: 0, level: 1, best: 0 });

  const setStatus = useCallback((s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  const syncHud = useCallback(() => {
    const g = game.current;
    setHud((h) => (h.score === g.score && h.lines === g.lines && h.level === g.level ? h : { ...h, score: g.score, lines: g.lines, level: g.level }));
  }, []);

  const finish = useCallback(() => {
    const best = submitScore(GAME_ID, game.current.score);
    setHud((h) => ({ ...h, best }));
    setStatus('over');
  }, [setStatus]);

  const newGame = useCallback(() => {
    game.current = new Tetris();
    acc.current = 0;
    setHud((h) => ({ ...h, score: 0, lines: 0, level: 1 }));
    setStatus('playing');
  }, [setStatus]);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'playing') setStatus('paused');
    else if (statusRef.current === 'paused') setStatus('playing');
  }, [setStatus]);

  /** Apply a player action; shared by keyboard and on-screen buttons. */
  const act = useCallback((action: 'left' | 'right' | 'down' | 'rotate' | 'rotateBack' | 'drop') => {
    if (statusRef.current !== 'playing') return;
    const g = game.current;
    if (action === 'left') g.move(-1);
    else if (action === 'right') g.move(1);
    else if (action === 'down') g.softDrop();
    else if (action === 'rotate') g.rotate(1);
    else if (action === 'rotateBack') g.rotate(-1);
    else g.hardDrop();
    if (g.over) finish();
    syncHud();
  }, [finish, syncHud]);

  useEffect(() => setHud((h) => ({ ...h, best: getBest(GAME_ID) })), []);

  // Pause automatically when the window loses focus or is minimized.
  useEffect(() => {
    if (!active && statusRef.current === 'playing') setStatus('paused');
  }, [active, setStatus]);

  // Keyboard. Capture phase so Escape can pause before the window's own Esc-to-close runs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeRef.current || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) return;

      const s = statusRef.current;
      const handled = (fn: () => void, allowRepeat = true) => {
        e.preventDefault();
        if (allowRepeat || !e.repeat) fn();
      };
      switch (e.key) {
        case 'ArrowLeft': return handled(() => act('left'));
        case 'ArrowRight': return handled(() => act('right'));
        case 'ArrowDown': return handled(() => act('down'));
        case 'ArrowUp':
        case 'x':
        case 'X': return handled(() => act('rotate'), false);
        case 'z':
        case 'Z': return handled(() => act('rotateBack'), false);
        case ' ': return handled(() => act('drop'), false);
        case 'p':
        case 'P':
        case 'Escape':
          if (s === 'playing' || s === 'paused') return handled(togglePause, false);
          return;
        case 'Enter':
          if (s === 'ready' || s === 'over') return handled(newGame, false);
          if (s === 'paused') return handled(togglePause, false);
          return;
      }
    };
    // Stop Space from also "clicking" a focused button on key release during play.
    const onKeyUp = (e: KeyboardEvent) => {
      if (activeRef.current && e.key === ' ' && statusRef.current === 'playing') e.preventDefault();
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('keyup', onKeyUp, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('keyup', onKeyUp, true);
    };
  }, [act, newGame, togglePause]);

  // Game loop: gravity + drawing.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      const g = game.current;
      const ctx = boardRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
        ctx.fillStyle = '#1a1a1a';
        for (let x = 1; x < COLS; x++) ctx.fillRect(x * CELL, 0, 1, ROWS * CELL);
        for (let y = 1; y < ROWS; y++) ctx.fillRect(0, y * CELL, COLS * CELL, 1);

        g.board.forEach((row, y) => row.forEach((id, x) => id && drawCell(ctx, x, y, CELL, id)));
        if (!g.over) {
          const id = g.piece.type + 1;
          for (const [x, y] of pieceCells({ ...g.piece, y: g.ghostY() })) if (y >= 0) drawCell(ctx, x, y, CELL, id, true);
          for (const [x, y] of pieceCells(g.piece)) if (y >= 0) drawCell(ctx, x, y, CELL, id);
        }

        const s = statusRef.current;
        if (s !== 'playing') {
          ctx.fillStyle = 'rgba(0,0,0,0.65)';
          ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.font = 'bold 22px Tahoma, "MS Sans Serif", sans-serif';
          const title = s === 'paused' ? 'PAUSED' : s === 'over' ? 'GAME OVER' : 'TETRIS';
          ctx.fillText(title, (COLS * CELL) / 2, (ROWS * CELL) / 2 - 8);
          ctx.font = '14px Tahoma, "MS Sans Serif", sans-serif';
          ctx.fillText(s === 'paused' ? 'Press P to resume' : 'Press Enter to play', (COLS * CELL) / 2, (ROWS * CELL) / 2 + 16);
        }
      }

      const nctx = nextRef.current?.getContext('2d');
      if (nctx) {
        const S = 20;
        nctx.fillStyle = '#000';
        nctx.fillRect(0, 0, 4 * S, 4 * S);
        // Centre the piece's filled cells inside the 4x4 preview.
        const cells: [number, number][] = [];
        SHAPES[g.next][0].forEach((row, y) => row.forEach((v, x) => v && cells.push([x, y])));
        const xs = cells.map(([x]) => x);
        const ys = cells.map(([, y]) => y);
        const ox = (4 - (Math.max(...xs) - Math.min(...xs) + 1)) / 2 - Math.min(...xs);
        const oy = (4 - (Math.max(...ys) - Math.min(...ys) + 1)) / 2 - Math.min(...ys);
        for (const [x, y] of cells) drawCell(nctx, x + ox, y + oy, S, g.next + 1);
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
          g.gravity();
        }
        if (g.over) finish();
        syncHud();
      }
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [finish, syncHud]);

  // Press-and-hold repeat for the on-screen arrows.
  const hold = useRef<number | null>(null);
  const stopHold = () => {
    if (hold.current !== null) window.clearInterval(hold.current);
    hold.current = null;
  };
  useEffect(() => stopHold, []);
  const holdProps = (action: 'left' | 'right' | 'down') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      act(action);
      stopHold();
      hold.current = window.setInterval(() => act(action), 110);
    },
    onPointerUp: stopHold,
    onPointerLeave: stopHold,
    onPointerCancel: stopHold,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') act(action);
    },
  });

  const label = status === 'ready' ? 'New Game' : status === 'over' ? 'Play Again' : 'Restart';

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex min-h-0 flex-1 gap-3">
        <div ref={wrapRef} className="field98 flex min-h-0 min-w-0 flex-1 items-center justify-center !bg-shadow !p-1">
          <canvas
            ref={boardRef}
            width={COLS * CELL}
            height={ROWS * CELL}
            role="img"
            aria-label={`Tetris board. Score ${hud.score}, level ${hud.level}, ${hud.lines} lines.`}
            style={{ width: box.w, height: box.h, imageRendering: 'pixelated' }}
          />
        </div>

        <div className="flex w-[7.5rem] shrink-0 flex-col gap-2">
          <dl className="field98 m-0 grid grid-cols-1 gap-1 !bg-paper !p-2">
            <div><dt className="text-muted">Score</dt><dd className="m-0 text-lg font-bold">{hud.score}</dd></div>
            <div><dt className="text-muted">Lines</dt><dd className="m-0 font-bold">{hud.lines}</dd></div>
            <div><dt className="text-muted">Level</dt><dd className="m-0 font-bold">{hud.level}</dd></div>
            <div><dt className="text-muted">Best</dt><dd className="m-0 font-bold">{hud.best}</dd></div>
          </dl>
          <div>
            <p className="m-0 mb-1">Next</p>
            <canvas ref={nextRef} width={80} height={80} aria-hidden="true" className="field98 !p-0" style={{ width: 80, height: 80, imageRendering: 'pixelated' }} />
          </div>
          <button type="button" className="btn98" onClick={(e) => { newGame(); e.currentTarget.blur(); }}>{label}</button>
          <button type="button" className="btn98" disabled={status !== 'playing' && status !== 'paused'} onClick={(e) => { togglePause(); e.currentTarget.blur(); }}>
            {status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <p role="status" className="m-0 text-muted">
            {status === 'over' ? `Game over. Score ${hud.score}.` : status === 'paused' ? 'Paused.' : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1" role="group" aria-label="Touch controls">
          <button type="button" className="btn98 icon" aria-label="Move left" {...holdProps('left')}>←</button>
          <button type="button" className="btn98 icon" aria-label="Rotate" onClick={() => act('rotate')}>↻</button>
          <button type="button" className="btn98 icon" aria-label="Move right" {...holdProps('right')}>→</button>
          <button type="button" className="btn98 icon" aria-label="Soft drop" {...holdProps('down')}>↓</button>
          <button type="button" className="btn98" aria-label="Hard drop" onClick={() => act('drop')}>Drop</button>
        </div>
        <p className="m-0 text-muted">← → move · ↑ rotate · ↓ soft drop · Space drop · P pause</p>
      </div>
    </div>
  );
}
