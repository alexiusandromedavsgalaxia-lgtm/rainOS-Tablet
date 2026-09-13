import { useEffect, useMemo, useState } from 'react';
import { apps, getApp } from './apps/appRegistry.js';
import { loadPreferences, updatePreference } from './system/systemPreferences.js';
import Calculator from './apps/Calculator.jsx';
import Settings from './apps/Settings.jsx';
import Calendar from './apps/Calendar.jsx';
import Mail from './apps/Mail.jsx';
import Messages from './apps/Messages.jsx';
import Music from './apps/Music.jsx';
import Clock from './apps/Clock.jsx';
import AppStore from './apps/AppStore.jsx';
import SetupAssistant from './apps/SetupAssistant.jsx';
import AdditionalSystemApp from './apps/AdditionalSystemApps.jsx';
import { Files, Notes, Photos, Safari, Weather } from './apps/SystemApps.jsx';
import AppIcon from './ui/AppIcon.jsx';
import AppWindow from './ui/AppWindow.jsx';
import ControlCenter from './ui/ControlCenter.jsx';
import Dock from './ui/Dock.jsx';
import StatusBar from './ui/StatusBar.jsx';

const dockIds = ['safari', 'messages', 'music', 'settings'];
const additionalSystemAppIds = new Set(['camera','contacts','maps','reminders','freeform','home','shortcuts','findmy','facetime','books','podcasts','tv','tips','voice']);
const appComponents = { calculator: Calculator, settings: Settings, calendar: Calendar, mail: Mail, messages: Messages, music: Music, clock: Clock, appstore: AppStore, files: Files, notes: Notes, photos: Photos, safari: Safari, weather: Weather };

function AppContent({ app }) {
  const Component = appComponents[app.id];
  if (Component) return <Component />;
  if (additionalSystemAppIds.has(app.id)) return <AdditionalSystemApp id={app.id} />;
  return <div className="empty-app"><h2>{app.name}</h2><p>Esta aplicación todavía no está instalada en rainOS.</p></div>;
}

export default function App() {
  const [time, setTime] = useState(new Date());
  const [openApps, setOpenApps] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [stageManager, setStageManager] = useState(false);
  const [controlCenter, setControlCenter] = useState(false);
  const [prefs, setPrefs] = useState(loadPreferences);
  const [setup, setSetup] = useState(() => localStorage.getItem('rainos.setupComplete') !== 'true');

  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { const sync = e => setPrefs(e.detail); window.addEventListener('rainos-preferences', sync); return () => window.removeEventListener('rainos-preferences', sync); }, []);
  useEffect(() => {
    document.documentElement.dataset.appearance = prefs.appearance;
    document.documentElement.style.setProperty('--rainos-glass-strength', String(prefs.liquidGlass / 100));
    document.documentElement.style.setProperty('--glass-strength', String(prefs.liquidGlass / 100));
    document.documentElement.style.setProperty('--rainos-brightness', String(0.55 + prefs.brightness / 180));
    document.documentElement.style.setProperty('--rainos-reduced-motion', prefs.reducedMotion ? '0s' : '.2s');
    document.documentElement.classList.toggle('rainos-bold-text', prefs.boldText);
  }, [prefs]);
  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === 'Escape') { setControlCenter(false); setStageManager(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Tab') { e.preventDefault(); setStageManager(true); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const clock = useMemo(() => time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), [time]);
  const date = useMemo(() => time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }), [time]);
  const dockApps = dockIds.map(getApp).filter(Boolean);
  const finishSetup = values => {
    const next = values || {};
    if (next.appearance) updatePreference('appearance', next.appearance);
    if (typeof next.wifi === 'boolean') updatePreference('wifi', next.wifi);
    localStorage.setItem('rainos.setupComplete', 'true');
    localStorage.setItem('rainos.setupProfile', JSON.stringify(next));
    setSetup(false);
  };
  const pref = (key, value) => updatePreference(key, value);

  const openApp = app => {
    setOpenApps(current => current.some(item => item.id === app.id) ? current : [...current, { ...app, mode: 'fullscreen' }]);
    setActiveId(app.id);
    setStageManager(false);
  };
  const closeApp = id => {
    setOpenApps(current => current.filter(item => item.id !== id));
    setActiveId(current => current === id ? null : current);
  };
  const toggleMode = id => setOpenApps(current => current.map(item => item.id === id ? { ...item, mode: item.mode === 'window' ? 'fullscreen' : 'window' } : item));
  const focusApp = id => { setActiveId(id); setStageManager(false); };

  return <main className="tablet-shell" style={{ filter: `brightness(${0.55 + prefs.brightness / 180})` }}>
    <div className="wallpaper" />
    <StatusBar time={clock} wifi={prefs.wifi} bluetooth={prefs.bluetooth} battery={100} charging={false} title="rainOS" />
    <section className={`home ${openApps.length ? 'home-behind-apps' : ''}`}>
      <div className="welcome"><p>{date}</p><h1>{clock}</h1></div>
      <div className="app-grid">{apps.map(app => <AppIcon key={app.id} app={app} onOpen={openApp} />)}</div>
      <div className="page-indicator" aria-label="Páginas de inicio"><span className="active" /><span /><span /></div>
    </section>
    <Dock apps={dockApps} onOpen={openApp} />
    <button className="control-handle" onClick={() => setControlCenter(v => !v)} aria-label="Abrir Centro de Control">⌄</button>
    <button className="stage-handle" onClick={() => setStageManager(v => !v)} aria-label="Abrir Organizador Visual"><span /><span /><span /></button>

    {openApps.map(app => app.id === activeId && <AppWindow key={app.id} app={app} mode={app.mode} onClose={() => closeApp(app.id)} onToggleMode={() => toggleMode(app.id)} onOpenStageManager={() => setStageManager(true)}><AppContent app={app} /></AppWindow>)}

    {stageManager && <aside className="stage-manager" aria-label="Organizador Visual">
      <div className="stage-manager-header"><span>Organizador Visual</span><button onClick={() => setStageManager(false)}>×</button></div>
      <div className="stage-manager-list">
        {openApps.length === 0 && <div className="stage-empty"><b>Abre una app</b><span>Las ventanas recientes aparecerán aquí.</span></div>}
        {openApps.map(app => <button key={app.id} className={`stage-card ${activeId === app.id ? 'active' : ''}`} onClick={() => focusApp(app.id)}><AppIcon app={app} onOpen={() => focusApp(app.id)} size="small" disabled /><span>{app.name}</span></button>)}
      </div>
      <div className="stage-manager-footer">Organiza las apps abiertas en espacios de trabajo.</div>
    </aside>}

    {controlCenter && <ControlCenter wifi={prefs.wifi} bluetooth={prefs.bluetooth} brightness={prefs.brightness} sound={prefs.sound} onWifi={() => pref('wifi', !prefs.wifi)} onBluetooth={() => pref('bluetooth', !prefs.bluetooth)} onBrightness={v => pref('brightness', v)} onSound={v => pref('sound', v)} />}
    {setup && <SetupAssistant onComplete={finishSetup} />}
  </main>;
}
