/** Win98 "Date/Time Properties" style calendar, opened from the taskbar clock. */
import { useEffect, useMemo, useRef, useState } from 'react';
import Glyph from './Glyph';

const WEEKDAYS = [
  ['Su', 'Sunday'], ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'],
  ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday'],
] as const;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Weeks of a month as arrays of day numbers (null = empty cell). */
function buildWeeks(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

interface Props {
  onClose: () => void;
}

export default function CalendarPopup({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null);

  // Live clock in the footer.
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  // Focus on open, close on Escape or outside click.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('select')?.focus();
    const onDown = (e: Event) => {
      const t = e.target as HTMLElement;
      if (!ref.current?.contains(t) && !t.closest('[data-clock-button]')) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        document.querySelector<HTMLElement>('[data-clock-button]')?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const weeks = useMemo(() => buildWeeks(year, month), [year, month]);

  const shift = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected({ y: now.getFullYear(), m: now.getMonth(), d: now.getDate() });
  };

  const isToday = (d: number) => year === now.getFullYear() && month === now.getMonth() && d === now.getDate();
  const isSelected = (d: number) => selected?.y === year && selected.m === month && selected.d === d;

  return (
    <div ref={ref} role="dialog" aria-label="Calendar" className="dialog98">
      <div className="titlebar">
        <img src="/icons/calendar.svg" alt="" />
        <h2>Date/Time Properties</h2>
        <button type="button" className="btn98 icon" aria-label="Close calendar" onClick={onClose}>
          <Glyph name="close" size={1} />
        </button>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-1">
          <button type="button" className="btn98 icon" aria-label="Previous month" onClick={() => shift(-1)}>
            <Glyph name="back" size={1} />
          </button>
          <select aria-label="Month" className="field98 min-w-0 flex-1 !py-0.5" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <input
            aria-label="Year"
            type="number"
            min={1900}
            max={2100}
            className="field98 w-[5.5em] !py-0.5"
            value={year}
            onChange={(e) => {
              const y = Number(e.target.value);
              if (Number.isInteger(y) && y >= 1900 && y <= 2100) setYear(y);
            }}
          />
          <button type="button" className="btn98 icon" aria-label="Next month" onClick={() => shift(1)}>
            <Glyph name="forward" size={1} />
          </button>
        </div>

        <table className="field98 w-full border-collapse !bg-white !p-1 text-center" aria-label={`${MONTHS[month]} ${year}`}>
          <thead>
            <tr>
              {WEEKDAYS.map(([short, full]) => (
                <th key={short} scope="col" abbr={full} className="border-b border-shadow pb-1 text-xs font-bold">
                  {short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((d, di) => (
                  <td key={di} className="p-0">
                    {d && (
                      <button
                        type="button"
                        aria-pressed={isSelected(d)}
                        aria-current={isToday(d) ? 'date' : undefined}
                        aria-label={`${MONTHS[month]} ${d}, ${year}`}
                        onClick={() => setSelected({ y: year, m: month, d })}
                        className={`h-7 w-full border-0 bg-transparent p-0 aria-pressed:bg-select aria-pressed:text-white ${isToday(d) ? 'outline outline-1 -outline-offset-1 outline-[#800000] font-bold' : ''}`}
                      >
                        {d}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="m-0 font-bold">{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</p>
            <p className="m-0 text-muted">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button type="button" className="btn98" onClick={goToday}>Today</button>
        </div>
      </div>
    </div>
  );
}
