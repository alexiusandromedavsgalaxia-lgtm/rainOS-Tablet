const iconData = {
  calendar: { tone: 'calendar', type: 'calendar' }, photos: { tone: 'photos', type: 'flower' }, mail: { tone: 'mail', type: 'mail' },
  messages: { tone: 'messages', type: 'message' }, safari: { tone: 'safari', type: 'compass' }, music: { tone: 'music', type: 'music' },
  notes: { tone: 'notes', type: 'note' }, files: { tone: 'files', type: 'folder' }, settings: { tone: 'settings', type: 'gear' },
  appstore: { tone: 'appstore', type: 'appstore' }, weather: { tone: 'weather', type: 'sun' }, clock: { tone: 'clock', type: 'clock' },
  calculator: { tone: 'calculator', type: 'calculator' }, camera: { tone: 'camera', type: 'camera' }, contacts: { tone: 'contacts', type: 'person' },
  maps: { tone: 'maps', type: 'map' }, reminders: { tone: 'reminders', type: 'check' }, freeform: { tone: 'freeform', type: 'pen' },
  home: { tone: 'home', type: 'house' }, shortcuts: { tone: 'shortcuts', type: 'spark' }, findmy: { tone: 'findmy', type: 'locator' },
  facetime: { tone: 'facetime', type: 'video' }, books: { tone: 'books', type: 'book' }, podcasts: { tone: 'podcasts', type: 'podcast' },
  tv: { tone: 'tv', type: 'play' }, tips: { tone: 'tips', type: 'bulb' }, voice: { tone: 'voice', type: 'wave' },
};

function IconGraphic({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    calendar: <><rect x="6" y="8" width="20" height="19" rx="4" {...common}/><path d="M9 5v6M23 5v6M6 13h20" {...common}/><path d="M10 18h4M17 18h4M10 23h4" {...common}/></>,
    flower: <><circle cx="16" cy="16" r="4" fill="currentColor"/><circle cx="16" cy="7" r="4" {...common}/><circle cx="24" cy="12" r="4" {...common}/><circle cx="21" cy="22" r="4" {...common}/><circle cx="11" cy="22" r="4" {...common}/><circle cx="8" cy="12" r="4" {...common}/></>,
    mail: <><rect x="4.5" y="7" width="23" height="18" rx="4" {...common}/><path d="m6 9 10 8L26 9" {...common}/></>,
    message: <><path d="M5 8.5A4.5 4.5 0 0 1 9.5 4h13A4.5 4.5 0 0 1 27 8.5v10a4.5 4.5 0 0 1-4.5 4.5H13l-6.5 4v-4.5A4.5 4.5 0 0 1 5 18.5z" fill="currentColor" stroke="none"/><circle cx="12" cy="13.5" r="1.5" fill="white"/><circle cx="16" cy="13.5" r="1.5" fill="white"/><circle cx="20" cy="13.5" r="1.5" fill="white"/></>,
    compass: <><circle cx="16" cy="16" r="11.5" {...common}/><path d="m20.5 11.5-3.2 7.1-7.1 3.2 3.2-7.1z" fill="currentColor" stroke="none"/></>,
    music: <><path d="M20 6v15.5a4.5 4.5 0 1 1-3-4.24V9l10-2v11.5a4.5 4.5 0 1 1-3-4.24V5z" {...common}/></>,
    note: <><path d="M7 5h18v22H7z" fill="currentColor" stroke="none"/><path d="M11 10h10M11 15h10M11 20h7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></>,
    folder: <path d="M4 9.5A3.5 3.5 0 0 1 7.5 6H13l3 3h6.5A3.5 3.5 0 0 1 26 12.5v9A3.5 3.5 0 0 1 22.5 25h-15A3.5 3.5 0 0 1 4 21.5z" fill="currentColor" stroke="none"/>,
    gear: <><circle cx="16" cy="16" r="4.5" {...common}/><path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2.1 2.1M22.4 22.4l2.1 2.1M24.5 7.5l-2.1 2.1M9.6 22.4l-2.1 2.1" {...common}/></>,
    appstore: <><path d="M12 6 5 18m10-6 7 12M8 22h16M11 18h10" {...common}/><path d="m18 6-2 3" {...common}/></>,
    sun: <><circle cx="16" cy="16" r="6" fill="currentColor"/><path d="M16 3v3M16 26v-3M3 16h3M26 16h-3M6.8 6.8l2.1 2.1M23.1 23.1 21 21M25.2 6.8l-2.1 2.1M8.9 23.1 11 21" {...common}/></>,
    clock: <><circle cx="16" cy="16" r="11.5" {...common}/><path d="M16 9v7l5 3" {...common}/></>,
    calculator: <><rect x="6" y="4.5" width="20" height="23" rx="3" {...common}/><path d="M10 9h12M10 14h2M16 14h2M22 14h0M10 19h2M16 19h2M22 19h0M10 24h2M16 24h2M22 24h0" {...common}/></>,
    camera: <><path d="M6 10h5l2-3h6l2 3h5v14H6z" {...common}/><circle cx="16" cy="17" r="4.5" {...common}/></>,
    person: <><circle cx="16" cy="10" r="4" {...common}/><path d="M7 27c.7-5.5 3.7-8 9-8s8.3 2.5 9 8" {...common}/></>,
    map: <><path d="m5 7 7-3 8 3 5-2v18l-5 2-8-3-7 3z" {...common}/><path d="M12 4v18M20 7v18" {...common}/></>,
    check: <><circle cx="16" cy="16" r="11.5" {...common}/><path d="m10 16 4 4 7-8" {...common}/></>,
    pen: <><path d="m20.5 5.5 6 6L11 27H5v-6z" {...common}/><path d="m17 9 6 6" {...common}/></>,
    house: <><path d="m5 14 11-9 11 9v11H5z" {...common}/><path d="M12 25v-7h8v7" {...common}/></>,
    spark: <><path d="M16 4l2.2 7.8L26 14l-7.8 2.2L16 24l-2.2-7.8L6 14l7.8-2.2z" fill="currentColor" stroke="none"/></>,
    locator: <><circle cx="16" cy="16" r="11.5" {...common}/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4" {...common}/></>,
    video: <><rect x="4" y="8" width="17" height="16" rx="4" {...common}/><path d="m21 13 6-3v12l-6-3z" fill="currentColor" stroke="none"/></>,
    book: <><path d="M6 6.5A3.5 3.5 0 0 1 9.5 3H25v22H9.5A3.5 3.5 0 0 0 6 28z" {...common}/><path d="M6 6.5v17A3.5 3.5 0 0 1 9.5 20H25" {...common}/></>,
    podcast: <><circle cx="16" cy="14" r="3" fill="currentColor"/><path d="M10 14a6 6 0 0 1 12 0M7 14a9 9 0 0 1 18 0M13 19c-1 2-1 5-1 7M19 19c1 2 1 5 1 7" {...common}/></>,
    play: <><rect x="4" y="5" width="24" height="22" rx="5" {...common}/><path d="m13 11 7 5-7 5z" fill="currentColor" stroke="none"/></>,
    bulb: <><path d="M10 14a6 6 0 1 1 12 0c0 2.5-1.4 4-3 5.5V23h-6v-3.5c-1.6-1.5-3-3-3-5.5z" {...common}/><path d="M13 27h6" {...common}/></>,
    wave: <><path d="M5 16c2.5-8 5-8 7.5 0s5 8 7.5 0 5-8 7.5 0" {...common}/></>,
  };
  return <svg className="app-icon-svg" viewBox="0 0 32 32" aria-hidden="true">{paths[type] ?? <circle cx="16" cy="16" r="10" fill="currentColor"/>}</svg>;
}

export default function AppIcon({ app, onOpen, size = 'normal', disabled = false }) {
  const icon = iconData[app.id] ?? { type: 'spark', tone: 'default' };
  const handleOpen = () => { if (!disabled) onOpen(app); };
  return (
    <button className={`app-icon app-icon-${size}`} onClick={handleOpen} disabled={disabled} aria-label={`Abrir ${app.name}`} title={app.name}>
      <span className={`icon-art icon-art-${icon.tone}`} aria-hidden="true">
        <span className="icon-glass-base" />
        <span className="icon-glass-reflection" />
        <span className="icon-glass-symbol"><IconGraphic type={icon.type} /></span>
        <span className="icon-glass-highlight" />
        {app.badge > 0 && <span className="app-icon-notification">{app.badge > 99 ? '99+' : app.badge}</span>}
      </span>
      <span className="app-icon-name">{app.name}</span>
    </button>
  );
}
