import AppIcon from './AppIcon.jsx';

export default function AppSwitcher({ apps, activeId, onFocus, onClose, onDismiss }) {
  return <aside className="app-switcher" aria-label="Selector de aplicaciones">
    <header className="app-switcher-header">
      <div><span className="app-switcher-kicker">rainOS</span><h2>Aplicaciones abiertas</h2></div>
      <button onClick={onDismiss} aria-label="Cerrar selector">×</button>
    </header>
    {apps.length === 0 ? <div className="switcher-empty"><b>No hay aplicaciones abiertas</b><span>Las apps que abras aparecerán aquí.</span></div> : <div className="app-switcher-grid">
      {apps.map(app => <article key={app.id} className={activeId === app.id ? 'active' : ''}>
        <button className="switcher-preview" onClick={() => onFocus(app.id)} aria-label={`Abrir ${app.name}`}>
          <div className="switcher-window-preview"><AppIcon app={app} size="small" disabled /></div>
          <strong>{app.name}</strong>
        </button>
        <button className="switcher-close" onClick={() => onClose(app.id)} aria-label={`Cerrar ${app.name}`}>×</button>
      </article>)}
    </div>}
  </aside>;
}
