/** Games shown in the Games window. To add one: create its window, register it in apps.ts, then list it here. */
import type { AppId } from './apps';

export interface GameDef {
  /** Window to open when played; also the key for best scores. */
  app: AppId;
  scoreKey: string;
  name: string;
  icon: string;
  description: string;
  controls: [keys: string, action: string][];
}

export const GAMES: GameDef[] = [
  {
    app: 'snake',
    scoreKey: 'snake',
    name: 'Snake',
    icon: '/icons/snake.svg',
    description: 'Eat the red blocks to grow longer, but do not hit the walls or your own tail. The snake speeds up every 5 blocks.',
    controls: [
      ['Arrows or WASD', 'Turn'],
      ['Swipe', 'Turn (touch)'],
      ['Space or P', 'Pause'],
      ['Enter', 'New game'],
    ],
  },
  {
    app: 'tetris',
    scoreKey: 'tetris',
    name: 'Tetris',
    icon: '/icons/tetris.svg',
    description: 'Stack falling blocks into complete rows to clear them. The game speeds up every 10 lines.',
    controls: [
      ['← →', 'Move'],
      ['↑ or X', 'Rotate'],
      ['Z', 'Rotate back'],
      ['↓', 'Soft drop'],
      ['Space', 'Hard drop'],
      ['P or Esc', 'Pause'],
    ],
  },
];
