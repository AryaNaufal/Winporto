/** Mini browser showing the main portfolio content. */
import { useRef, useState } from 'react';
import { prefersReducedMotion } from '../../stores/preferencesStore';
import { contact, education, experience, profile } from '../../data/portfolio';
import Glyph from '../Glyph';

const SECTIONS = [
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Professional Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

export default function ChromeWindow() {
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<SectionId | ''>('');


  
  const goTo = (id: SectionId) => {
    const box = scroller.current;
    const el = box?.querySelector<HTMLElement>(`#chrome-${id}`);
    if (!box || !el) return;
    box.scrollTo({ top: el.offsetTop - 64, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    setCurrent(id);
    el.focus({ preventScroll: true });
  };

  const toTop = () => {
    scroller.current?.scrollTo({ top: 0, behavior: 'auto' });
    setCurrent('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1">
        <button type="button" className="btn98 icon" aria-label="Back" onClick={toTop}>
          <Glyph name="back" />
        </button>
        <button type="button" className="btn98 icon" aria-label="Forward" disabled>
          <Glyph name="forward" />
        </button>
        <button type="button" className="btn98 icon" aria-label="Reload" onClick={toTop}>
          <Glyph name="reload" />
        </button>
        <div className="field98 min-w-0 flex-1 truncate" role="textbox" aria-readonly="true" aria-label="Address">
          http://{profile.domain}/{current && `#${current}`}
        </div>
      </div>

      {/* Page */}
      <div ref={scroller} className="field98 relative min-h-0 flex-1 overflow-auto !bg-paper !p-0">
        <header className="sticky top-0 z-10 border-b-4 border-title bg-paper px-4 py-2">
          <p className="font-pixel m-0 text-[11px] leading-5 text-title">{profile.name}</p>
          <nav aria-label="Portfolio sections" className="mt-1 flex flex-wrap gap-x-4">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(s.id)}
                aria-current={current === s.id ? 'true' : undefined}
                className="cursor-pointer border-0 bg-transparent p-0 text-title underline decoration-2 underline-offset-2 hover:bg-select hover:text-white aria-[current=true]:bg-select aria-[current=true]:text-white"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </header>

        <article className="px-5 pb-10 pt-4 text-[0.9375rem] leading-[1.3]">
          <h2 className="font-pixel m-0 text-lg leading-8">{profile.name}</h2>
          <p className="m-0 mb-5 text-[1.125rem] text-accent">{profile.role}</p>

          <section id="chrome-summary" tabIndex={-1} aria-labelledby="h-summary" className="mb-8 outline-none">
            <h3 id="h-summary" className="font-pixel mb-2 border-b-2 border-dark text-[11px] leading-6">Summary</h3>
            {profile.summary.map((p) => (
              <p key={p} className="my-2">{p}</p>
            ))}
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
              {profile.skills.map((s) => (
                <li key={s} className="chip">{s}</li>
              ))}
            </ul>
          </section>

          <section id="chrome-experience" tabIndex={-1} aria-labelledby="h-exp" className="mb-8 outline-none">
            <h3 id="h-exp" className="font-pixel mb-4 border-b-2 border-dark text-[11px] leading-6">Professional Experience</h3>
            <ol className="timeline">
              {experience.map((e) => (
                <li key={e.company + e.period}>
                  <p className="m-0 text-base">
                    <strong>{e.role}</strong> · {e.company}
                  </p>
                  <p className="m-0 text-muted">{e.period}</p>
                  <ul className="m-0 mt-1 list-disc pl-5">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section id="chrome-education" tabIndex={-1} aria-labelledby="h-edu" className="mb-8 outline-none">
            <h3 id="h-edu" className="font-pixel mb-4 border-b-2 border-dark text-[11px] leading-6">Education</h3>
            <ol className="timeline">
              {education.map((e) => (
                <li key={e.school}>
                  <p className="m-0 text-base">
                    <strong>{e.degree}</strong> · {e.school}
                  </p>
                  <p className="m-0 text-muted">{e.period}</p>
                  <p className="m-0 mt-1">{e.note}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="chrome-contact" tabIndex={-1} aria-labelledby="h-contact" className="outline-none">
            <h3 id="h-contact" className="font-pixel mb-2 border-b-2 border-dark text-[11px] leading-6">Contact</h3>
            <ul className="m-0 list-none space-y-1 p-0">
              <li>
                Email: <a className="text-title underline" href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              {contact.links.map((l) => (
                <li key={l.name}>
                  {l.name}: <a className="text-title underline" href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
      <div className="statusbar" aria-hidden="true">
        <span className="flex-1">Done</span>
        <span>Internet</span>
      </div>
    </div>
  );
}
