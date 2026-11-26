/** Registry of every "program" on the desktop: metadata only, no UI. */
export type AppId = 'welcome' | 'chrome' | 'projects' | 'articles' | 'paint' | 'camera' | 'recycle' | 'preferences' | 'games' | 'tetris' | 'snake';

/** Item type, used to arrange desktop icons (like "Arrange Icons by Type" in Windows 98). */
export type AppType = 'Application' | 'Document' | 'Folder' | 'System';

export interface AppDef {
  id: AppId;
  title: string;
  /** Short label under the desktop icon. */
  label: string;
  icon: string;
  type: AppType;
  /** Shown as a desktop icon (default true). Games open from the Games folder instead. */
  desktop?: boolean;
  /** Default window geometry (px) on desktop viewports. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export const APPS: Record<AppId, AppDef> = {
  welcome: { id: 'welcome', title: 'Welcome', label: 'Welcome', icon: '/icons/welcome.svg', type: 'Document', x: 150, y: 40, w: 580, h: 440 },
  chrome: { id: 'chrome', title: 'Google Chrome', label: 'Google Chrome', icon: '/icons/chrome.svg', type: 'Application', x: 200, y: 24, w: 760, h: 540 },
  projects: { id: 'projects', title: 'Projects', label: 'Projects', icon: '/icons/folder.svg', type: 'Folder', x: 180, y: 70, w: 560, h: 400 },
  articles: { id: 'articles', title: 'Articles', label: 'Articles', icon: '/icons/doc.svg', type: 'Document', x: 170, y: 30, w: 700, h: 500 },
  paint: { id: 'paint', title: 'untitled - Paint', label: 'Paint', icon: '/icons/paint.svg', type: 'Application', x: 160, y: 40, w: 660, h: 520 },
  camera: { id: 'camera', title: 'Camera', label: 'Camera', icon: '/icons/camera.svg', type: 'Application', x: 260, y: 56, w: 500, h: 500 },
  preferences: { id: 'preferences', title: 'Preferences', label: 'Preferences', icon: '/icons/settings.svg', type: 'Application', x: 280, y: 40, w: 520, h: 540 },
  games: { id: 'games', title: 'Games', label: 'Games', icon: '/icons/games.svg', type: 'Folder', x: 220, y: 60, w: 520, h: 360 },
  tetris: { id: 'tetris', title: 'Tetris', label: 'Tetris', icon: '/icons/tetris.svg', type: 'Application', desktop: false, x: 300, y: 10, w: 460, h: 640 },
  snake: { id: 'snake', title: 'Snake', label: 'Snake', icon: '/icons/snake.svg', type: 'Application', desktop: false, x: 320, y: 10, w: 500, h: 600 },
  recycle: { id: 'recycle', title: 'Recycle Bin', label: 'Recycle Bin', icon: '/icons/recycle.svg', type: 'System', x: 300, y: 90, w: 460, h: 360 },
};

export const APP_LIST: AppDef[] = Object.values(APPS);

const TYPE_ORDER: AppType[] = ['Application', 'Document', 'Folder', 'System'];

/** Desktop icons arranged by type, then alphabetically by label. */
export const DESKTOP_ORDER: AppId[] = APP_LIST.filter((a) => a.desktop !== false)
  .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || a.label.localeCompare(b.label))
  .map((a) => a.id);
