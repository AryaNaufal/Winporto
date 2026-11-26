/** Tiny pixel glyphs drawn from ASCII maps (crisp at any integer scale). */
const GLYPHS = {
  minimize: ['.........', '.........', '.........', '.........', '.........', '.........', '.XXXXXXX.', '.XXXXXXX.'],
  maximize: ['XXXXXXXXX', 'XXXXXXXXX', 'X.......X', 'X.......X', 'X.......X', 'X.......X', 'X.......X', 'XXXXXXXXX'],
  restore: ['..XXXXXXX', '..XXXXXXX', '..X.....X', 'XXXXXXX.X', 'XXXXXXX.X', 'X.....XXX', 'X.....X..', 'XXXXXXX..'],
  close: ['XX.....XX', '.XX...XX.', '..XX.XX..', '...XXX...', '...XXX...', '..XX.XX..', '.XX...XX.', 'XX.....XX'],
  back: ['....X....', '...XX....', '..XXXXXXX', '.XXXXXXXX', '..XXXXXXX', '...XX....', '....X....'],
  forward: ['....X....', '....XX...', 'XXXXXXX..', 'XXXXXXXX.', 'XXXXXXX..', '....XX...', '....X....'],
  reload: ['..XXXXX..', '.XX...XX.', 'XX.....XX', 'XX....XXX', 'XX.....X.', '.XX......', '..XXXXX..'],
  pencil: ['......XX.', '.....XXXX', '....XXXX.', '...XXXX..', '..XXXX...', '.XXXX....', 'XXXX.....', 'XX.......'],
  eraser: ['...XXXXXX', '..XXXXXXX', '.XXXXXXX.', 'XXXXXXX..', 'XXXXXX...', 'XXXXX....'],
  brush: ['......XXX', '.....XXXX', '....XXXX.', '...XXXX..', '..XX.....', '.XXXX....', 'XXXXXX...', '.XXXX....'],
  text: ['XXXXXXXXX', 'XXXXXXXXX', '...XXX...', '...XXX...', '...XXX...', '...XXX...', '...XXX...', '...XXX...'],
} as const;

export type GlyphName = keyof typeof GLYPHS;

export default function Glyph({ name, size = 2 }: { name: GlyphName; size?: number }) {
  const rows = GLYPHS[name];
  const w = rows[0].length;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={w * size}
      height={rows.length * size}
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      fill="currentColor"
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (c === 'X' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  );
}
