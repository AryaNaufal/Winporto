/**
 * ALL portfolio content lives here. Edit this file to make the site yours;
 * components never hard-code copy. (Migrated from aryanaufal.my.id.)
 * Articles live in ./articles.ts.
 */
export const site = {
  /** Short brand name, used as the suffix of page titles. */
  name: 'Arya Naufal',
  title: 'Arya Naufal | Fullstack Web Developer',
  description:
    'Portofolio interaktif bergaya Windows 98 milik Arya Naufal, Fullstack Web Developer dengan pengalaman 3+ tahun: website cepat, rapi, dan fokus pada detail.',
  resume: '/resume.pdf',
};

export const profile = {
  name: 'Arya Naufal Dzaky Taqwim',
  role: 'Fullstack Web Developer',
  domain: 'aryanaufal.my.id',
  summary: [
    'Saya adalah Pengembang Website dengan pengalaman lebih dari 3 tahun dalam pengembangan perangkat lunak dan web. Saat ini saya menempuh pendidikan S1 Teknik Informatika di Universitas Pamulang, sembari terus mengasah kemampuan teknis untuk membangun aplikasi dan website yang inovatif, efisien, dan mudah digunakan.',
    'Sepanjang perjalanan karier saya terlibat dalam berbagai proyek mulai dari pembuatan website dinamis, sistem manajemen konten (CMS), hingga pengembangan aplikasi berbasis web yang berfokus pada user experience dan performa. Saya terbiasa bekerja dengan HTML, CSS, JavaScript, PHP, serta framework Next.js untuk membangun solusi web yang andal, terstruktur, dan scalable.',
    'Fokus saya: mengutamakan pengalaman pengguna, performa, dan codebase yang mudah dirawat.',
  ],
  skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Astro', 'Prisma'],
};

export const experience = [
  {
    company: 'Berbagai proyek web',
    role: 'Web Developer',
    period: '3+ tahun',
    bullets: [
      'Membangun website dinamis, sistem manajemen konten (CMS), dan aplikasi berbasis web dengan fokus pada user experience dan performa.',
      'Bekerja dengan HTML, CSS, JavaScript, PHP, dan Next.js.',
      'Juara 2 Lomba Kompetisi Siswa Tingkat Provinsi (saat SMK).',
    ],
  },
];

export const education = [
  {
    school: 'Universitas Pamulang',
    degree: 'S1 Teknik Informatika',
    period: '2022 — 2026',
    note: 'Tangerang Selatan, ID.',
  },
  {
    school: 'SMK Letris Indonesia 2',
    degree: 'RPL (Rekayasa Perangkat Lunak)',
    period: '2019 — 2022',
    note: 'Tangerang Selatan, ID.',
  },
  {
    school: 'Codepolitan (Kelas Fullstack)',
    degree: 'Course',
    period: 'Permanent',
    note: 'Mempelajari dasar Front End dan Back End.',
  },
  {
    school: 'Digitalent (Junior Web Developer)',
    degree: 'Course',
    period: '2021',
    note: 'Mempelajari dasar PHP.',
  },
];

export const contact = {
  email: 'arya.naufal.andt@gmail.com',
  links: [
    { name: 'LinkedIn', label: 'linkedin.com/in/arya-naufal', url: 'https://www.linkedin.com/in/arya-naufal-38126026b/' },
    { name: 'GitHub', label: 'github.com/AryaNaufal', url: 'https://github.com/AryaNaufal/' },
    { name: 'Instagram', label: '@aryanaufall_', url: 'https://instagram.com/aryanaufall_' },
    { name: 'X', label: '@AryaNaufal230', url: 'https://x.com/AryaNaufal230' },
  ],
};

export interface Project {
  id: string;
  name: string;
  kind: string;
  description: string;
  stack: string[];
  url?: string;
}

export const projects: Project[] = [
  { id: 'p1', name: 'unpam super app', kind: 'Repository', description: 'Super app untuk Universitas Pamulang (open source).', stack: ['Astro 3', 'TailwindCSS'], url: 'https://github.com/NeoNusantaraProject/open-unpam-superapp' },
  { id: 'p2', name: 'portofolio-v1', kind: 'Repository', description: 'Versi pertama website portofolio saya.', stack: ['NextJS 13', 'TailwindCSS', 'TypeScript'], url: 'https://github.com/AryaNaufal/AryaNaufal.github.io' },
  { id: 'p3', name: 'toko onlen', kind: 'Repository', description: 'Aplikasi toko online.', stack: ['NextJS 14', 'TailwindCSS', 'Prisma (PostgreSQL)', 'Tanstack Query'], url: 'https://github.com/AryaNaufal/toko-onlen' },
  { id: 'p4', name: 'game catur', kind: 'Repository', description: 'Permainan catur di browser.', stack: ['HTML', 'CSS', 'JavaScript'], url: 'https://github.com/AryaNaufal/Game-Catur' },
  { id: 'p5', name: 'chat app', kind: 'Repository', description: 'Aplikasi chat berbasis PHP dan MySQL.', stack: ['PHP', 'MySQL'], url: 'https://github.com/AryaNaufal/ChatApp_PHP' },
  { id: 'p6', name: 'notion app', kind: 'Repository', description: 'Aplikasi catatan ala Notion dengan autentikasi.', stack: ['NextJS 15', 'TailwindCSS', 'Prisma (MySQL)', 'NextAuth JWT'], url: 'https://github.com/AryaNaufal/notion-apps' },
];

export const welcome = {
  tagline: 'Welcome to Portfolio 98 — Web Edition',
  marquee: 'Built with Astro • React 19 • TypeScript • Tailwind CSS v4 • Nanostores • Press Start 2P • VT323 •',
  overview: [
    'This portfolio is a tiny operating system running in your browser. Double-click an icon, drag windows around, open the Start menu, or ask Clippy for help.',
    'Everything is hand-made: no UI library, just Astro, React islands and a lot of 1px borders.',
  ],
  stack: [
    ['Astro', 'Static output, islands architecture'],
    ['React 19', 'Interactive windows & taskbar'],
    ['TypeScript', 'Typed stores, data and components'],
    ['Tailwind v4', 'Design tokens + bevel utilities'],
    ['Nanostores', 'Tiny window-manager state'],
  ],
  architecture: [
    ['data/portfolio.ts', 'All content, separate from components.'],
    ['data/articles/*.html', 'Article bodies, loaded lazily on demand.'],
    ['data/apps.ts', 'Registry of programs (title, icon, geometry).'],
    ['stores/windowStore.ts', 'Open / minimize / maximize / z-order / position.'],
    ['components/Window.tsx', 'Generic window: drag, focus, title bar buttons.'],
    ['components/WindowLayer.tsx', 'Renders open windows; heavy ones are lazy-loaded.'],
    ['components/windows/*', 'One component per program.'],
    ['styles/global.css', 'Tokens, bevel utilities, pixel fonts.'],
  ],
  accessibility: [
    'Semantic HTML: landmarks, buttons, tablists, dialogs with labels.',
    'Keyboard: Tab / Shift+Tab to move, Enter to open icons, Esc to close the active window.',
    'Icon-only buttons have aria-labels; focus rings are always visible.',
    'Text contrast meets WCAG AA on every surface.',
    'prefers-reduced-motion disables all animations, including the marquee.',
    'Mobile: windows go fullscreen, one at a time.',
  ],
};

export const clippy = {
  greeting: "Looks like you're exploring a portfolio. Want to see the Resume?",
  tips: [
    'Double-click the icons on the left to open programs.',
    'Psst… the Recycle Bin has secrets.',
    'Drag a window by its title bar. Double-click the title bar to maximize.',
    'Open Paint and draw something. I will not judge.',
    'Feeling bored? Open Games and play Tetris or Snake.',
    'Press Esc to close the active window.',
    'The Camera window can snap a photo — and you can download it.',
    'Curious about HTML, CSS & JavaScript? Open Articles — there are 56 lessons.',
    'It looks like you are hiring a front-end developer. Need help with that?',
    'Try Start → Shut Down. Nothing bad happens. Probably.',
  ],
};

export const recycleBin = {
  items: [
    { name: 'my_motivation.exe', size: '0 KB', note: 'Last seen: Monday 9:00 AM.' },
    { name: 'final_final_v2_REAL.psd', size: '412 MB', note: 'Version 3 was somehow worse.' },
    { name: 'semicolons.txt', size: '1 KB', note: 'Turns out the formatter handles these.' },
    { name: 'Internet Explorer.lnk', size: '2 KB', note: 'Rest in peace, old friend.' },
    { name: 'bugs.zip', size: '999 MB', note: 'They are not bugs, they are features.' },
  ],
  emptyReplies: [
    'Nice try. The bugs refuse to leave.',
    'Access denied: the Recycle Bin is emotionally attached to its files.',
    'Deleted 0 files. Saved 100% of the memories.',
    'Okay okay… but they will be back in production.',
  ],
};
