/**
 * User preferences (nanostores + localStorage). Visual preferences are applied through
 * CSS variables and data-attributes on <html>, and a snapshot of that is stored so the
 * inline script in Layout.astro can restore them before first paint (no flash).
 */
import { map } from 'nanostores';

export const WALLPAPERS = {
  classic: { label: 'Classic Teal', color: '#008080' },
  periwinkle: { label: 'Periwinkle', color: '#6b6fa8' },
  teal: { label: 'Teal', color: '#3f7f86' },
  forest: { label: 'Forest', color: '#4f7a57' },
  plum: { label: 'Plum', color: '#7a5a8c' },
  slate: { label: 'Slate', color: '#56627a' },
  night: { label: 'Night', color: '#232a44' },
} as const;

export const TITLE_COLORS = {
  navy: { label: 'Classic Blue', color: '#000080', end: '#1084d0' },
  forest: { label: 'Forest', color: '#1f5a3a', end: '#4f9f6f' },
  maroon: { label: 'Maroon', color: '#800000', end: '#d04a4a' },
} as const;

export const BACKGROUNDS = {
  solid: 'Solid color',
  clouds: 'Clouds',
  stars: 'Stars',
  grid: 'Grid',
  checker: 'Checker',
  custom: 'My picture',
} as const;

/** Taskbar date formats; `format` renders a Date. */
export const DATE_FORMATS = {
  numeric: { label: '22/11/2026', format: (d: Date) => d.toLocaleDateString('en-GB') },
  short: { label: '22 Nov 2026', format: (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
  weekday: { label: 'Sun, 22 Nov', format: (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) },
  hidden: { label: 'Hide date', format: () => '' },
} as const;

export const FONT_SIZES = { small: 14, normal: 16, large: 19 } as const;

export type WallpaperKey = keyof typeof WALLPAPERS;
export type BackgroundKey = keyof typeof BACKGROUNDS;
export type TitleKey = keyof typeof TITLE_COLORS;
export type FontSizeKey = keyof typeof FONT_SIZES;
export type DateFormatKey = keyof typeof DATE_FORMATS;
export type MotionPref = 'system' | 'reduce' | 'full';

export interface Prefs {
  background: BackgroundKey;
  wallpaper: WallpaperKey;
  pattern: boolean;
  titleColor: TitleKey;
  fontSize: FontSizeKey;
  motion: MotionPref;
  customCursor: boolean;
  clippy: boolean;
  clock24: boolean;
  dateFormat: DateFormatKey;
}

export const DEFAULT_PREFS: Prefs = {
  background: 'solid',
  wallpaper: 'classic',
  pattern: false,
  titleColor: 'navy',
  fontSize: 'normal',
  motion: 'system',
  customCursor: true,
  clippy: true,
  clock24: false,
  dateFormat: 'numeric',
};

const KEY = 'winporto:prefs';
const DOM_KEY = 'winporto:prefs-dom'; // read by the inline script in Layout.astro
const IMAGE_KEY = 'winporto:bg-image'; // custom background (data URL), read by the same script

/** Starts at defaults so server and first client render match; call hydratePrefs() after mount. */
export const $prefs = map<Prefs>({ ...DEFAULT_PREFS });

/** Keep only valid values from storage, falling back to defaults per field. */
function sanitize(raw: unknown): Prefs {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
    allowed.includes(v as T) ? (v as T) : fallback;
  const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
  return {
    background: pick(r.background, Object.keys(BACKGROUNDS) as BackgroundKey[], DEFAULT_PREFS.background),
    wallpaper: pick(r.wallpaper, Object.keys(WALLPAPERS) as WallpaperKey[], DEFAULT_PREFS.wallpaper),
    pattern: bool(r.pattern, DEFAULT_PREFS.pattern),
    titleColor: pick(r.titleColor, Object.keys(TITLE_COLORS) as TitleKey[], DEFAULT_PREFS.titleColor),
    fontSize: pick(r.fontSize, Object.keys(FONT_SIZES) as FontSizeKey[], DEFAULT_PREFS.fontSize),
    motion: pick(r.motion, ['system', 'reduce', 'full'] as const, DEFAULT_PREFS.motion),
    customCursor: bool(r.customCursor, DEFAULT_PREFS.customCursor),
    clippy: bool(r.clippy, DEFAULT_PREFS.clippy),
    clock24: bool(r.clock24, DEFAULT_PREFS.clock24),
    dateFormat: pick(r.dateFormat, Object.keys(DATE_FORMATS) as DateFormatKey[], DEFAULT_PREFS.dateFormat),
  };
}

/** The uploaded background picture, if any. */
export function getCustomImage(): string | null {
  try {
    return localStorage.getItem(IMAGE_KEY);
  } catch {
    return null;
  }
}

/** Returns false when the browser refuses to store it (quota / private mode). */
export function saveCustomImage(dataUrl: string): boolean {
  try {
    localStorage.setItem(IMAGE_KEY, dataUrl);
    return true;
  } catch {
    return false;
  }
}

export function removeCustomImage() {
  try {
    localStorage.removeItem(IMAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Apply visual preferences to <html> and store a snapshot for the pre-paint script. */
export function applyPrefs(p: Prefs) {
  const root = document.documentElement;
  // "My picture" without a stored picture falls back to the solid color.
  const image = p.background === 'custom' ? getCustomImage() : null;
  const bg = p.background === 'custom' && !image ? 'solid' : p.background;
  const snapshot = {
    vars: { '--color-wall': WALLPAPERS[p.wallpaper].color, '--color-title': TITLE_COLORS[p.titleColor].color, '--color-title-end': TITLE_COLORS[p.titleColor].end },
    fontSize: `${FONT_SIZES[p.fontSize]}px`,
    data: {
      bg,
      motion: p.motion,
      cursor: p.customCursor ? 'pixel' : 'system',
      pattern: p.pattern ? 'on' : 'off',
      clippy: p.clippy ? 'on' : 'off',
    },
  };
  for (const [k, v] of Object.entries(snapshot.vars)) root.style.setProperty(k, v);
  root.style.fontSize = snapshot.fontSize;
  if (image) root.style.setProperty('--wall-image', `url("${image}")`);
  else root.style.removeProperty('--wall-image');
  for (const [k, v] of Object.entries(snapshot.data)) root.dataset[k] = v;
  try {
    localStorage.setItem(DOM_KEY, JSON.stringify(snapshot));
  } catch {
    /* storage unavailable: preferences just won't persist */
  }
}

function persist(p: Prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

/** Load saved preferences into the store and apply them. Call once after mount. */
export function hydratePrefs() {
  let saved: unknown = null;
  try {
    saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
  } catch {
    /* corrupted or unavailable: use defaults */
  }
  const prefs = sanitize(saved);
  $prefs.set(prefs);
  applyPrefs(prefs);
}

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  const next = { ...$prefs.get(), [key]: value };
  $prefs.set(next);
  applyPrefs(next);
  persist(next);
}

export function resetPrefs() {
  const next = { ...DEFAULT_PREFS };
  $prefs.set(next);
  applyPrefs(next);
  persist(next);
}

/** True when animations should be avoided (user setting, else the OS setting). */
export function prefersReducedMotion(): boolean {
  const m = $prefs.get().motion;
  if (m !== 'system') return m === 'reduce';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
