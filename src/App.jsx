import { useEffect, useMemo, useState } from 'react';

const apps = [
  { id: 'files', name: 'Archivos', glyph: '📁' },
  { id: 'notes', name: 'Notas', glyph: '📝' },
  { id: 'photos', name: 'Fotos', glyph: '🌈' },
  { id: 'safari', name: 'Safari', glyph: '🧭' },
  { id: 'settings', name: 'Ajustes', glyph: '⚙️' },
  { id: 'calculator', name: 'Calculadora', glyph: '🧮' },
  { id: 'clock', name: 'Reloj', glyph: '🕘' },
  { id: 'weather', name: 'Tiempo', glyph: '☀️' },
];

function AppIcon({ app, onOpen }) {
  return <button className="app-icon" onClick={() => onOpen(app)} aria-label={app.name}>
    <span className="icon-art">{app.glyph}</span><span>{app.name}</span>
  </button>;
}

function AppWindow({ app, onClose }) {
  return <div className="window-backdrop" onMouseDown={onClose}>
    <section className="app-window" onMouseDown={e => e.stopPropagation()}>
      <header><button onClick={onClose}>Done</button><strong>{app.name}</strong><span /></header>
      <div className="window-content">
        <div className="hero-glyph">{app.glyph}</div>
        <h1>{app.name}</h1>
        <p>rainOS Tablet · aplicación del sistema</p>
      </div>
    </section>
  </div>;
}

export default function App() {
  const [time, setTime] = useState(new Date());
  const [openApp, setOpenApp] = useState(null);
  const [controlCenter, setControlCenter] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clock = useMemo(() => time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), [time]);
  const date = useMemo(() => time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), [time]);

  return <main className="tablet-shell">
    <div className="wallpaper" />
    <header className="statusbar">
      <span>{clock}</span>
      <span className="status-title">rainOS</span>
      <span>◉  ▮▮▮  100%</span>
    </header>

    <section className="home">
      <div className="welcome"><p>{date}</p><h1>{clock}</h1></div>
      <div className="app-grid">{apps.map(app => <AppIcon key={app.id} app={app} onOpen={setOpenApp} />)}</div>
    </section>

    <nav className="dock" aria-label="Dock">
      {apps.slice(0, 4).map(app => <button key={app.id} onClick={() => setOpenApp(app)}>{app.glyph}</button>)}
    </nav>

    <button className="control-handle" onClick={() => setControlCenter(v => !v)} aria-label="Abrir Centro de Control">⌄</button>
    {controlCenter && <aside className="control-center">
      <h2>Centro de Control</h2>
      <div className="controls"><button>Wi‑Fi<br /><b>Conectado</b></button><button>Bluetooth<br /><b>Activado</b></button><button>Brillo<br /><b>100%</b></button><button>Sonido<br /><b>80%</b></button></div>
    </aside>}

    {openApp && <AppWindow app={openApp} onClose={() => setOpenApp(null)} />}
  </main>;
}
