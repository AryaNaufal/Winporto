/** Pop-up Start menu: program list, resume link and Shut Down. */
import { useEffect, useRef } from 'react';
import { APPS, type AppId } from '../data/apps';
import { site } from '../data/portfolio';
import { $startOpen, openWindow, shutDown } from '../stores/windowStore';

const PROGRAMS: AppId[] = ['welcome', 'chrome', 'projects', 'articles', 'paint', 'camera', 'games', 'preferences', 'recycle'];

export default function StartMenu() {
  const ref = useRef<HTMLDivElement>(null);

  // Focus the first item for keyboard users; close on outside click or Escape.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('.start-item')?.focus();
    const onDown = (e: Event) => {
      const t = e.target as HTMLElement;
      if (!ref.current?.contains(t) && !t.closest('[data-start-button]')) $startOpen.set(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        $startOpen.set(false);
        document.querySelector<HTMLElement>('[data-start-button]')?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Arrow-key navigation between items.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const items = [...(ref.current?.querySelectorAll<HTMLElement>('.start-item') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
    e.preventDefault();
  };

  return (
    <div ref={ref} id="start-menu" className="start-menu" role="menu" aria-label="Start menu" onKeyDown={onKeyDown}>
      <div className="start-banner" aria-hidden="true">
        Portfolio 98
      </div>
      <ul className="start-items">
        {PROGRAMS.map((id) => (
          <li key={id} role="none">
            <button type="button" role="menuitem" className="start-item" onClick={() => openWindow(id)}>
              <img src={APPS[id].icon} alt="" />
              {APPS[id].label}
            </button>
          </li>
        ))}
        <li role="none">
          <a role="menuitem" className="start-item" href={site.resume} target="_blank" rel="noopener" onClick={() => $startOpen.set(false)}>
            <img src="/icons/doc.svg" alt="" />
            Resume (PDF)
          </a>
        </li>
        <li role="separator" className="start-sep" />
        <li role="none">
          <button type="button" role="menuitem" className="start-item" onClick={shutDown}>
            <img src="/icons/welcome.svg" alt="" />
            Shut Down…
          </button>
        </li>
      </ul>
    </div>
  );
}
