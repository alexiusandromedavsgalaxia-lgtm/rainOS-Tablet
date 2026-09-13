import { useMemo } from 'react';

const svgRepoAssets = {
  calendar: 'https://www.svgrepo.com/svg/50042/chat-messages',
  photos: 'https://www.svgrepo.com/svg/436181/image-picture-gallery',
  messages: 'https://www.svgrepo.com/svg/50042/chat-messages',
  settings: 'https://www.svgrepo.com/svg/247943/settings-gear',
};

const iconData = {
  calendar: { tone: 'calendar', symbol: '31' }, photos: { tone: 'photos', symbol: '✿' }, mail: { tone: 'mail', symbol: '✉' },
  messages: { tone: 'messages', symbol: '•••' }, safari: { tone: 'safari', symbol: '✧' }, music: { tone: 'music', symbol: '♪' },
  notes: { tone: 'notes', symbol: '≡' }, files: { tone: 'files', symbol: '▰' }, settings: { tone: 'settings', symbol: '⚙' },
  appstore: { tone: 'appstore', symbol: 'A' }, weather: { tone: 'weather', symbol: '☀' }, clock: { tone: 'clock', symbol: '◷' },
  calculator: { tone: 'calculator', symbol: '÷' }, camera: { tone: 'camera', symbol: '●' }, contacts: { tone: 'contacts', symbol: '●' },
  maps: { tone: 'maps', symbol: '⌖' }, reminders: { tone: 'reminders', symbol: '✓' }, freeform: { tone: 'freeform', symbol: '✎' },
  home: { tone: 'home', symbol: '⌂' }, shortcuts: { tone: 'shortcuts', symbol: '✦' }, findmy: { tone: 'findmy', symbol: '⌖' },
  facetime: { tone: 'facetime', symbol: '▰' }, books: { tone: 'books', symbol: '▤' }, podcasts: { tone: 'podcasts', symbol: '◉' },
  tv: { tone: 'tv', symbol: '▶' }, tips: { tone: 'tips', symbol: '✦' }, voice: { tone: 'voice', symbol: '∿' },
};

function IconGraphic({ appId, symbol }) {
  const repoAsset = svgRepoAssets[appId];
  const fallback = useMemo(() => ({
    calendar: <><rect x="6" y="8" width="20" height="19" rx="4"/><path d="M9 5v6M23 5v6M6 13h20"/></>,
    photos: <><circle cx="16" cy="16" r="4" fill="currentColor"/><circle cx="16" cy="7" r="4"/><circle cx="24" cy="12" r="4"/><circle cx="21" cy="22" r="4"/><circle cx="11" cy="22" r="4"/><circle cx="8" cy="12" r="4"/></>,
    mail: <><rect x="4.5" y="7" width="23" height="18" rx="4"/><path d="m6 9 10 8L26 9"/></>,
    messages: <path d="M5 8.5A4.5 4.5 0 0 1 9.5 4h13A4.5 4.5 0 0 1 27 8.5v10a4.5 4.5 0 0 1-4.5 4.5H13l-6.5 4v-4.5A4.5 4.5 0 0 1 5 18.5z" fill="currentColor" stroke="none"/>,
    settings: <><circle cx="16" cy="16" r="4.5"/><path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2.1 2.1M22.4 22.4l2.1 2.1M24.5 7.5l-2.1 2.1M9.6 22.4l-2.1 2.1"/></>,
  }), []);

  if (repoAsset) {
    return <img className="app-icon-svg app-icon-svg-repo" src={`${repoAsset}.svg`} alt="" draggable="false" />;
  }

  return <svg className="app-icon-svg" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {fallback[appId] ?? <text x="16" y="21" textAnchor="middle" fill="currentColor" stroke="none" fontSize="13" fontWeight="700">{symbol}</text>}
  </svg>;
}

export default function AppIcon({ app, onOpen, size = 'normal', disabled = false }) {
  const icon = iconData[app.id] ?? { tone: 'default', symbol: app.name.slice(0, 1) };
  const handleOpen = () => { if (!disabled) onOpen(app); };
  return (
    <button className={`app-icon app-icon-${size}`} onClick={handleOpen} disabled={disabled} aria-label={`Abrir ${app.name}`} title={app.name}>
      <span className={`icon-art icon-art-${icon.tone}`} aria-hidden="true">
        <span className="icon-glass-base" />
        <span className="icon-glass-reflection" />
        <span className="icon-glass-symbol"><IconGraphic appId={app.id} symbol={icon.symbol} /></span>
        <span className="icon-glass-highlight" />
        {app.badge > 0 && <span className="app-icon-notification">{app.badge > 99 ? '99+' : app.badge}</span>}
      </span>
      <span className="app-icon-name">{app.name}</span>
    </button>
  );
}
