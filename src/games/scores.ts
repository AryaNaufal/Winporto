/** Per-game best scores, kept in localStorage (fails soft when storage is unavailable). */
const key = (game: string) => `winporto:best:${game}`;

export function getBest(game: string): number {
  try {
    const n = Number(localStorage.getItem(key(game)));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** Saves the score if it beats the stored best; returns the best score. */
export function submitScore(game: string, score: number): number {
  const best = getBest(game);
  if (score <= best) return best;
  try {
    localStorage.setItem(key(game), String(score));
  } catch {
    /* ignore: the score just won't persist */
  }
  return score;
}
