/**
 * Articles migrated from the previous website, re-ordered into a beginner learning
 * path (see ./curriculum.ts). Each body is an HTML file in ./articles/<slug>.html,
 * loaded lazily when an article is opened.
 */
import { cssPath, htmlPath, type Level, type Lesson } from './curriculum';
import { jsPath } from './curriculum-js';

export type Series = 'HTML' | 'CSS' | 'JS';

interface SourceMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
}

export interface ArticleMeta extends SourceMeta {
  series: Series;
  /** Position inside its series (1-based) and the series length. */
  lesson: number;
  total: number;
  stage: string;
  level: Level;
  goal: string;
  terms: [string, string][];
  note?: string;
}

const source: SourceMeta[] = [
  {
    "slug": "html-01-pengenalan-html",
    "title": "Mengenal HTML dan Membuat Dokumen Pertama",
    "description": "Pelajaran pertama HTML untuk pemula: memahami fungsi HTML, tag, elemen, atribut, struktur dokumen, dan membuat halaman web pertama.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-02-format-teks-headings",
    "title": "Menyusun Heading, Paragraf, dan Teks yang Bermakna",
    "description": "Belajar menyusun judul dan paragraf yang mudah dibaca menggunakan heading, strong, em, mark, br, dan hr secara tepat.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-03-link-hyperlink-navigasi",
    "title": "Membuat Link dan Navigasi Antarhalaman",
    "description": "Panduan pemula membuat link eksternal, link lokal, anchor dalam halaman, email, dan navigasi yang aman serta mudah dipahami.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-04-gambar-dan-media",
    "title": "Menampilkan Gambar yang Cepat dan Aksesibel",
    "description": "Belajar menggunakan img, src, alt, width, height, figure, dan path gambar dengan benar sebelum mempelajari media responsif.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-04b-audio-video",
    "title": "Memasang Audio dan Video",
    "description": "Pelajari elemen audio, video, source, controls, poster, caption, dan fallback tanpa mencampurnya dengan materi gambar dasar.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "6 min read"
  },
  {
    "slug": "html-04c-gambar-responsif",
    "title": "Gambar Responsif dengan srcset dan picture",
    "description": "Lanjutan materi gambar: membantu browser memilih ukuran dan komposisi gambar yang tepat menggunakan srcset, sizes, dan picture.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-05-list-dan-tabel",
    "title": "Membuat List Berurutan dan Tidak Berurutan",
    "description": "Fokus memahami ul, ol, li, description list, dan list bersarang. Materi tabel dipisahkan agar dapat dibahas lebih jelas.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "6 min read"
  },
  {
    "slug": "html-05b-tabel-data",
    "title": "Membuat Tabel Data yang Mudah Dipahami",
    "description": "Pelajari table, caption, thead, tbody, tr, th, td, dan scope untuk menyajikan data tabular secara semantik dan aksesibel.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-06-form-dan-input",
    "title": "Dasar Form, Label, dan Input",
    "description": "Materi dasar form untuk pemula: memahami form, label, input, name, button, textarea, select, dan cara data dikirim.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-06b-validasi-form",
    "title": "Tipe Input dan Validasi Form",
    "description": "Lanjutan form HTML: memilih tipe input dan menggunakan required, minlength, maxlength, min, max, pattern, serta pesan bantuan.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-07-semantic-html5-layout",
    "title": "Menyusun Layout dengan Elemen Semantik",
    "description": "Memahami kapan menggunakan header, nav, main, section, article, aside, dan footer agar struktur halaman mudah dipahami.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-08-block-vs-inline",
    "title": "Memahami Elemen Block dan Inline",
    "description": "Memahami aliran normal elemen block dan inline serta penggunaan div dan span tanpa mencampurkan konsepnya dengan layout CSS.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "6 min read"
  },
  {
    "slug": "html-09-meta-tags-seo",
    "title": "Meta Tags dan SEO Dasar",
    "description": "Memahami title, meta charset, viewport, description, robots, canonical, dan hubungan struktur HTML dengan SEO dasar.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-09b-open-graph",
    "title": "Open Graph dan Social Media Card",
    "description": "Membuat pratinjau link yang informatif di media sosial menggunakan Open Graph dan metadata kartu Twitter/X.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "6 min read"
  },
  {
    "slug": "html-10-iframe-dan-embed",
    "title": "Iframe, Embed, dan Keamanannya",
    "description": "Memahami iframe secara bertahap, memberi title, mengatur izin, memakai sandbox, dan menyematkan konten pihak ketiga dengan lebih aman.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "html-10b-aksesibilitas-dasar",
    "title": "Aksesibilitas Dasar untuk Pemula",
    "description": "Checklist aksesibilitas dasar: struktur heading, label form, alt gambar, penggunaan keyboard, tombol semantik, bahasa dokumen, dan ARIA seperlunya.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "8 min read"
  },
  {
    "slug": "css-01-pengenalan-css",
    "title": "Mengenal CSS dan Menulis Aturan Pertama",
    "description": "Pelajaran pertama CSS untuk pemula: memahami selector, property, value, cara memasang CSS, komentar, dan cara memeriksa hasilnya.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "css-02-selectors-dan-cara-memilih",
    "title": "Selector Elemen, Class, ID, dan Kombinasi Dasar",
    "description": "Belajar memilih elemen dengan selector tag, class, ID, grouping, descendant, dan child secara bertahap sebelum mempelajari specificity.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "css-02b-cascade-inheritance-specificity",
    "title": "Cascade, Inheritance, dan Specificity",
    "description": "Memahami mengapa aturan CSS dapat saling menimpa melalui urutan sumber, inheritance, specificity, dan penggunaan !important yang bijak.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "8 min read"
  },
  {
    "slug": "css-03-warna-background-gradient",
    "title": "Warna, Transparansi, dan Kontras",
    "description": "Fokus memahami named color, HEX, RGB, HSL, alpha transparency, currentColor, dan pentingnya kontras sebelum belajar background.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "css-03b-background-gradient",
    "title": "Background Image dan Gradient",
    "description": "Belajar background-color, background-image, repeat, position, size, linear-gradient, radial-gradient, dan overlay secara terpisah dari teori warna.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "css-04-tipografi-google-fonts",
    "title": "Tipografi dan Web Font yang Mudah Dibaca",
    "description": "Mengatur font-family, fallback, size, weight, line-height, letter-spacing, panjang baris, dan memuat web font dengan tetap menjaga keterbacaan.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "8 min read"
  },
  {
    "slug": "css-04b-units-sizing-overflow",
    "title": "Units, Sizing, dan Overflow",
    "description": "Memilih px, rem, em, persen, vw, min, max, clamp, width, max-width, min-height, dan menangani overflow secara bertahap.",
    "category": "Web Development",
    "date": "06 Agu 2026",
    "readTime": "8 min read"
  },
  {
    "slug": "css-05-box-model-margin-padding",
    "title": "Box Model, Padding, Border, dan Margin",
    "description": "Memahami content, padding, border, margin, box-sizing, margin collapse, dan cara memeriksa ukuran elemen melalui DevTools.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "css-06-display-block-inline",
    "title": "Memahami Display, Block, Inline, dan Inline-Block",
    "description": "Pelajari alur normal halaman dan perbedaan block, inline, inline-block, serta cara menyembunyikan elemen dengan tepat.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "css-06b-pseudo-class-pseudo-element",
    "title": "Pseudo-Class dan Pseudo-Element",
    "description": "Buat gaya hover, fokus keyboard, dan dekorasi sederhana menggunakan pseudo-class serta pseudo-element.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  },
  {
    "slug": "css-07-positioning-relative-absolute-fixed",
    "title": "Position Relative, Absolute, Fixed, dan Sticky",
    "description": "Pahami acuan posisi elemen dan gunakan relative, absolute, fixed, sticky, serta z-index tanpa merusak tata letak.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "8 min read"
  },
  {
    "slug": "css-07b-transition-transform-animation",
    "title": "Transition, Transform, dan Animasi Dasar",
    "description": "Tambahkan gerakan yang halus dengan transition, transform, dan keyframes tanpa mengganggu kenyamanan pengguna.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "8 min read"
  },
  {
    "slug": "css-08-flexbox-layouting-modern",
    "title": "Membuat Layout Satu Dimensi dengan Flexbox",
    "description": "Pelajari container, item, sumbu utama, perataan, gap, wrap, dan ukuran fleksibel untuk membuat layout dengan Flexbox.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "9 min read"
  },
  {
    "slug": "css-09-grid-layouting-2d",
    "title": "Membuat Layout Baris dan Kolom dengan Grid",
    "description": "Pelajari kolom, baris, fr, repeat, gap, penempatan item, dan grid responsif untuk menyusun layout dua dimensi.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "9 min read"
  },
  {
    "slug": "css-10-responsive-media-queries",
    "title": "Desain Responsif dan Media Query",
    "description": "Bangun tampilan mobile-first yang dapat menyesuaikan isi menggunakan ukuran fleksibel, breakpoint, dan media query.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "9 min read"
  },
  {
    "slug": "css-10b-variabel-dan-fungsi-css",
    "title": "Variabel dan Fungsi CSS yang Berguna",
    "description": "Kurangi pengulangan dan buat ukuran fleksibel menggunakan custom properties, calc, min, max, dan clamp.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "8 min read"
  },
  {
    "slug": "css-10c-aksesibilitas-css",
    "title": "Dasar Aksesibilitas dalam Styling",
    "description": "Pastikan warna, fokus keyboard, ukuran target, teks, dan gerakan CSS tetap nyaman bagi lebih banyak pengguna.",
    "category": "Web Development",
    "date": "05 Agu 2026",
    "readTime": "7 min read"
  }
];

const bySlug = new Map(source.map((s) => [s.slug, s]));

function build(series: Series, path: Lesson[]): ArticleMeta[] {
  return path.map((l, i) => {
    // Migrated articles take metadata from `source`; new ones carry it in the lesson itself.
    const s: SourceMeta | undefined =
      bySlug.get(l.slug) ??
      (l.title && l.description && l.readTime
        ? { slug: l.slug, title: l.title, description: l.description, category: 'Web Development', date: '22 Nov 2026', readTime: l.readTime }
        : undefined);
    if (!s) throw new Error(`Unknown article: ${l.slug}`);
    const label = series === 'JS' ? 'JavaScript' : series;
    return { ...s, ...l, title: `${label} ${i + 1}: ${s.title}`, series, lesson: i + 1, total: path.length };
  });
}

/** Reading order: HTML first, then CSS, then JavaScript. */
export const articles: ArticleMeta[] = [...build('HTML', htmlPath), ...build('CSS', cssPath), ...build('JS', jsPath)];

const bodies = import.meta.glob<string>('./articles/*.html', { query: '?raw', import: 'default' });

/** Lazily load the HTML body of an article. */
export async function loadArticleBody(slug: string): Promise<string> {
  const load = bodies[`./articles/${slug}.html`];
  return load ? load() : '<p>Article not found.</p>';
}
