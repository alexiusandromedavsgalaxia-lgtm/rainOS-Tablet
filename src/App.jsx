import { useEffect, useMemo, useState } from 'react';
import { apps } from './apps/appRegistry.js';
import Calculator from './apps/Calculator.jsx';
import Settings from './apps/Settings.jsx';
import { Files, Notes, Photos, Safari, Weather } from './apps/SystemApps.jsx';
import AppIcon from './ui/AppIcon.jsx';
import StatusBar from './ui/StatusBar.jsx';

function AppContent({ app }) {
  if (app.id === 'calculator') return <Calculator />;
  if (app.id === 'settings') return <Settings />;
  if (app.id === 'files') return <Files />;
  if (app.id === 'notes') return <Notes />;
  if (app.id === 'photos') return <Photos />;
  if (app.id === 'safari') return <Safari />;
  if (app.id === 'weather') return <Weather />;
  return <div className="empty-app"><span>{app.glyph}</span><h2>{app.name}</h2><p>Aplicación del sistema rainOS Tablet.</p></div>;
}

function AppWindow({ app, onClose }) {
  return <div className="window-backdrop" onMouseDown={onClose}>
    <section className="app-window" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={app.name}>
      <header><button onClick={onClose}>Listo</button><strong>{app.name}</strong><span /></header>
      <div className="window-content"><AppContent app={app} /></div>
    </section>
  </div>;
}

export default function App() {
  const [time, setTime] = useState(new Date());
  const [openApp, setOpenApp] = useState(null);
  const [controlCenter, setControlCenter] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [sound, setSound] = useState(70);
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { const onKeyDown = event => { if (event.key === 'Escape') { setOpenApp(null); setControlCenter(false); } }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown); }, []);
  const clock = useMemo(() => time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), [time]);
  const date = useMemo(() => time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), [time]);
  return <main className="tablet-shell" style={{ filter: `brightness(${0.55 + brightness / 180})` }}>
    <div className="wallpaper" />
    <StatusBar time={clock} wifi={wifi} />
    <section className="home"><div className="welcome"><p>{date}</p><h1>{clock}</h1></div><div className="app-grid">{apps.map(app => <AppIcon key={app.id} app={app} onOpen={setOpenApp} />)}</div></section>
    <nav className="dock" aria-label="Dock">{apps.slice(0, 4).map(app => <button key={app.id} aria-label={app.name} onClick={() => setOpenApp(app)}>{app.glyph}</button>)}</nav>
    <button className="control-handle" onClick={() => setControlCenter(value => !value)} aria-label="Abrir Centro de Control">⌄</button>
    {controlCenter && <aside className="control-center"><h2>Centro de Control</h2><div className="controls">
      <button className={wifi ? 'active' : ''} onClick={() => setWifi(value => !value)}>Wi‑Fi<br /><b>{wifi ? 'Conectado' : 'Desactivado'}</b></button>
      <button className={bluetooth ? 'active' : ''} onClick={() => setBluetooth(value => !value)}>Bluetooth<br /><b>{bluetooth ? 'Activado' : 'Desactivado'}</b></button>
      <label>Brillo <b>{brightness}%</b><input type="range" min="20" max="100" value={brightness} onChange={event => setBrightness(Number(event.target.value))} /></label>
      <label>Sonido <b>{sound}%</b><input type="range" min="0" max="100" value={sound} onChange={event => setSound(Number(event.target.value))} /></label>
    </div></aside>}
    {openApp && <AppWindow app={openApp} onClose={() => setOpenApp(null)} />}
  </main>;
}
