// Generates public/og.png (1200x630), the image shown when a link is shared.
// Run: node scripts/gen-og.mjs
import sharp from 'sharp';

const font = 'Tahoma, Arial, sans-serif';
const bevel = (x, y, w, h) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c0c0c0"/>
  <path d="M${x} ${y + h}V${y}H${x + w}" stroke="#fff" stroke-width="6" fill="none"/>
  <path d="M${x} ${y + h}H${x + w}V${y}" stroke="#222" stroke-width="6" fill="none"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" shape-rendering="crispEdges">
  <defs><linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#000080"/><stop offset="1" stop-color="#1084d0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="#008080"/>
  ${bevel(130, 80, 940, 440)}
  <rect x="142" y="92" width="916" height="52" fill="url(#t)"/>
  <text x="162" y="128" font-family="${font}" font-size="28" font-weight="700" fill="#fff">Portfolio 98</text>
  ${bevel(1006, 100, 40, 36)}
  <path d="M1016 108l20 20M1036 108l-20 20" stroke="#000" stroke-width="5"/>
  <rect x="152" y="160" width="896" height="340" fill="#fff"/>
  <text x="600" y="285" text-anchor="middle" font-family="${font}" font-size="82" font-weight="700" fill="#000">Arya Naufal</text>
  <text x="600" y="355" text-anchor="middle" font-family="${font}" font-size="42" fill="#a33a2f">Fullstack Web Developer</text>
  <text x="600" y="440" text-anchor="middle" font-family="${font}" font-size="30" fill="#404040">Portofolio · Proyek · Belajar HTML, CSS, JavaScript</text>
  ${bevel(0, 566, 1200, 64)}
  ${bevel(14, 576, 150, 44)}
  <rect x="30" y="586" width="11" height="11" fill="#d04a3f"/><rect x="44" y="586" width="11" height="11" fill="#3f9d4f"/>
  <rect x="30" y="600" width="11" height="11" fill="#3f4a9b"/><rect x="44" y="600" width="11" height="11" fill="#f2c94c"/>
  <text x="68" y="608" font-family="${font}" font-size="26" font-weight="700">Start</text>
  <text x="1180" y="608" text-anchor="end" font-family="${font}" font-size="26">aryanaufal.my.id</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png generated');
