/** Folder-style list of projects with a details pane. */
import { useState } from 'react';
import { projects } from '../../data/portfolio';
import MenuBar from '../MenuBar';
export default function ProjectsWindow() {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  return (
    <div className="flex h-full flex-col">
      <MenuBar />
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-1 sm:flex-row">
        <ul aria-label="Project files" className="field98 m-0 min-h-0 list-none overflow-auto !bg-white !p-1 sm:w-[45%]">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={selectedId === p.id}
                onClick={() => setSelectedId(p.id)}
                className="flex w-full items-center gap-2 border-0 bg-transparent p-1 text-left aria-pressed:bg-select aria-pressed:text-white"
              >
                <img src="/icons/folder.svg" alt="" width={32} height={32} />
                <span className="truncate">{p.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <section aria-live="polite" aria-label="Project details" className="field98 min-h-0 flex-1 overflow-auto !bg-paper !p-3">
          <h3 className="mt-0 text-base font-bold leading-5">{selected.name}</h3>
          <p className="my-1 text-muted">
            {selected.kind}
          </p>
          <p className="my-2">{selected.description}</p>
          <ul className="m-0 mb-3 flex list-none flex-wrap gap-2 p-0">
            {selected.stack.map((s) => (
              <li key={s} className="chip">{s}</li>
            ))}
          </ul>
          {selected.url ? (
            <a className="btn98" href={selected.url} target="_blank" rel="noopener noreferrer">
              Open project
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="text-muted">Private project — ask me about it!</span>
          )}
        </section>
      </div>
      <div className="statusbar" aria-hidden="true">
        <span className="flex-1">{projects.length} object(s)</span>
        <span>My Computer</span>
      </div>
    </div>
  );
}
