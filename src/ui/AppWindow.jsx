import { useEffect, useRef } from 'react';

export default function AppWindow({ app, children, onClose, mode = 'fullscreen', onToggleMode, onOpenStageManager }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = event => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return <div className={`window-backdrop window-mode-${mode}`}>
    <section className="app-window" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={app.name}>
      <header className="app-window-toolbar">
        <button ref={closeRef} className="window-done" onClick={onClose}>Listo</button>
        <div className="window-title"><span className={`window-title-icon icon-art icon-art-${app.id}`} /><strong>{app.name}</strong></div>
        <div className="window-actions">
          <button className="window-action" onClick={onOpenStageManager} aria-label="Organizador Visual">▦</button>
          <button className="window-action" onClick={onToggleMode} aria-label={mode === 'window' ? 'Pantalla completa' : 'Ventana'}>{mode === 'window' ? '↗' : '↙'}</button>
          <button className="window-more" aria-label="Más opciones">•••</button>
        </div>
      </header>
      <div className="window-content">{children}</div>
    </section>
  </div>;
}
