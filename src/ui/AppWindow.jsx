import { useEffect, useRef } from 'react';

export default function AppWindow({ app, children, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="window-backdrop" onMouseDown={onClose}>
      <section className="app-window" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={app.name}>
        <header className="app-window-toolbar">
          <button ref={closeRef} className="window-done" onClick={onClose}>Listo</button>
          <div className="window-title"><span className="window-title-dot" />{app.name}</div>
          <button className="window-more" aria-label="Más opciones">•••</button>
        </header>
        <div className="window-content">{children}</div>
      </section>
    </div>
  );
}
