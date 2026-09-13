import AppIcon from './AppIcon.jsx';

export default function Dock({ apps, onOpen, onSwitcher }) {
  return (
    <nav className="dock" aria-label="Dock">
      <div className="dock-favorites" aria-label="Apps favoritas">
        {apps.map(app => <AppIcon key={app.id} app={app} onOpen={onOpen} size="dock" />)}
      </div>
      <span className="dock-divider" aria-hidden="true" />
      <div className="dock-utilities">
        <button className="dock-switcher dock-utility" onClick={onSwitcher} aria-label="Mostrar aplicaciones abiertas">
          <span className="dock-switcher-glyph" aria-hidden="true"><i/><i/><i/></span>
        </button>
        <button className="dock-library dock-utility" onClick={() => window.dispatchEvent(new CustomEvent('rainos-app-library'))} aria-label="Biblioteca de apps">
          <span className="dock-library-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
            </svg>
          </span>
        </button>
      </div>
    </nav>
  );
}
