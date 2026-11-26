/** Renders every open window. Window contents are code-split and lazy-loaded. */
import { Suspense, lazy, useEffect, type ComponentType, type LazyExoticComponent } from 'react';
import { useStore } from '@nanostores/react';
import type { AppId } from '../data/apps';
import { $openOrder, openWindow } from '../stores/windowStore';
import Window from './Window';

const registry: Record<AppId, LazyExoticComponent<ComponentType>> = {
  welcome: lazy(() => import('./windows/WelcomeWindow')),
  chrome: lazy(() => import('./windows/ChromeWindow')),
  projects: lazy(() => import('./windows/ProjectsWindow')),
  articles: lazy(() => import('./windows/ArticlesWindow')),
  paint: lazy(() => import('./windows/PaintWindow')),
  camera: lazy(() => import('./windows/CameraWindow')),
  preferences: lazy(() => import('./windows/PreferencesWindow')),
  games: lazy(() => import('./windows/GamesWindow')),
  snake: lazy(() => import('./windows/SnakeWindow')),
  tetris: lazy(() => import('./windows/TetrisWindow')),
  recycle: lazy(() => import('./windows/RecycleBinWindow')),
};

export default function WindowLayer() {
  const order = useStore($openOrder);

  // Greet desktop visitors with the Welcome window (mobile starts on a clean desktop).
  useEffect(() => {
    if (window.innerWidth >= 768) openWindow('welcome');
  }, []);

  return (
    <>
      {order.map((id) => {
        const Content = registry[id];
        return (
          <Window key={id} id={id}>
            <Suspense fallback={<p className="p-4">Loading…</p>}>
              <Content />
            </Suspense>
          </Window>
        );
      })}
    </>
  );
}
