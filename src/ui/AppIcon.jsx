export default function AppIcon({ app, onOpen, size = 'normal', disabled = false }) {
  const handleOpen = () => { if (!disabled) onOpen(app); };
  return <button className={`app-icon app-icon-${size}`} onClick={handleOpen} disabled={disabled} aria-label={`Abrir ${app.name}`} title={app.name}>
    <span className="icon-art" aria-hidden="true">{app.glyph}</span>
    <span className="app-icon-name">{app.name}</span>
    {app.system && <span className="app-icon-badge" aria-label="Aplicación del sistema">•</span>}
  </button>;
}
