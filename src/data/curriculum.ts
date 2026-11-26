/**
 * Beginner learning path. The ORDER of each list is the order students should read.
 * To reorder or add a lesson, edit this file only.
 */
export type Level = 'Pemula' | 'Dasar' | 'Menengah';

export interface Lesson {
  slug: string;
  /** Stage (chapter) this lesson belongs to. */
  stage: string;
  level: Level;
  /** What the reader can do after finishing the lesson. */
  goal: string;
  /** Key terms introduced, with plain-language meanings. */
  terms: [term: string, meaning: string][];
  /** Optional heads-up shown before the lesson starts. */
  note?: string;
  /** Only for lessons that have no entry in the migrated article list. */
  title?: string;
  description?: string;
  readTime?: string;
}

export const htmlPath: Lesson[] = [
  { slug: 'html-01-pengenalan-html', stage: 'Tahap 1 · Pondasi', level: 'Pemula',
    goal: 'Membuat file HTML pertamamu dan membukanya di browser.',
    terms: [['Tag', 'Penanda seperti <p> yang memberi tahu browser jenis konten.'], ['Elemen', 'Tag pembuka + isi + tag penutup.'], ['Atribut', 'Informasi tambahan di dalam tag, misalnya lang="id".']],
    note: 'Siapkan code editor (misalnya VS Code) dan browser. Belum perlu pengalaman apa pun.' },
  { slug: 'html-02-format-teks-headings', stage: 'Tahap 1 · Pondasi', level: 'Pemula',
    goal: 'Menyusun judul, paragraf, dan penekanan teks dengan benar.',
    terms: [['Heading', 'Judul dan subjudul, dari h1 (terbesar) sampai h6.'], ['Paragraf', 'Satu gagasan teks, ditulis dengan <p>.'], ['strong / em', 'Penekanan berdasarkan makna, bukan sekadar tampilan.']] },
  { slug: 'html-08-block-vs-inline', stage: 'Tahap 1 · Pondasi', level: 'Pemula',
    goal: 'Membedakan elemen yang membuat baris baru (block) dan yang mengalir di dalam teks (inline).',
    terms: [['Block', 'Elemen yang memakai satu baris penuh, seperti p dan h1.'], ['Inline', 'Elemen yang hanya sebesar isinya, seperti a dan strong.'], ['Nesting', 'Menaruh elemen di dalam elemen lain.']],
    note: 'Konsep ini dipakai di semua pelajaran berikutnya, jadi baca dengan santai dan coba sendiri.' },
  { slug: 'html-03-link-hyperlink-navigasi', stage: 'Tahap 2 · Membangun konten', level: 'Pemula',
    goal: 'Membuat link ke halaman lain, ke bagian halaman, dan ke email.',
    terms: [['href', 'Atribut yang berisi tujuan link.'], ['URL relatif', 'Alamat file di dalam project-mu sendiri.'], ['Anchor', 'Link yang melompat ke bagian di halaman yang sama.']] },
  { slug: 'html-05-list-dan-tabel', stage: 'Tahap 2 · Membangun konten', level: 'Pemula',
    goal: 'Menulis daftar berurutan, tidak berurutan, dan daftar istilah.',
    terms: [['ul / ol', 'Daftar bullet / daftar bernomor.'], ['li', 'Satu item di dalam daftar.'], ['dl', 'Daftar istilah beserta penjelasannya.']] },
  { slug: 'html-04-gambar-dan-media', stage: 'Tahap 2 · Membangun konten', level: 'Pemula',
    goal: 'Menampilkan gambar dengan teks alternatif yang tepat.',
    terms: [['src', 'Lokasi file gambar.'], ['alt', 'Teks pengganti untuk pembaca layar atau saat gambar gagal dimuat.'], ['width / height', 'Ukuran gambar agar layout tidak melompat.']] },
  { slug: 'html-05b-tabel-data', stage: 'Tahap 2 · Membangun konten', level: 'Dasar',
    goal: 'Membuat tabel data yang mudah dipahami, termasuk pembaca layar.',
    terms: [['table, tr, td', 'Tabel, baris, dan sel.'], ['th', 'Sel judul kolom atau baris.'], ['caption', 'Judul singkat tabel.']] },
  { slug: 'html-06-form-dan-input', stage: 'Tahap 3 · Form dan media', level: 'Dasar',
    goal: 'Membuat form dengan label dan input yang benar.',
    terms: [['form', 'Wadah untuk mengumpulkan data dari pengguna.'], ['label', 'Teks penjelas untuk sebuah input, wajib dipasangkan.'], ['name', 'Nama data yang dikirim saat form dikirim.']] },
  { slug: 'html-06b-validasi-form', stage: 'Tahap 3 · Form dan media', level: 'Dasar',
    goal: 'Memakai tipe input dan validasi bawaan browser.',
    terms: [['type', 'Jenis input: email, number, date, dan lain-lain.'], ['required', 'Menandai input yang wajib diisi.'], ['Validasi', 'Pemeriksaan agar data yang dikirim sesuai aturan.']] },
  { slug: 'html-04b-audio-video', stage: 'Tahap 3 · Form dan media', level: 'Dasar',
    goal: 'Memasang audio dan video dengan kontrol pemutar.',
    terms: [['controls', 'Menampilkan tombol putar dan volume.'], ['source', 'Pilihan file media untuk berbagai format.'], ['track', 'Teks sulih suara atau subtitle.']] },
  { slug: 'html-07-semantic-html5-layout', stage: 'Tahap 4 · Halaman rapi dan siap rilis', level: 'Dasar',
    goal: 'Menyusun kerangka halaman dengan header, nav, main, dan footer.',
    terms: [['Semantic', 'Elemen yang namanya menjelaskan fungsinya.'], ['header / footer', 'Kepala dan kaki halaman atau bagian.'], ['main', 'Isi utama halaman, hanya satu per halaman.']] },
  { slug: 'html-10-iframe-dan-embed', stage: 'Tahap 4 · Halaman rapi dan siap rilis', level: 'Dasar',
    goal: 'Menyematkan halaman lain dengan aman.',
    terms: [['iframe', 'Jendela kecil berisi halaman lain.'], ['sandbox', 'Pembatas keamanan untuk konten yang disematkan.'], ['Embed', 'Menampilkan konten dari situs lain di halamanmu.']] },
  { slug: 'html-04c-gambar-responsif', stage: 'Tahap 4 · Halaman rapi dan siap rilis', level: 'Menengah',
    goal: 'Menyajikan gambar dengan ukuran yang pas di tiap perangkat.',
    terms: [['srcset', 'Daftar versi gambar dengan ukuran berbeda.'], ['sizes', 'Petunjuk lebar gambar di layar.'], ['picture', 'Memilih gambar berbeda untuk kondisi tertentu.']],
    note: 'Topik ini sedikit lebih lanjut. Boleh dilewati dulu dan dibaca setelah selesai pelajaran CSS.' },
  { slug: 'html-09-meta-tags-seo', stage: 'Tahap 4 · Halaman rapi dan siap rilis', level: 'Dasar',
    goal: 'Mengisi title dan meta description agar halaman mudah ditemukan.',
    terms: [['meta', 'Informasi tentang halaman, tidak tampil di layar.'], ['title', 'Judul halaman di tab browser dan hasil pencarian.'], ['SEO', 'Upaya agar halaman mudah ditemukan mesin pencari.']] },
  { slug: 'html-09b-open-graph', stage: 'Tahap 4 · Halaman rapi dan siap rilis', level: 'Dasar',
    goal: 'Mengatur tampilan kartu saat link dibagikan di media sosial.',
    terms: [['Open Graph', 'Standar meta untuk pratinjau link.'], ['og:image', 'Gambar yang muncul pada pratinjau.'], ['Social card', 'Kartu pratinjau link di media sosial.']] },
  { slug: 'html-10b-aksesibilitas-dasar', stage: 'Tahap 4 · Halaman rapi dan siap rilis', level: 'Dasar',
    goal: 'Memeriksa halaman agar bisa dipakai oleh semua orang.',
    terms: [['Aksesibilitas', 'Membuat web bisa digunakan oleh semua orang, termasuk pengguna pembaca layar.'], ['Keyboard', 'Semua fungsi harus bisa dipakai tanpa mouse.'], ['ARIA', 'Atribut tambahan bila elemen semantik tidak cukup.']] },
];

export const cssPath: Lesson[] = [
  { slug: 'css-01-pengenalan-css', stage: 'Tahap 1 · Pondasi', level: 'Pemula',
    goal: 'Menulis aturan CSS pertamamu dan memasangnya ke HTML.',
    terms: [['Selector', 'Bagian yang memilih elemen mana yang diberi gaya.'], ['Property', 'Hal yang diatur, misalnya color.'], ['Value', 'Nilai dari property, misalnya red.']],
    note: 'Selesaikan seri HTML (setidaknya Pelajaran 1–3) sebelum mulai CSS.' },
  { slug: 'css-02-selectors-dan-cara-memilih', stage: 'Tahap 1 · Pondasi', level: 'Pemula',
    goal: 'Memilih elemen dengan tag, class, ID, dan kombinasinya.',
    terms: [['Class', 'Nama yang bisa dipakai banyak elemen, ditulis .nama.'], ['ID', 'Nama unik untuk satu elemen, ditulis #nama.'], ['Combinator', 'Penghubung selector seperti spasi atau >.']] },
  { slug: 'css-03-warna-background-gradient', stage: 'Tahap 1 · Pondasi', level: 'Pemula',
    goal: 'Memakai warna dengan format yang tepat dan menjaga kontras.',
    terms: [['HEX', 'Format warna seperti #2563eb.'], ['RGB / HSL', 'Format warna berdasarkan angka merah-hijau-biru atau hue.'], ['Alpha', 'Tingkat transparansi warna.']],
    note: 'Contoh kode memakai flex dan border-radius yang baru dibahas di pelajaran berikutnya. Salin saja dulu, fokus pada warnanya.' },
  { slug: 'css-04-tipografi-google-fonts', stage: 'Tahap 2 · Teks dan ukuran', level: 'Pemula',
    goal: 'Mengatur font, ukuran, dan jarak baris agar nyaman dibaca.',
    terms: [['font-family', 'Jenis huruf.'], ['line-height', 'Jarak antarbaris teks.'], ['Web font', 'Font yang dimuat dari internet, misalnya Google Fonts.']] },
  { slug: 'css-04b-units-sizing-overflow', stage: 'Tahap 2 · Teks dan ukuran', level: 'Dasar',
    goal: 'Memilih satuan ukuran dan menangani isi yang melebihi kotaknya.',
    terms: [['px / rem / %', 'Satuan tetap, relatif terhadap font, dan relatif terhadap induk.'], ['max-width', 'Batas lebar maksimum.'], ['overflow', 'Aturan saat isi lebih besar dari wadahnya.']] },
  { slug: 'css-05-box-model-margin-padding', stage: 'Tahap 3 · Kotak dan aturan main', level: 'Dasar',
    goal: 'Memahami padding, border, dan margin pada setiap elemen.',
    terms: [['Padding', 'Jarak antara isi dan border.'], ['Border', 'Garis tepi elemen.'], ['Margin', 'Jarak antara elemen dan elemen lain.']],
    note: 'Ini konsep terpenting di CSS. Luangkan waktu ekstra di sini.' },
  { slug: 'css-06-display-block-inline', stage: 'Tahap 3 · Kotak dan aturan main', level: 'Dasar',
    goal: 'Mengubah perilaku elemen dengan display.',
    terms: [['display', 'Aturan cara elemen ditampilkan dan disusun.'], ['inline-block', 'Mengalir seperti teks tetapi bisa diberi ukuran.'], ['none', 'Menyembunyikan elemen sepenuhnya.']] },
  { slug: 'css-02b-cascade-inheritance-specificity', stage: 'Tahap 3 · Kotak dan aturan main', level: 'Dasar',
    goal: 'Memahami mengapa sebuah aturan CSS menang atau kalah.',
    terms: [['Cascade', 'Urutan penentuan aturan mana yang dipakai.'], ['Inheritance', 'Elemen anak mewarisi beberapa gaya dari induknya.'], ['Specificity', 'Tingkat kekhususan selector yang menentukan pemenang.']] },
  { slug: 'css-03b-background-gradient', stage: 'Tahap 3 · Kotak dan aturan main', level: 'Dasar',
    goal: 'Memasang gambar latar dan gradient.',
    terms: [['background-image', 'Gambar di belakang konten.'], ['background-size', 'Cara gambar latar menyesuaikan ukuran.'], ['Gradient', 'Perpaduan warna yang berubah bertahap.']] },
  { slug: 'css-06b-pseudo-class-pseudo-element', stage: 'Tahap 4 · Layout', level: 'Dasar',
    goal: 'Memberi gaya pada keadaan elemen seperti hover dan focus.',
    terms: [[':hover', 'Saat kursor berada di atas elemen.'], [':focus', 'Saat elemen sedang dipilih keyboard.'], ['::before / ::after', 'Konten tambahan yang dibuat dengan CSS.']] },
  { slug: 'css-07-positioning-relative-absolute-fixed', stage: 'Tahap 4 · Layout', level: 'Menengah',
    goal: 'Menempatkan elemen secara khusus dengan position.',
    terms: [['relative', 'Bergeser dari posisi normalnya.'], ['absolute', 'Diposisikan terhadap induk berposisi terdekat.'], ['sticky', 'Menempel saat halaman digulir.']] },
  { slug: 'css-08-flexbox-layouting-modern', stage: 'Tahap 4 · Layout', level: 'Menengah',
    goal: 'Menyusun elemen dalam satu baris atau kolom dengan Flexbox.',
    terms: [['Flex container', 'Elemen induk dengan display: flex.'], ['justify-content', 'Mengatur susunan sepanjang sumbu utama.'], ['align-items', 'Mengatur susunan pada sumbu silang.']] },
  { slug: 'css-09-grid-layouting-2d', stage: 'Tahap 4 · Layout', level: 'Menengah',
    goal: 'Membuat layout baris dan kolom dengan Grid.',
    terms: [['Grid', 'Layout dua dimensi: baris dan kolom.'], ['fr', 'Satuan pecahan dari ruang tersisa.'], ['gap', 'Jarak antarsel grid.']] },
  { slug: 'css-07b-transition-transform-animation', stage: 'Tahap 5 · Interaksi dan kualitas', level: 'Menengah',
    goal: 'Menambahkan gerakan halus yang tetap nyaman bagi pengguna.',
    terms: [['transition', 'Perubahan halus saat nilai berubah.'], ['transform', 'Menggeser, memutar, atau mengubah skala elemen.'], ['@keyframes', 'Mendefinisikan langkah-langkah animasi.']] },
  { slug: 'css-10-responsive-media-queries', stage: 'Tahap 5 · Interaksi dan kualitas', level: 'Menengah',
    goal: 'Membuat halaman nyaman di ponsel maupun layar besar.',
    terms: [['Responsif', 'Tampilan menyesuaikan ukuran layar.'], ['Media query', 'Aturan CSS yang hanya aktif pada kondisi tertentu.'], ['Mobile first', 'Mulai dari tampilan ponsel, lalu tambah untuk layar besar.']] },
  { slug: 'css-10b-variabel-dan-fungsi-css', stage: 'Tahap 5 · Interaksi dan kualitas', level: 'Menengah',
    goal: 'Menyimpan nilai berulang dalam variabel dan memakai fungsi CSS.',
    terms: [['Custom property', 'Variabel CSS, ditulis --nama.'], ['var()', 'Memakai nilai variabel.'], ['clamp()', 'Nilai yang tumbuh di antara batas minimum dan maksimum.']] },
  { slug: 'css-10c-aksesibilitas-css', stage: 'Tahap 5 · Interaksi dan kualitas', level: 'Menengah',
    goal: 'Memeriksa kontras, fokus, dan gerakan agar CSS-mu ramah semua pengguna.',
    terms: [['Kontras', 'Perbedaan terang-gelap antara teks dan latarnya.'], ['Focus ring', 'Garis penanda elemen yang sedang aktif di keyboard.'], ['prefers-reduced-motion', 'Preferensi pengguna untuk mengurangi animasi.']] },
];
