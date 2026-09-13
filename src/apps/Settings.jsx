import { useEffect, useState } from 'react';
import { loadPreferences, updatePreference } from '../system/systemPreferences.js';

const groups = [
  ['Conectividad', [['wifi', 'Wi‑Fi', 'Conectado'], ['bluetooth', 'Bluetooth', 'Activado'], ['airplaneMode', 'Modo avión', '']]],
  ['Notificaciones', [['notifications', 'Notificaciones', ''], ['focus', 'Concentración', '']]],
  ['Sonidos', [['sound', 'Volumen', ''], ['sounds', 'Sonidos del sistema', ''], ['haptics', 'Respuesta háptica', '']]],
  ['Pantalla y brillo', [['appearance', 'Aspecto', ''], ['liquidGlass', 'Liquid Glass', ''], ['brightness', 'Brillo', '']]],
  ['General', [['about', 'Acerca de rainOS', ''], ['update', 'Actualización del sistema', ''], ['storage', 'Almacenamiento', ''], ['multitasking', 'Multitarea y gestos', '']]],
  ['Privacidad y seguridad', [['privacy', 'Privacidad', ''], ['location', 'Localización', ''], ['diagnostics', 'Análisis y mejoras', '']]],
  ['Accesibilidad', [['accessibility', 'Accesibilidad', ''], ['reducedMotion', 'Reducir movimiento', ''], ['boldText', 'Texto en negrita', '']]],
];

function Toggle({ value, onChange }) {
  return <button className={`settings-toggle ${value ? 'on' : ''}`} onClick={onChange} aria-pressed={value}><span /></button>;
}

export default function Settings() {
  const [prefs, setPrefs] = useState(loadPreferences);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const sync = event => setPrefs(event.detail);
    window.addEventListener('rainos-preferences', sync);
    return () => window.removeEventListener('rainos-preferences', sync);
  }, []);

  const set = (key, value) => {
    const next = updatePreference(key, value);
    setPrefs(next);
  };

  const valueFor = key => ({
    wifi: prefs.wifi ? 'Conectado' : 'Desactivado',
    bluetooth: prefs.bluetooth ? 'Activado' : 'Desactivado',
    airplaneMode: prefs.airplaneMode ? 'Activado' : 'Desactivado',
    appearance: prefs.appearance === 'dark' ? 'Oscuro' : 'Claro',
    liquidGlass: `${prefs.liquidGlass}%`,
    brightness: `${prefs.brightness}%`,
    sound: `${prefs.sound}%`,
    sounds: prefs.sounds ? 'Activados' : 'Desactivados',
    haptics: prefs.haptics ? 'Activados' : 'Desactivados',
    reducedMotion: prefs.reducedMotion ? 'Activado' : 'Desactivado',
    boldText: prefs.boldText ? 'Activado' : 'Desactivado',
  }[key] || '›');

  const toggleKeys = new Set(['wifi', 'bluetooth', 'airplaneMode', 'sounds', 'haptics', 'reducedMotion', 'boldText']);

  return <div className="settings-native">
    <header className="settings-header"><div><h1>Ajustes</h1><p>rainOS Tablet · sistema</p></div><div className="settings-avatar">R</div></header>
    <div className="settings-search">⌕ <input placeholder="Buscar" /></div>
    {groups.map(([title, items]) => <section className="settings-group" key={title}>
      <h2>{title}</h2>
      <div className="settings-card">{items.map(([key, label, hint]) => <button className="settings-row" key={key} onClick={() => setSelected(key)}>
        <span className={`settings-symbol settings-symbol-${key}`}>●</span><span className="settings-label"><b>{label}</b><small>{hint || valueFor(key)}</small></span>
        {toggleKeys.has(key) ? <Toggle value={!!prefs[key]} onChange={() => set(key, !prefs[key])} /> : <span className="settings-value">{valueFor(key)} <i>›</i></span>}
      </button>)}</div>
    </section>)}

    {selected && <SettingsDetail id={selected} prefs={prefs} set={set} close={() => setSelected(null)} />}
  </div>;
}

function SettingsDetail({ id, prefs, set, close }) {
  if (id === 'appearance') return <Detail title="Aspecto" close={close}><div className="appearance-picker"><button className={prefs.appearance === 'light' ? 'selected' : ''} onClick={() => set('appearance', 'light')}>☀️<b>Claro</b></button><button className={prefs.appearance === 'dark' ? 'selected' : ''} onClick={() => set('appearance', 'dark')}>🌙<b>Oscuro</b></button></div></Detail>;
  if (id === 'liquidGlass') return <Detail title="Liquid Glass" close={close}><p>Controla la transparencia del material de las superficies del sistema.</p><input className="settings-slider" type="range" min="0" max="100" value={prefs.liquidGlass} onChange={e => set('liquidGlass', Number(e.target.value))} /><strong>{prefs.liquidGlass}% transparencia</strong></Detail>;
  if (id === 'brightness' || id === 'sound') { const label = id === 'brightness' ? 'Brillo' : 'Volumen'; return <Detail title={label} close={close}><input className="settings-slider" type="range" min="0" max="100" value={prefs[id]} onChange={e => set(id, Number(e.target.value))} /><strong>{prefs[id]}%</strong></Detail>; }
  if (id === 'update') return <SoftwareUpdate close={close} />;
  const titles = { about:'Acerca de rainOS', storage:'Almacenamiento', multitasking:'Multitarea y gestos', notifications:'Notificaciones', focus:'Concentración', privacy:'Privacidad', location:'Localización', diagnostics:'Análisis y mejoras', accessibility:'Accesibilidad' };
  return <Detail title={titles[id] || id} close={close}><p>{id === 'storage' ? 'El almacenamiento muestra el espacio ocupado por aplicaciones y datos. La memoria RAM no se presenta como un ajuste del sistema.' : 'Esta sección controla una función real de rainOS. Los cambios se guardan localmente y se aplican al sistema.'}</p></Detail>;
}

function SoftwareUpdate({ close }) {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const run = () => {
    setStatus('checking'); setProgress(0);
    let p = 0;
    const timer = setInterval(() => { p += 10; setProgress(p); if (p >= 100) { clearInterval(timer); setStatus('ready'); } }, 120);
  };
  return <Detail title="Actualización del sistema" close={close}><div className="update-card"><b>rainOS 27</b><span>Tu sistema está preparado para recibir actualizaciones del sistema.</span>{status === 'idle' && <button onClick={run}>Buscar actualización</button>}{status === 'checking' && <><div className="update-progress"><i style={{ width: `${progress}%` }} /></div><span>Comprobando actualizaciones… {progress}%</span></>}{status === 'ready' && <><p>No hay una actualización nueva disponible.</p><button onClick={() => { setStatus('idle'); setProgress(0); }}>Volver a comprobar</button></>}</div></Detail>;
}

function Detail({ title, close, children }) { return <div className="settings-detail"><button className="detail-back" onClick={close}>‹ Ajustes</button><h2>{title}</h2><div className="detail-body">{children}</div></div>; }
