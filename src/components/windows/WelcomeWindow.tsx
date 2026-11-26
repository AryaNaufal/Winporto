/** "Windows 98 Web Edition" style welcome screen with tabs. */
import { useRef, useState, type KeyboardEvent } from 'react';
import { welcome } from '../../data/portfolio';
import { openWindow } from '../../stores/windowStore';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'accessibility', label: 'Accessibility' },
] as const;

export default function WelcomeWindow() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('overview');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Roving tabindex + arrow keys, per the WAI-ARIA tabs pattern.
  const onKeyDown = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = TABS.length - 1;
    else return;
    e.preventDefault();
    setTab(TABS[n].id);
    tabRefs.current[TABS[n].id]?.focus();
  };

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="flex items-center gap-3 bg-title p-3 text-white">
        <img src="/icons/welcome.svg" alt="" width={48} height={48} />
        <h3 className="m-0 text-base font-bold leading-5">{welcome.tagline}</h3>
      </div>

      <div className="marquee" aria-label={welcome.marquee}>
        <span className="marquee-track" aria-hidden="true">{welcome.marquee}</span>
      </div>

      <div role="tablist" aria-label="Welcome sections" className="flex gap-1 px-1" onKeyDown={onKeyDown}>
        {TABS.map((t) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[t.id] = el; }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className="btn98"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="field98 min-h-0 flex-1 overflow-auto !bg-paper !p-3 text-[0.9375rem] leading-[1.3]">
        {tab === 'overview' && (
          <>
            {welcome.overview.map((p) => (
              <p key={p} className="mb-2 mt-0">{p}</p>
            ))}
            <h4 className="my-3 text-sm font-bold leading-5">Tech stack</h4>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {welcome.stack.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-bold">{k}</dt>
                  <dd className="m-0">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn98" onClick={() => openWindow('chrome')}>Open Portfolio</button>
              <button type="button" className="btn98" onClick={() => openWindow('projects')}>View Projects</button>
              <button type="button" className="btn98" onClick={() => openWindow('paint')}>Play in Paint</button>
            </div>
          </>
        )}
        {tab === 'architecture' && (
          <>
            <p className="mt-0">Project structure, from content to pixels:</p>
            <ul className="m-0 list-none space-y-2 p-0">
              {welcome.architecture.map(([file, desc]) => (
                <li key={file}>
                  <code className="chip font-body">{file}</code> — {desc}
                </li>
              ))}
            </ul>
          </>
        )}
        {tab === 'accessibility' && (
          <>
            <p className="mt-0">Retro look, modern accessibility:</p>
            <ul className="m-0 list-disc space-y-1 pl-5">
              {welcome.accessibility.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
