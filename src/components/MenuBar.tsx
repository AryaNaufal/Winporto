/** Decorative Win98 menu bar ("File Edit View Help"). Purely visual, so hidden from assistive tech. */
export default function MenuBar({ items = ['File', 'Edit', 'View', 'Help'] }: { items?: string[] }) {
  return (
    <div aria-hidden="true" className="flex gap-0.5 border-b border-shadow px-1 py-0.5 shadow-[0_1px_0_var(--color-light)]">
      {items.map((label) => (
        <span key={label} className="px-1.5">
          <u>{label[0]}</u>
          {label.slice(1)}
        </span>
      ))}
    </div>
  );
}
