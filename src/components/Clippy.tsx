/** Clippy-style assistant: speech bubble with resume link, random tips on click. */
import { useEffect, useState } from 'react';
import { clippy, site } from '../data/portfolio';

export default function Clippy() {
  const [message, setMessage] = useState<string | null>(null);
  const [greeting, setGreeting] = useState(true);
  const [visible, setVisible] = useState(false);

  // Appear shortly after load so it doesn't compete with first paint.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setMessage(clippy.greeting);
      setVisible(true);
    }, 1200);
    return () => window.clearTimeout(t);
  }, []);

  const showTip = () => {
    const tips = clippy.tips.filter((t) => t !== message);
    setMessage(tips[Math.floor(Math.random() * tips.length)]);
    setGreeting(false);
    setVisible(true);
  };

  return (
    <aside className="clippy" aria-label="Clippy assistant">
      {visible && message && (
        <div className="bubble" role="status" aria-live="polite">
          <button
            type="button"
            className="btn98 icon absolute right-1 top-1 !min-h-5 !min-w-5 text-base leading-none"
            aria-label="Close speech bubble"
            onClick={() => setVisible(false)}
          >
            ×
          </button>
          <p className="m-0 pr-6">{message}</p>
          {greeting && (
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="btn98" href={site.resume} target="_blank" rel="noopener">
                Show Resume
              </a>
              <button type="button" className="btn98" onClick={showTip}>
                Tip, please
              </button>
            </div>
          )}
        </div>
      )}
      <button type="button" className="clippy-char" aria-label="Clippy: show me a tip" onClick={showTip}>
        <img src="/icons/clippy.svg" alt="" />
      </button>
    </aside>
  );
}
