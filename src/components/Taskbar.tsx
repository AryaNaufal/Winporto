/** Bottom taskbar: Start button, one button per open window, clock tray. */
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { APPS } from '../data/apps';
import { $activeId, $openOrder, $startOpen, toggleFromTaskbar } from '../stores/windowStore';
import { $prefs, DATE_FORMATS, hydratePrefs } from '../stores/preferencesStore';
import StartMenu from './StartMenu';
import ShutdownScreen from './ShutdownScreen';
import CalendarPopup from './CalendarPopup';

/** Real-time 12-hour clock. Renders empty on the server to avoid hydration mismatch. */
function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  const { clock24, dateFormat } = useStore($prefs);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const text = now ? now.toLocaleTimeString('en-US', { hour: clock24 ? '2-digit' : 'numeric', minute: '2-digit', hour12: !clock24 }) : '';
  // Format chosen in Preferences; hidden on very narrow screens to leave room for taskbar buttons
  const date = now ? DATE_FORMATS[dateFormat].format(now) : '';
  return (
    <time dateTime={now?.toISOString()} className="flex items-center gap-2 whitespace-nowrap text-right">
      {date && <span className="hidden min-[420px]:inline">{date}</span>}
      <span className="min-w-[5.5ch]">{text}</span>
    </time>
  );
}

export default function Taskbar() {
  const order = useStore($openOrder);
  const active = useStore($activeId);
  const startOpen = useStore($startOpen);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Load saved preferences once on the client (after hydration, so markup matches the server).
  useEffect(() => {
    hydratePrefs();
  }, []);

  return (
    <>
      {startOpen && <StartMenu />}
      {calendarOpen && <CalendarPopup onClose={() => setCalendarOpen(false)} />}
      <nav className="taskbar" aria-label="Taskbar">
        <button
          type="button"
          data-start-button
          className="btn98 gap-1 !px-2 font-bold"
          aria-pressed={startOpen}
          aria-expanded={startOpen}
          aria-controls="start-menu"
          aria-haspopup="menu"
          onClick={() => $startOpen.set(!startOpen)}
        >
          <img src="/icons/start.svg" alt="" width={20} height={20} />
          Start
        </button>
        <div className="w-0.5 self-stretch bg-shadow shadow-[1px_0_0_var(--color-light)]" aria-hidden="true" />
        {order.map((id) => (
          <button
            key={id}
            type="button"
            className="btn98 task-btn"
            aria-pressed={active === id}
            title={APPS[id].title}
            onClick={() => toggleFromTaskbar(id)}
          >
            <img src={APPS[id].icon} alt="" />
            <span>{APPS[id].title}</span>
          </button>
        ))}
        <div className="tray" role="group" aria-label="System tray">
          <img src="/icons/flag.svg" alt="" width={16} height={16} />
          <span className="tray-lang" title="Language: English">EN</span>
          <button
            type="button"
            data-clock-button
            className="border-0 bg-transparent p-0"
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            title="Show calendar"
            onClick={() => {
              $startOpen.set(false);
              setCalendarOpen((v) => !v);
            }}
          >
            <Clock />
          </button>
        </div>
      </nav>
      <ShutdownScreen />
    </>
  );
}
