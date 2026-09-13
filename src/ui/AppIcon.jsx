const iconGlyphs = {
  calendar: { glyph: '31', tone: 'calendar' },
  photos: { glyph: '✿', tone: 'photos' },
  mail: { glyph: '✉', tone: 'mail' },
  messages: { glyph: '•••', tone: 'messages' },
  safari: { glyph: '✧', tone: 'safari' },
  music: { glyph: '♪', tone: 'music' },
  notes: { glyph: '≡', tone: 'notes' },
  files: { glyph: '▰', tone: 'files' },
  settings: { glyph: '⚙', tone: 'settings' },
  appstore: { glyph: 'A', tone: 'appstore' },
  weather: { glyph: '☀', tone: 'weather' },
  clock: { glyph: '◷', tone: 'clock' },
  calculator: { glyph: '÷', tone: 'calculator' },
  camera: { glyph: '●', tone: 'camera' },
  contacts: { glyph: '●', tone: 'contacts' },
  maps: { glyph: '⌖', tone: 'maps' },
  reminders: { glyph: '✓', tone: 'reminders' },
  freeform: { glyph: '✎', tone: 'freeform' },
  home: { glyph: '⌂', tone: 'home' },
  shortcuts: { glyph: '✦', tone: 'shortcuts' },
  findmy: { glyph: '⌖', tone: 'findmy' },
  facetime: { glyph: '▰', tone: 'facetime' },
  books: { glyph: '▤', tone: 'books' },
  podcasts: { glyph: '◉', tone: 'podcasts' },
  tv: { glyph: '▶', tone: 'tv' },
  tips: { glyph: '✦', tone: 'tips' },
  voice: { glyph: '∿', tone: 'voice' },
};

export default function AppIcon({ app, onOpen, size = 'normal', disabled = false }) {
  const icon = iconGlyphs[app.id] ?? { glyph: app.name.slice(0, 1), tone: 'default' };
  const handleOpen = () => { if (!disabled) onOpen(app); };

  return (
    <button className={`app-icon app-icon-${size}`} onClick={handleOpen} disabled={disabled} aria-label={`Abrir ${app.name}`} title={app.name}>
      <span className={`icon-art icon-art-${icon.tone}`} aria-hidden="true">
        <span className="icon-symbol">{icon.glyph}</span>
        {app.badge > 0 && <span className="app-icon-notification">{app.badge > 99 ? '99+' : app.badge}</span>}
      </span>
      <span className="app-icon-name">{app.name}</span>
    </button>
  );
}
