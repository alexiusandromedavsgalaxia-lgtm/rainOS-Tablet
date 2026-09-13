export default function AppIcon({ app, onOpen }) {
  return <button className="app-icon" onClick={() => onOpen(app)} aria-label={`Abrir ${app.name}`}>
    <span className="icon-art">{app.glyph}</span>
    <span>{app.name}</span>
  </button>;
}
