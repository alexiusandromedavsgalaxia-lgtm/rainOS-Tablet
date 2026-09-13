export default function Dock({ apps, onOpen }) {
  return <nav className="dock" aria-label="Dock">{apps.map(app => <button key={app.id} aria-label={app.name} onClick={() => onOpen(app)}>{app.glyph}</button>)}</nav>;
}
