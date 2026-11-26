/** Fake shutdown sequence. Any key or click "reboots" back to the desktop. */
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $shutdown, restart } from '../stores/windowStore';

export default function ShutdownScreen() {
  const state = useStore($shutdown);

  useEffect(() => {
    if (state !== 'off') return;
    const onKey = () => restart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state]);

  if (state === 'none') return null;

  return (
    <div className={`shutdown ${state === 'closing' ? 'closing' : ''}`} role="alertdialog" aria-live="assertive" aria-label="Shutting down">
      {state === 'closing' ? (
        <p>Please wait while your portfolio shuts down…</p>
      ) : (
        <>
          <p>It&apos;s now safe to turn off your computer.</p>
          <p style={{ fontSize: 10 }}>(…or just kidding.)</p>
          <button type="button" className="btn98 blink" autoFocus onClick={restart}>
            Press any key to restart
          </button>
        </>
      )}
    </div>
  );
}
