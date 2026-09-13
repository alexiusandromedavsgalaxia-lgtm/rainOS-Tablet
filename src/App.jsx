import { useEffect, useMemo, useState } from 'react';

const APPS = [
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
  return (
    <button className="app-icon" onClick={() => onOpen(app)} aria-label={`Abrir ${app.name}`}>
      <span className="icon-art">{app.glyph}</span>
      <span>{app.name}</span>
    </button>
  );
}

function Calculator() {
  const [value, setValue] = useState('0');
  const press = (key) => {
    if (/^[0-9.]$/.test(key)) setValue(value === '0' ? key : value + key);
    else if (key === 'C') setValue('0');
    else if (key === '=') {
      try {
        if (!/^[0-9+*/().% -]+$/.test(value)) throw new Error('invalid');
        setValue(String(Function(`"use strict"; return (${value})`)()));
      } catch { setValue('Error'); }
    } else setValue(value === '0' ? key : value + key);
  };
  return <div className="calculator"><output>{value}</output><div className="calculator-keys">{['C','(',')','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','%','='].map(k => <button key={k} onClick={() => press(k)}>{k}</button>)}</div></div>;
}

function AppContent({ app }) {
  if (app.id === 'calculator') return <Calculator />;
  if (app.id === 'settings') return <div className="settings-list"><div><b>rainOS</b><span>Tablet 1.0 · build Tablet-1000</span></div><div><b>Wi‑Fi</b><span>Conectado</span></div><div><b>Bluetooth</b><span>Activado</span></div><div><b>Aspecto</b><span>Automático</span></div></div>;
  if (app.id === 'files') return <div className="empty-app"><span>📂</span><h2>Archivos</h2><p>Este espacio estará listo para el sistema de archivos virtual.</p></div>;
  if (app.id === 'notes') return <div className="empty-app"><span>📝</span><h2>Notas</h2><p>Tu próxima nota aparecerá aquí.</p></div>;
  if (app.id === 'photos') return <div className="empty-app"><span>🌈</span><h2>Fotos</h2><p>La fototeca virtual de rainOS todavía está vacía.</p></div>;
  if (app.id === 'safari') return <div className="empty-app"><span>🧭</span><h2>Safari</h2><p>Navegador virtual preparado para una futura implementación.</p></div>;
  if (app.id === 'weather') return <div className="weather-card"><span>☀️</span><strong>24°</strong><p>Tiempo simulado · despejado</p></div>;
  return <div className="empty-app"><span>{app.glyph}</span><h2>{app.name}</h2><p>Aplicación del sistema rainOS Tablet.</p></div>;
}

function AppWindow({ app, onClose }) {
  return (
    <div className="window-backdrop" onMouseDown={onClose}>
      <section className="app-window" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={app.name}>
        <header><button onClick={onClose}>Listo</button><strong>{app.name}</strong><span /></header>
        <div className="window-content"><AppContent app={app} /></div>
      </section>
    </div>
  );
}

export default function App() {
  const [time, setTime] = useState(new Date());
  const [openApp, setOpenApp] = useState(null);
  const [controlCenter, setControlCenter] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [sound, setSound] = useState(70);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpenApp(null);
        setControlCenter(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const clock = useMemo(() => time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), [time]);
  const date = useMemo(() => time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), [time]);

  return <main className="tablet-shell" style={{ filter: `brightness(${0.55 + brightness / 180})` }}>
    <div className="wallpaper" />
    <header className="statusbar">
      <span>{clock}</span><span className="status-title">rainOS</span><span>{wifi ? '◉' : '○'}　▮▮▮　100%</span>
    </header>

    <section className="home">
      <div className="welcome"><p>{date}</p><h1>{clock}</h1></div>
      <div className="app-grid">{APPS.map(app => <AppIcon key={app.id} app={app} onOpen={setOpenApp} />)}</div>
    </section>

    <nav className="dock" aria-label="Dock">{APPS.slice(0, 4).map(app => <button key={app.id} aria-label={app.name} onClick={() => setOpenApp(app)}>{app.glyph}</button>)}</nav>

    <button className="control-handle" onClick={() => setControlCenter(value => !value)} aria-label="Abrir Centro de Control">⌄</button>
    {controlCenter && <aside className="control-center">
      <h2>Centro de Control</h2>
      <div className="controls">
        <button className={wifi ? 'active' : ''} onClick={() => setWifi(value => !value)}>Wi‑Fi<br /><b>{wifi ? 'Conectado' : 'Desactivado'}</b></button>
        <button className={bluetooth ? 'active' : ''} onClick={() => setBluetooth(value => !value)}>Bluetooth<br /><b>{bluetooth ? 'Activado' : 'Desactivado'}</b></button>
        <label>Brillo <b>{brightness}%</b><input type="range" min="20" max="100" value={brightness} onChange={event => setBrightness(Number(event.target.value))} /></label>
        <label>Sonido <b>{sound}%</b><input type="range" min="0" max="100" value={sound} onChange={event => setSound(Number(event.target.value))} /></label>
      </div>
    </aside>}

    {openApp && <AppWindow app={openApp} onClose={() => setOpenApp(null)} />}
  </main>;
}
