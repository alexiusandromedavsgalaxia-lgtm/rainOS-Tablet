import { useEffect, useRef } from 'react';

export default function AppWindow({ app, children, onClose, mode = 'window', onToggleMode, onOpenStageManager }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); const onKeyDown=e=>{if(e.key==='Escape')onClose()}; window.addEventListener('keydown',onKeyDown); return()=>window.removeEventListener('keydown',onKeyDown); },[onClose]);
  return <div className={`window-backdrop window-mode-${mode}`}>
    <section className="app-window" onMouseDown={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={app.name}>
      <header className="app-window-toolbar">
        <div className="window-controls"><button ref={closeRef} className="window-control close" onClick={onClose} aria-label="Cerrar"/><button className="window-control minimize" onClick={onToggleMode} aria-label="Pantalla completa"/><button className="window-control expand" onClick={onToggleMode} aria-label="Cambiar tamaño"/></div>
        <div className="window-title"><span className={`window-title-icon icon-art icon-art-${app.id}`}/><strong>{app.name}</strong></div>
        <div className="window-actions"><button className="window-action" onClick={onOpenStageManager} aria-label="Organizador Visual">▦</button><button className="window-action" onClick={onToggleMode} aria-label="Pantalla completa">↗</button></div>
      </header>
      <div className="window-content">{children}</div><div className="window-resize-handle" aria-hidden="true"/>
    </section>
  </div>;
}
