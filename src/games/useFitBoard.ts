/** Fits a cols x rows board into its wrapper using whole-pixel cell sizes (keeps pixel art crisp). */
import { useEffect, useRef, useState } from 'react';

export function useFitBoard(cols: number, rows: number, minCell = 12) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: cols * 20, h: rows * 20 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => {
      const cell = Math.max(minCell, Math.floor(Math.min(el.clientWidth / cols, el.clientHeight / rows)));
      setBox({ w: cell * cols, h: cell * rows });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cols, rows, minCell]);

  return { wrapRef, box };
}
