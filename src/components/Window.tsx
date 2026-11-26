/** Generic window: title bar (drag, buttons), focus handling, keyboard close. */
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from 'react';
import { useStore } from '@nanostores/react';
import { APPS, type AppId } from '../data/apps';
import { $activeId, $windows, closeWindow, focusWindow, minimizeWindow, moveWindow, toggleMaximize } from '../stores/windowStore';
import Glyph from './Glyph';

interface Props {
  id: AppId;
  children: ReactNode;
}

export default function Window({ id, children }: Props) {
  const win = useStore($windows)[id];
  const active = useStore($activeId) === id;
  const def = APPS[id];
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const [closing, setClosing] = useState(false);

  // Move keyboard focus into the window when it becomes active (unless focus is already inside).
  useEffect(() => {
    const el = ref.current;
    if (active && el && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
  }, [active]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => closeWindow(id), 140);
  };

  const onTitleDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || win.maximized || (e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
  };
  const onTitleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) moveWindow(id, e.clientX - drag.current.dx, e.clientY - drag.current.dy);
  };
  const onTitleUp = () => {
    drag.current = null;
  };

  const cls = ['win', active && 'is-active', win.minimized && 'is-min', win.maximized && 'is-max', closing && 'is-closing']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={def.title}
      tabIndex={-1}
      className={cls}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onPointerDownCapture={() => focusWindow(id)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !e.defaultPrevented) requestClose();
      }}
    >
      <div
        className="titlebar"
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onPointerCancel={onTitleUp}
        onDoubleClick={() => toggleMaximize(id)}
      >
        <img src={def.icon} alt="" />
        <h2>{def.title}</h2>
        <button type="button" className="btn98 icon" aria-label={`Minimize ${def.title}`} onClick={() => minimizeWindow(id)}>
          <Glyph name="minimize" size={1} />
        </button>
        <button type="button" className="btn98 icon btn-max" aria-label={win.maximized ? `Restore ${def.title}` : `Maximize ${def.title}`} onClick={() => toggleMaximize(id)}>
          <Glyph name={win.maximized ? 'restore' : 'maximize'} size={1} />
        </button>
        <button type="button" className="btn98 icon" aria-label={`Close ${def.title}`} onClick={requestClose}>
          <Glyph name="close" size={1} />
        </button>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}
