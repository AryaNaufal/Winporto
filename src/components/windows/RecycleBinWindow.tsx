/** Easter-egg window: you cannot empty the bin. */
import { useState } from 'react';
import { recycleBin } from '../../data/portfolio';
import MenuBar from '../MenuBar';

export default function RecycleBinWindow() {
  const [attempts, setAttempts] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const note = recycleBin.items.find((i) => i.name === selected)?.note;
  const reply = attempts > 0 ? recycleBin.emptyReplies[(attempts - 1) % recycleBin.emptyReplies.length] : null;

  return (
    <div className="flex h-full flex-col gap-2">
      <MenuBar />
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <button type="button" className="btn98" onClick={() => setAttempts((n) => n + 1)}>
          Empty Recycle Bin
        </button>
        <button type="button" className="btn98" disabled={!selected} onClick={() => setAttempts((n) => n + 1)}>
          Restore
        </button>
      </div>

      <ul aria-label="Deleted files" className="field98 m-0 min-h-0 flex-1 list-none overflow-auto !bg-white !p-1">
        {recycleBin.items.map((i) => (
          <li key={i.name}>
            <button
              type="button"
              aria-pressed={selected === i.name}
              onClick={() => setSelected(i.name)}
              className="flex w-full items-center gap-2 border-0 bg-transparent p-1 text-left aria-pressed:bg-select aria-pressed:text-white"
            >
              <img src="/icons/doc.svg" alt="" width={24} height={24} />
              <span className="flex-1 truncate">{i.name}</span>
              <span className="opacity-80">{i.size}</span>
            </button>
          </li>
        ))}
      </ul>

      <p role="status" className="field98 m-0 min-h-[3.2em] !bg-bubble">
        {reply ?? note ?? 'Select a file to see why it was deleted.'}
      </p>
      </div>
    </div>
  );
}
