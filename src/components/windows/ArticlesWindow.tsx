/** Article reader: a numbered beginner learning path (HTML first, then CSS). */
import { useEffect, useRef, useState } from 'react';
import { articles, loadArticleBody, type ArticleMeta } from '../../data/articles';
import MenuBar from '../MenuBar';

type Filter = 'All' | 'HTML' | 'CSS' | 'JS';
const FILTERS: Filter[] = ['All', 'HTML', 'CSS', 'JS'];
const STORE_KEY = 'winporto:lessons-done';

/** Completed lessons are remembered per browser (optional convenience). */
function useDone() {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]'));
    } catch {
      /* storage unavailable: start empty */
    }
  }, []);
  const toggle = (slug: string) =>
    setDone((cur) => {
      const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  return { done, toggle };
}

function Reader({ article, done, onToggle, onGo, onBack }: {
  article: ArticleMeta;
  done: boolean;
  onToggle: () => void;
  onGo: (slug: string) => void;
  onBack: () => void;
}) {
  const [html, setHtml] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const idx = articles.indexOf(article);
  const prev = articles[idx - 1];
  const next = articles[idx + 1];

  useEffect(() => {
    let alive = true;
    setHtml(null);
    loadArticleBody(article.slug).then((h) => alive && setHtml(h));
    box.current?.scrollTo({ top: 0 });
    return () => {
      alive = false;
    };
  }, [article.slug]);

  return (
    <div className="flex h-full flex-col gap-1 p-1">
      <div className="flex items-center gap-2">
        <button type="button" className="btn98" onClick={onBack}>← Daftar pelajaran</button>
        <span className="truncate text-muted">{article.readTime.replace('min read', 'menit baca')}</span>
      </div>

      <div ref={box} className="field98 min-h-0 flex-1 overflow-auto !bg-paper !p-4">
        <p className="m-0 text-muted">
          Seri {article.series === 'JS' ? 'JavaScript' : article.series} · Pelajaran {article.lesson} dari {article.total} · {article.level}
        </p>
        <div className="my-1 h-2 border-2 border-dark bg-white" role="progressbar" aria-label="Progres seri" aria-valuemin={0} aria-valuemax={article.total} aria-valuenow={article.lesson}>
          <div className="h-full bg-title" style={{ width: `${(article.lesson / article.total) * 100}%` }} />
        </div>
        <h3 className="mb-2 mt-3 text-lg font-bold leading-6">{article.title}</h3>

        <section aria-label="Sebelum mulai" className="mb-4 border-2 border-dark bg-bubble p-3">
          <p className="m-0"><strong>Setelah pelajaran ini kamu bisa:</strong> {article.goal}</p>
          {article.note && <p className="mb-0 mt-2"><strong>Catatan:</strong> {article.note}</p>}
          <p className="mb-1 mt-2"><strong>Istilah baru:</strong></p>
          <ul className="m-0 pl-5">
            {article.terms.map(([t, m]) => (
              <li key={t}><code className="chip">{t}</code> — {m}</li>
            ))}
          </ul>
        </section>

        {html === null ? (
          <p>Memuat…</p>
        ) : (
          // Trusted: HTML authored by the site owner and bundled at build time.
          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t-2 border-dark pt-3">
          <a className="btn98" href={`/article/${article.slug}`} target="_blank" rel="noopener">Buka sebagai halaman</a>
          <button type="button" className="btn98" aria-pressed={done} onClick={onToggle}>
            {done ? '✓ Sudah selesai' : 'Tandai selesai'}
          </button>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <button type="button" className="btn98 min-w-0 truncate" disabled={!prev} onClick={() => prev && onGo(prev.slug)} title={prev?.title}>
          ← Sebelumnya
        </button>
        <button type="button" className="btn98 min-w-0 truncate" disabled={!next} onClick={() => next && onGo(next.slug)} title={next?.title}>
          Selanjutnya →
        </button>
      </div>
    </div>
  );
}

export default function ArticlesWindow() {
  const [filter, setFilter] = useState<Filter>('All');
  const [slug, setSlug] = useState<string | null>(null);
  const { done, toggle } = useDone();

  const current = articles.find((a) => a.slug === slug);
  if (current) {
    return <Reader article={current} done={done.includes(current.slug)} onToggle={() => toggle(current.slug)} onGo={setSlug} onBack={() => setSlug(null)} />;
  }

  const list = articles.filter((a) => filter === 'All' || a.series === filter);
  const doneCount = done.filter((s) => list.some((a) => a.slug === s)).length;

  return (
    <div className="flex h-full flex-col gap-1">
      <MenuBar />
      <p className="m-0 px-2">
        <strong>Belajar web dari nol.</strong> Mulai dari HTML Pelajaran 1, lalu lanjutkan berurutan. Setelah HTML selesai, lanjut ke CSS, lalu JavaScript.
      </p>
      <div role="group" aria-label="Filter seri" className="flex items-center gap-1">
        {FILTERS.map((f) => (
          <button key={f} type="button" className="btn98" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === 'All' ? 'Semua' : f === 'JS' ? 'JavaScript' : f}
          </button>
        ))}
        <span className="ml-auto text-muted">{doneCount}/{list.length} selesai</span>
      </div>
      <div aria-label="Daftar pelajaran" className="field98 min-h-0 flex-1 overflow-auto !bg-white !p-1">
        {list.map((a, i) => {
          const header = i === 0 || list[i - 1].series !== a.series || list[i - 1].stage !== a.stage;
          return (
            <div key={a.slug}>
              {header && (
                <h3 className="mx-0 mb-1 mt-3 bg-title px-2 py-1 text-[0.8125rem] font-bold leading-4 text-white first:mt-0">
                  {a.series === 'JS' ? 'JavaScript' : a.series} · {a.stage}
                </h3>
              )}
              <button
                type="button"
                onClick={() => setSlug(a.slug)}
                className="flex w-full items-start gap-2 border-0 bg-transparent p-1.5 text-left hover:bg-select hover:text-white focus-visible:bg-select focus-visible:text-white"
              >
                <span aria-hidden="true" className="w-6 shrink-0 text-right opacity-80">{a.lesson}.</span>
                <span className="flex-1">
                  <span className="block text-[0.9375rem]">{a.title.replace(/^[A-Za-z]+ \d+: /, '')}</span>
                  <span className="opacity-80">{a.level} · {a.readTime.replace('min read', 'menit')}</span>
                </span>
                {done.includes(a.slug) && <span aria-label="Sudah selesai">✓</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
