import { useEffect, useMemo, useState } from 'react';
import { apps } from './apps/appRegistry.js';
import Calculator from './apps/Calculator.jsx';
import Settings from './apps/Settings.jsx';
import { Files, Notes, Photos, Safari, Weather } from './apps/SystemApps.jsx';
import AppIcon from './ui/AppIcon.jsx';
import AppWindow from './ui/AppWindow.jsx';
import ControlCenter from './ui/ControlCenter.jsx';
import Dock from './ui/Dock.jsx';
import StatusBar from './ui/StatusBar.jsx';

function AppContent({ app }) {
  const content = {
    calculator: Calculator,
    settings: Settings,
    files: Files,
    notes: Notes,
    photos: Photos,
    safari: Safari,
    weather: Weather,
  };
  const Component = content[app.id];
  return Component ? <Component /> : <div className="empty-app"><span>{app.glyph}</span><h2>{app.name}</h2><p>Aplicación del sistema rainOS Tablet.</p></div>;
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
    <section className="home">
      <div className="welcome"><p>{date}</p><h1>{clock}</h1></div>
      <div className="app-grid">{apps.map(app => <AppIcon key={app.id} app={app} onOpen={setOpenApp} />)}</div>
    </section>
    <Dock apps={apps.slice(0, 4)} onOpen={setOpenApp} />
    <button className="control-handle" onClick={() => setControlCenter(value => !value)} aria-label="Abrir Centro de Control">⌄</button>
    {controlCenter && <ControlCenter wifi={wifi} bluetooth={bluetooth} brightness={brightness} sound={sound} onWifi={() => setWifi(value => !value)} onBluetooth={() => setBluetooth(value => !value)} onBrightness={setBrightness} onSound={setSound} />}
    {openApp && <AppWindow app={openApp} onClose={() => setOpenApp(null)}><AppContent app={openApp} /></AppWindow>}
  </main>;
}
