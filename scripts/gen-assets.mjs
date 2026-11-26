// Generates pixel-art SVG icons (from ASCII maps) and a placeholder resume.pdf.
// Run: node scripts/gen-assets.mjs
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const PAL = {
  k: '#22243a', w: '#ffffff', g: '#c9d1c8', s: '#858d84', b: '#3f4a9b', l: '#8fb4ec',
  y: '#f2c94c', o: '#d98b2b', r: '#d04a3f', n: '#3f9d4f', t: '#e6c58f', m: '#aeb6c2', c: '#58c7d9',
};
const dots = '................';

const ICONS = {
  camera: [dots, dots, '......kkkkk.....', '.....kgggggk....', '.kkkkkkkkkkkkkk.', '.kggggggggggwgk.',
    '.kgggkkkkkkgggk.', '.kggkllllllkggk.', '.kggkllwwllkggk.', '.kggkllllllkggk.', '.kggkllllllkggk.',
    '.kgggkkkkkkgggk.', '.kggggggggggggk.', '.kkkkkkkkkkkkkk.', dots, dots],
  folder: [dots, dots, '..kkkkk.........', '.kyyyyyk........', '.kyyyyyykkkkkkk.', '.kyyyyyyyyyyyyk.',
    '.kywwwwwwwwwwyk.', '.kyyyyyyyyyyyyk.', '.kyyyyyyyyyyyyk.', '.kyyyyyyyyyyyyk.', '.kyyyyyyyyyyyyk.',
    '.kyyyyyyyyyyyyk.', '.kooooooooooook.', '.kkkkkkkkkkkkkk.', dots, dots],
  chrome: [dots, '.....rrrrrr.....', '...rrrrrrrrrr...', '..rrrrwwwwrrrr..', '..rrrwbbbbwrrr..',
    '.nrrwbbbbbbwrry.', '.nnnwbbbbbbwyyy.', '.nnnwbbbbbbwyyy.', '.nnnnwbbbbwyyyy.', '..nnnnwwwwyyyy..',
    '..nnnnnnnyyyyy..', '...nnnnnnyyyy...', '.....nnnyyy.....', dots],
  recycle: [dots, '......kkkk......', '....kkggggkk....', '...kggggggggk...', '...kkkkkkkkkk...',
    '....kgwggggsk...', '....kgwggggsk...', '....kgwgnggsk...', '....kgwnnnnsk...', '....kgwgngnsk...',
    '....kgwggggsk...', '....kgwggggsk...', '.....kgggggsk...', '......kkkkkk....'],
  welcome: [dots, '.kkkkkkkkkkkkk..', '.kgggggggggggk..', '.kgkkkkkkkkkgk..', '.kgklllllllkgk..',
    '.kgkllwlwllkgk..', '.kgklllwlllkgk..', '.kgkllwwwwlkgk..', '.kgklllllllkgk..', '.kgkkkkkkkkkgk..',
    '.kgggggggggggk..', '.kkkkkkkkkkkkk..', '......kkkk......', '...kggggggggk...', '...kkkkkkkkkk...', dots],
  paint: [dots, dots, '...kkkkkkkkkk...', '..kttttttttttk..', '.kttrrttttyyttk.'.slice(0, 16), '.kttrrttttyyttk.'.slice(0, 16),
    '.kttttttttttttk.'.slice(0, 16), '.kbbtttttnnttk..', '.kbbttttttnntk..', '.ktttttttttttk..', '..kkttttttttk...',
    '...kkkkkkkkkk...', dots, dots],
  doc: [dots, '...kkkkkkk......', '...kwwwwwkk.....', '...kwwwwwkwk....', '...kwwwwwkkkk...', '...kwwwwwwwwk...',
    '...kwkkkkkkwk...', '...kwwwwwwwwk...', '...kwkkkkkkwk...', '...kwwwwwwwwk...', '...kwkkkkwwwk...',
    '...kwwwwwwwwk...', '...kkkkkkkkkk...', dots],
  start: [dots, dots, '..rrrrrr.nnnnnn.', '..rrrrrr.nnnnnn.', '..rrrrrr.nnnnnn.', '..rrrrrr.nnnnnn.',
    '..rrrrrr.nnnnnn.', dots, '..bbbbbb.yyyyyy.', '..bbbbbb.yyyyyy.', '..bbbbbb.yyyyyy.', '..bbbbbb.yyyyyy.',
    '..bbbbbb.yyyyyy.', dots, dots, dots],
  flag: [dots, dots, dots, dots, '.kkkkkkkkkkkkkk.', '.krrrrrrrrrrrrk.', '.krrrrrrrrrrrrk.', '.krrrrrrrrrrrrk.',
    '.krrrrrrrrrrrrk.', '.kwwwwwwwwwwwwk.', '.kwwwwwwwwwwwwk.', '.kwwwwwwwwwwwwk.', '.kwwwwwwwwwwwwk.',
    '.kkkkkkkkkkkkkk.', dots, dots],
  tetris: ['........rrrkrrrk', '........rrrkrrrk', '........rrrkrrrk', '........kkkkkkkk', '....rrrkrrrk....', '....rrrkrrrk....', '....rrrkrrrk....', '....kkkkkkkk....', 'yyykyyykbbbk....', 'yyykyyykbbbk....', 'yyykyyykbbbk....', 'kkkkkkkkkkkk....', 'yyykyyykbbbkbbbk', 'yyykyyykbbbkbbbk', 'yyykyyykbbbkbbbk', 'kkkkkkkkkkkkkkkk'],
  snake: ['................', '.nnnnnnnnnnn....', '.nnnnnnnnnnn....', '.nnn............', '.nnn............', '.nnnnnnnnnnn....', '.nnnnnnnnnnn....', '.........nnn....', '.........nnn....', '.nknnnnnnnnn....', 'rnnnnnnnnnnn....', '............n...', '...........rrr..', '...........rrr..', '...........rrr..', '................'],
  games: ['................', '................', '................', '..kkkkkkkkkkkk..', '.kggggggggggggk.', '.kgggkgggggrggk.', '.kggkkkgggrgrgk.', '.kgggkgggggbggk.', '.kggggggggggggk.', '.kggkkkkkkkkggk.', '..kkk......kkk..', '................', '................', '................', '................', '................'],
  calendar: [dots, dots, '.kkkkkkkkkkkkkk.', '.krrrrrrrrrrrrk.', '.krrrrrrrrrrrrk.', '.kkkkkkkkkkkkkk.', '.kwwkwwkwwkwwwk.', '.kwwkwwkwwkwwwk.', '.kkkkkkkkkkkkkk.', '.kwwkwwkwwkwwwk.', '.kwwkwwkwwkwwwk.', '.kkkkkkkkkkkkkk.', '.kwwwwwwwwwwwwk.', '.kkkkkkkkkkkkkk.', dots, dots],
  settings: [dots, '......kkkk......', '...kk.kggk.kk...', '..kggkkggkkggk..', '...kggggggggk...', '....kggkkggk....', '.kkkggk..kggkkk.', '.kgggk....kgggk.', '.kgggk....kgggk.', '.kkkggk..kggkkk.', '....kggkkggk....', '...kggggggggk...', '..kggkkggkkggk..', '...kk.kggk.kk...', '......kkkk......', dots],
  clippy: ['....kkkkkkkk....', '...kmmmmmmmmk...', '..kmkkmmmmkkmk..', '..kmwwmmmmwwmk..', '..kmwkmmmmwkmk..',
    '..kmmmmmmmmmmk..', '..kmmkkkkkkmmk..', '..kmmk....kmmk..', '..kmmk....kmmk..', '..kmmk....kmmk..',
    '..kmmk....kmmk..', '..kmmk....kmmk..', '..kmmk....kmmk..', '..kmmkkkkkkmmk..', '..kmmmmmmmmmmk..',
    '...kmmmmmmmmk...', '....kkkkkkkk....'],
};

const CURSOR = ['k...........', 'kk..........', 'kwk.........', 'kwwk........', 'kwwwk.......', 'kwwwwk......',
  'kwwwwwk.....', 'kwwwwwwk....', 'kwwwwwwwk...', 'kwwwwwwwwk..', 'kwwwwwkkkkk.', 'kwwkwwk.....',
  'kwk.kwwk....', 'kk..kwwk....', 'k....kwwk...', '.....kkk....'];

function toSvg(rows, scale = 1) {
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  let rects = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      if (!PAL[c]) throw new Error(`bad colour "${c}" at row ${y}`);
      let run = 1;
      while (row[x + run] === c) run++;
      rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${PAL[c]}"/>`;
      x += run;
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${rects}</svg>`;
}

mkdirSync('public/icons', { recursive: true });
for (const [name, rows] of Object.entries(ICONS)) {
  if (name !== 'clippy' && rows.some((r) => r.length !== 16)) console.warn(`! ${name}: rows not all 16 wide`);
  writeFileSync(`public/icons/${name}.svg`, toSvg(rows));
}
writeFileSync('public/icons/cursor.svg', toSvg(CURSOR, 2));
writeFileSync('public/favicon.svg', toSvg(ICONS.welcome));

// Minimal valid placeholder PDF (replace public/resume.pdf with your real resume).
const lines = ['Nama Lengkap', 'Front-End Developer', '', 'Placeholder resume - replace public/resume.pdf with your own file.'];
const stream = 'BT /F1 22 Tf 60 780 Td 28 TL ' + lines.map((l) => `(${l}) Tj T*`).join(' ') + ' ET';
const objs = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
  `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
];
let pdf = '%PDF-1.4\n';
const offs = [];
objs.forEach((o, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
const xref = pdf.length;
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
// Never overwrite a real resume with the placeholder.
if (!existsSync('public/resume.pdf')) writeFileSync('public/resume.pdf', pdf);
console.log('assets generated');
