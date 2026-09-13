import { useEffect, useMemo, useState } from 'react';
import { loadPreferences, updatePreference } from '../system/systemPreferences.js';

const groups = [
  ['Conectividad', [['wifi','Wi-Fi'],['bluetooth','Bluetooth'],['airplaneMode','Modo avión']]],
  ['Notificaciones', [['notifications','Notificaciones'],['focus','Concentración']]],
  ['Sonidos y vibración', [['sound','Volumen'],['sounds','Sonidos del sistema'],['haptics','Respuesta háptica']]],
  ['Pantalla y brillo', [['appearance','Aspecto'],['liquidGlass','Liquid Glass'],['brightness','Brillo']]],
  ['General', [['about','Acerca de rainOS'],['update','Actualización del sistema'],['storage','Almacenamiento'],['multitasking','Multitarea y gestos']]],
  ['Privacidad y seguridad', [['privacy','Privacidad'],['location','Localización'],['diagnostics','Análisis y mejoras']]],
  ['Accesibilidad', [['accessibility','Accesibilidad'],['reducedMotion','Reducir movimiento'],['boldText','Texto en negrita']]],
];
const toggles = new Set(['wifi','bluetooth','airplaneMode','sounds','haptics','reducedMotion','boldText']);

export default function Settings() {
  const [prefs, setPrefs] = useState(loadPreferences);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  useEffect(() => { const sync=e=>setPrefs(e.detail); window.addEventListener('rainos-preferences',sync); return()=>window.removeEventListener('rainos-preferences',sync); },[]);
  const set=(key,value)=>setPrefs(updatePreference(key,value));
  const visible=useMemo(()=>groups.map(([g,items])=>[g,items.filter(([,label])=>label.toLowerCase().includes(search.toLowerCase()))]).filter(([,items])=>items.length),[search]);
  const value=k=>({wifi:prefs.wifi?'Conectado':'No conectado',bluetooth:prefs.bluetooth?'Activado':'Desactivado',airplaneMode:prefs.airplaneMode?'Activado':'Desactivado',appearance:prefs.appearance==='dark'?'Oscuro':'Claro',liquidGlass:`${prefs.liquidGlass}%`,brightness:`${prefs.brightness}%`,sound:`${prefs.sound}%`,sounds:prefs.sounds?'Activados':'Desactivados',haptics:prefs.haptics?'Activados':'Desactivados',reducedMotion:prefs.reducedMotion?'Activado':'Desactivado',boldText:prefs.boldText?'Activado':'Desactivado'}[k]||'');
  return <div className="settings-native">
    <header className="settings-header"><div><h1>Ajustes</h1><p>rainOS Tablet</p></div></header>
    <div className="settings-search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar" /></div>
    {visible.map(([title,items])=><section className="settings-group" key={title}><h2>{title}</h2><div className="settings-card">{items.map(([key,label])=><div className="settings-row" key={key}>
      <button className="settings-main" onClick={()=>setSelected(key)}><span className={`settings-symbol settings-symbol-${key}`} /><span className="settings-label"><b>{label}</b><small>{value(key)}</small></span><span className="settings-value">›</span></button>
      {toggles.has(key)&&<button className={`settings-toggle ${prefs[key]?'on':''}`} onClick={()=>set(key,!prefs[key])} aria-pressed={prefs[key]}><span/></button>}
    </div>)}</div></section>)}
    {selected&&<SettingsDetail id={selected} prefs={prefs} set={set} close={()=>setSelected(null)} />}
  </div>;
}

function SettingsDetail({id,prefs,set,close}) {
  if(id==='appearance')return <Detail title="Aspecto" close={close}><div className="appearance-picker"><button className={prefs.appearance==='light'?'selected':''} onClick={()=>set('appearance','light')}><span className="appearance-preview light"/><b>Claro</b></button><button className={prefs.appearance==='dark'?'selected':''} onClick={()=>set('appearance','dark')}><span className="appearance-preview dark"/><b>Oscuro</b></button></div></Detail>;
  if(id==='liquidGlass')return <Detail title="Liquid Glass" close={close}><p>Personaliza la transparencia y el tinte del material del sistema.</p><input className="settings-slider" type="range" min="0" max="100" value={prefs.liquidGlass} onChange={e=>set('liquidGlass',+e.target.value)}/><strong>{prefs.liquidGlass}%</strong></Detail>;
  if(id==='brightness'||id==='sound'){const label=id==='brightness'?'Brillo':'Volumen';return <Detail title={label} close={close}><input className="settings-slider" type="range" min="0" max="100" value={prefs[id]} onChange={e=>set(id,+e.target.value)}/><strong>{prefs[id]}%</strong></Detail>}
  if(id==='multitasking')return <Multitasking prefs={prefs} set={set} close={close}/>;
  if(id==='storage')return <Detail title="Almacenamiento" close={close}><div className="storage-summary"><strong>rainOS Tablet</strong><div className="storage-bar"><i style={{width:'38%'}}/></div><p>48 GB usados de 128 GB</p></div><div className="settings-sublist"><div>Aplicaciones <b>31,4 GB</b></div><div>Fotos y vídeos <b>8,7 GB</b></div><div>rainOS <b>7,9 GB</b></div><div>Otros datos <b>0,0 GB</b></div></div></Detail>;
  if(id==='update')return <SoftwareUpdate close={close}/>;
  const titles={about:'Acerca de rainOS',notifications:'Notificaciones',focus:'Concentración',privacy:'Privacidad',location:'Localización',diagnostics:'Análisis y mejoras',accessibility:'Accesibilidad'};
  return <Detail title={titles[id]||id} close={close}><div className="settings-detail-list"><div><b>{titles[id]||id}</b><span>Configuración de este dispositivo</span></div><div><b>Estado</b><span>Disponible</span></div></div></Detail>;
}

function Multitasking({prefs,set,close}){return <Detail title="Multitarea y gestos" close={close}><p>Selecciona uno de los tres modos de multitarea. Son opciones independientes del resto de ajustes.</p><div className="mode-picker">{[['fullscreen','Apps a pantalla completa','Una app ocupa toda la pantalla.'],['windowed','Apps en ventanas','Ventanas que puedes mover y redimensionar.'],['stage','Organizador Visual','Grupos de ventanas y apps recientes.']].map(([id,title,text])=><button className={prefs.multitaskingMode===id?'selected':''} onClick={()=>set('multitaskingMode',id)} key={id}><span className="mode-radio"/><span><b>{title}</b><small>{text}</small></span></button>)}</div><label className="settings-check"><input type="checkbox" checked={!!prefs.dockAlwaysVisible} onChange={e=>set('dockAlwaysVisible',e.target.checked)}/><span>Mostrar Dock siempre</span></label><label className="settings-check"><input type="checkbox" checked={!!prefs.menuBarGesture} onChange={e=>set('menuBarGesture',e.target.checked)}/><span>Mostrar barra de menús al deslizar desde arriba</span></label></Detail>}

function SoftwareUpdate({close}){const [status,setStatus]=useState('idle');const [progress,setProgress]=useState(0);const run=()=>{setStatus('checking');setProgress(0);let p=0;const t=setInterval(()=>{p+=5;setProgress(p);if(p>=100){clearInterval(t);setStatus('ready')}},80)};return <Detail title="Actualización del sistema" close={close}><div className="update-card"><b>rainOS 27</b><span>El sistema está actualizado.</span>{status==='idle'&&<button onClick={run}>Buscar actualizaciones</button>}{status==='checking'&&<><div className="update-progress"><i style={{width:`${progress}%`}}/></div><span>Buscando actualizaciones… {progress}%</span></>}{status==='ready'&&<><p>No hay ninguna actualización nueva.</p><button onClick={()=>{setStatus('idle');setProgress(0)}}>Volver a comprobar</button></>}</div></Detail>}
function Detail({title,close,children}){return <div className="settings-detail"><button className="detail-back" onClick={close}>‹ Ajustes</button><h2>{title}</h2><div className="detail-body">{children}</div></div>}
