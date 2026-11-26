/** Small but functional Paint: pencil, eraser, brush, text, palette, save. */
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Glyph, { type GlyphName } from '../Glyph';
import MenuBar from '../MenuBar';

const W = 320; // logical canvas size; CSS scales it up so every pixel looks chunky
const H = 200;
const BG = '#ffffff';

type Tool = 'pencil' | 'eraser' | 'brush' | 'text';
const TOOLS: { id: Tool; label: string; glyph: GlyphName; size: number }[] = [
  { id: 'pencil', label: 'Pencil', glyph: 'pencil', size: 1 },
  { id: 'eraser', label: 'Eraser', glyph: 'eraser', size: 8 },
  { id: 'brush', label: 'Brush', glyph: 'brush', size: 4 },
  { id: 'text', label: 'Text', glyph: 'text', size: 0 },
];

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
];

export default function PaintWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState(COLORS[0]);
  const [textAt, setTextAt] = useState<{ x: number; y: number } | null>(null);

  // White background + the starter doodle (after fonts load so text renders right).
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    document.fonts.ready.then(() => {
      ctx.fillStyle = '#000080';
      ctx.font = "italic 700 38px 'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive";
      ctx.fillText('Hello! =)', 20, 60);
    });
  }, []);

  const ctx2d = () => canvasRef.current!.getContext('2d')!;

  /** Pointer position in logical canvas pixels. */
  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: Math.floor(((e.clientX - r.left) * W) / r.width), y: Math.floor(((e.clientY - r.top) * H) / r.height) };
  };

  const stamp = (x: number, y: number) => {
    const t = TOOLS.find((t) => t.id === tool)!;
    const ctx = ctx2d();
    ctx.fillStyle = tool === 'eraser' ? BG : color;
    ctx.fillRect(x - (t.size >> 1), y - (t.size >> 1), t.size, t.size);
  };

  /** Interpolated stamping keeps strokes continuous without anti-aliasing. */
  const strokeTo = (x: number, y: number) => {
    const from = last.current ?? { x, y };
    const steps = Math.max(Math.abs(x - from.x), Math.abs(y - from.y), 1);
    for (let i = 0; i <= steps; i++) {
      stamp(Math.round(from.x + ((x - from.x) * i) / steps), Math.round(from.y + ((y - from.y) * i) / steps));
    }
    last.current = { x, y };
  };

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const p = point(e);
    if (tool === 'text') {
      setTextAt(p);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = null;
    strokeTo(p.x, p.y);
  };
  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!last.current) return;
    const p = point(e);
    strokeTo(p.x, p.y);
  };
  const onUp = () => {
    last.current = null;
  };

  useEffect(() => {
    if (textAt) textRef.current?.focus();
  }, [textAt]);

  const commitText = () => {
    const value = textRef.current?.value.trim();
    if (value && textAt) {
      const ctx = ctx2d();
      ctx.fillStyle = color;
      ctx.font = "20px 'VT323', monospace";
      ctx.fillText(value, textAt.x, textAt.y + 14);
    }
    setTextAt(null);
  };

  const clear = () => {
    const ctx = ctx2d();
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
  };

  const save = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'drawing.png';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  };

  return (
    <div className="flex h-full flex-col gap-1">
      <MenuBar items={['File', 'Edit', 'View', 'Image', 'Options', 'Help']} />
      <div className="flex min-h-0 flex-1 gap-1 px-1">
        <div role="toolbar" aria-label="Tools" aria-orientation="vertical" className="grid w-[64px] shrink-0 grid-cols-2 content-start gap-1">
          {TOOLS.map((t) => (
            <button key={t.id} type="button" className="btn98 icon !h-8" aria-label={t.label} title={t.label} aria-pressed={tool === t.id} onClick={() => setTool(t.id)}>
              <Glyph name={t.glyph} />
            </button>
          ))}
          <button type="button" className="btn98 col-span-2 !px-1 !text-base" onClick={clear}>Clear</button>
          <button type="button" className="btn98 col-span-2 !px-1 !text-base" onClick={save}>Save</button>
        </div>

        <div className="field98 relative min-h-0 flex-1 overflow-auto !bg-shadow !p-1">
          <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              aria-label="Drawing canvas"
              role="img"
              className="block h-full w-full touch-none bg-white"
              style={{ imageRendering: 'pixelated', cursor: tool === 'text' ? 'text' : 'crosshair' }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
            {textAt && (
              <input
                ref={textRef}
                type="text"
                aria-label="Type text and press Enter"
                className="absolute m-0 min-w-24 border border-dashed border-dark bg-transparent p-0 text-lg"
                style={{ left: `${(textAt.x / W) * 100}%`, top: `${(textAt.y / H) * 100}%`, color }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitText();
                  if (e.key === 'Escape') {
                    e.preventDefault(); // keep Esc from closing the window
                    setTextAt(null);
                  }
                }}
                onBlur={commitText}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1">
        <div className="field98 h-9 w-9 shrink-0 !p-1" aria-hidden="true">
          <div className="h-full w-full border border-dark" style={{ background: color }} />
        </div>
        <div role="group" aria-label="Colour palette" className="grid grid-cols-8 gap-0.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Colour ${c}`}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className="h-4 w-6 border border-dark p-0 aria-pressed:outline aria-pressed:outline-2 aria-pressed:outline-offset-1 aria-pressed:outline-white"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
