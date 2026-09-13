import AppIcon from './AppIcon.jsx';

export default function Dock({ apps, onOpen, onSwitcher }) {
  return <nav className="dock" aria-label="Dock">
    <div className="dock-favorites">
      {apps.map(app => <AppIcon key={app.id} app={app} onOpen={onOpen} size="dock" />)}
    </div>
    <span className="dock-divider" aria-hidden="true" />
    <button className="dock-switcher" onClick={onSwitcher} aria-label="Mostrar aplicaciones abiertas">
      <span className="dock-switcher-glyph"><i /><i /><i /></span>
    </button>
    <button className="dock-library" onClick={() => window.dispatchEvent(new CustomEvent('rainos-app-library'))} aria-label="Biblioteca de apps">▦</button>
  </nav>;
}
