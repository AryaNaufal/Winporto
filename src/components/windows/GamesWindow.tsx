/** Games folder: pick a game, read how to play, launch it. */
import { useEffect, useState } from 'react';
import { GAMES } from '../../data/games';
import { getBest } from '../../games/scores';
import { openWindow } from '../../stores/windowStore';
import MenuBar from '../MenuBar';

export default function GamesWindow() {
  const [selectedId, setSelectedId] = useState(GAMES[0].app);
  const [best, setBest] = useState(0);
  const game = GAMES.find((g) => g.app === selectedId) ?? GAMES[0];

  useEffect(() => setBest(getBest(game.scoreKey)), [game.scoreKey]);

  return (
    <div className="flex h-full flex-col">
      <MenuBar items={['File', 'Edit', 'View', 'Help']} />
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-1 sm:flex-row">
        <ul aria-label="Games" className="field98 m-0 min-h-0 list-none overflow-auto !bg-white !p-1 sm:w-[40%]">
          {GAMES.map((g) => (
            <li key={g.app}>
              <button
                type="button"
                aria-pressed={selectedId === g.app}
                onClick={() => setSelectedId(g.app)}
                onDoubleClick={() => openWindow(g.app)}
                className="flex w-full items-center gap-2 border-0 bg-transparent p-1 text-left aria-pressed:bg-select aria-pressed:text-white"
              >
                <img src={g.icon} alt="" width={32} height={32} />
                <span className="truncate">{g.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <section aria-live="polite" aria-label="Game details" className="field98 min-h-0 flex-1 overflow-auto !bg-paper !p-3">
          <h3 className="mt-0 text-base font-bold">{game.name}</h3>
          <p className="my-2">{game.description}</p>
          <p className="my-2 text-muted">Best score: <strong>{best}</strong></p>
          <table className="mb-3 border-collapse">
            <caption className="sr-only">Controls</caption>
            <tbody>
              {game.controls.map(([keys, action]) => (
                <tr key={keys}>
                  <th scope="row" className="pr-4 text-left font-bold">{keys}</th>
                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn98 font-bold" onClick={() => openWindow(game.app)}>Play {game.name}</button>
        </section>
      </div>
      <div className="statusbar" aria-hidden="true">
        <span className="flex-1">{GAMES.length} object(s)</span>
        <span>Double-click to play</span>
      </div>
    </div>
  );
}
