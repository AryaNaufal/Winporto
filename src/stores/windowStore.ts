/**
 * Window manager state (nanostores): which windows are open, minimized,
 * maximized, where they are and who is on top. UI-agnostic on purpose.
 */
import { atom, computed, map } from 'nanostores';
import { APPS, APP_LIST, type AppId } from '../data/apps';

export const TASKBAR_H = 34;
const MIN_VISIBLE = 80; // px of a window that must stay on screen while dragging

export interface WinState {
  id: AppId;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
}

const initial = Object.fromEntries(
  APP_LIST.map((a) => [a.id, { id: a.id, open: false, minimized: false, maximized: false, x: a.x, y: a.y, w: a.w, h: a.h, z: 0 }]),
) as Record<AppId, WinState>;

export const $windows = map<Record<AppId, WinState>>(initial);
/** Windows in the order they were opened (drives the taskbar). */
export const $openOrder = atom<AppId[]>([]);
export const $startOpen = atom(false);
export const $shutdown = atom<'none' | 'closing' | 'off'>('none');

/** Topmost open, non-minimized window. */
export const $activeId = computed($windows, (ws) => {
  let top: WinState | null = null;
  for (const w of Object.values(ws)) {
    if (w.open && !w.minimized && (!top || w.z > top.z)) top = w;
  }
  return top ? top.id : null;
});

let zCounter = 10;
const nextZ = () => ++zCounter;
const patch = (id: AppId, p: Partial<WinState>) => $windows.setKey(id, { ...$windows.get()[id], ...p });
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function openWindow(id: AppId) {
  $startOpen.set(false);
  const cur = $windows.get()[id];
  if (cur.open) return focusWindow(id);

  const def = APPS[id];
  const vw = window.innerWidth;
  const vh = window.innerHeight - TASKBAR_H;
  const w = Math.min(def.w, vw - 16);
  const h = Math.min(def.h, vh - 16);
  const cascade = ($openOrder.get().length % 5) * 28; // stagger so windows don't stack exactly
  patch(id, {
    open: true,
    minimized: false,
    maximized: false,
    w,
    h,
    x: clamp(def.x + cascade, 0, Math.max(0, vw - w)),
    y: clamp(def.y + cascade, 0, Math.max(0, vh - h)),
    z: nextZ(),
  });
  $openOrder.set([...$openOrder.get(), id]);
}

export function closeWindow(id: AppId) {
  patch(id, { open: false, minimized: false, maximized: false });
  $openOrder.set($openOrder.get().filter((x) => x !== id));
}

export function focusWindow(id: AppId) {
  $startOpen.set(false);
  const w = $windows.get()[id];
  if (!w.open) return;
  if (w.minimized || $activeId.get() !== id) patch(id, { minimized: false, z: nextZ() });
}

export function minimizeWindow(id: AppId) {
  patch(id, { minimized: true });
}

export function toggleMaximize(id: AppId) {
  patch(id, { maximized: !$windows.get()[id].maximized });
}

export function moveWindow(id: AppId, x: number, y: number) {
  const w = $windows.get()[id];
  patch(id, {
    x: clamp(x, MIN_VISIBLE - w.w, window.innerWidth - MIN_VISIBLE),
    y: clamp(y, 0, window.innerHeight - TASKBAR_H - 32),
  });
}

/** Taskbar button behaviour: minimize if active, otherwise restore + focus. */
export function toggleFromTaskbar(id: AppId) {
  if ($activeId.get() === id) minimizeWindow(id);
  else focusWindow(id);
}

export function shutDown() {
  $startOpen.set(false);
  $shutdown.set('closing');
  window.setTimeout(() => $shutdown.set('off'), 2200);
}

export function restart() {
  for (const id of [...$openOrder.get()]) closeWindow(id);
  $shutdown.set('none');
}
