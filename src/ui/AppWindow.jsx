export default function AppWindow({ app, children, onClose }) {
  return (
    <div className="window-backdrop" onMouseDown={onClose}>
      <section className="app-window" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={app.name}>
        <header>
          <button onClick={onClose}>Listo</button>
          <strong>{app.name}</strong>
          <span />
        </header>
        <div className="window-content">{children}</div>
      </section>
    </div>
  );
}
