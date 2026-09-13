import { useMemo, useState } from 'react';

const sections = [
  { id: 'about', title: 'General', items: ['Acerca de rainOS', 'Actualización del sistema', 'Almacenamiento', 'Uso de memoria'] },
  { id: 'connectivity', title: 'Conectividad', items: ['Wi‑Fi', 'Bluetooth', 'Red móvil', 'Modo avión'] },
  { id: 'display', title: 'Pantalla', items: ['Brillo', 'Modo oscuro', 'Frecuencia de actualización', 'HDR'] },
  { id: 'sound', title: 'Sonido', items: ['Volumen', 'Sonidos del sistema', 'Hápticos'] },
  { id: 'privacy', title: 'Privacidad', items: ['Permisos', 'Localización', 'Diagnóstico'] },
];

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [selected, setSelected] = useState(null);
  const memory = useMemo(() => ({ total: '8 GB', used: '2.7 GB', free: '5.3 GB' }), []);

  return <div className="settings-list">
    <div><b>rainOS Tablet</b><span>Versión 1.0 · build Tablet-1000</span></div>
    <div><b>Wi‑Fi</b><span><button onClick={() => setWifi(value => !value)}>{wifi ? 'Conectado' : 'Desactivado'}</button></span></div>
    <div><b>Bluetooth</b><span><button onClick={() => setBluetooth(value => !value)}>{bluetooth ? 'Activado' : 'Desactivado'}</button></span></div>
    <div><b>Aspecto</b><span><button onClick={() => setDarkMode(value => !value)}>{darkMode ? 'Oscuro' : 'Claro'}</button></span></div>
    <div><b>Brillo</b><span>{brightness}% <input type="range" min="20" max="100" value={brightness} onChange={event => setBrightness(Number(event.target.value))} /></span></div>
    <div><b>Memoria</b><span>{memory.used} usados · {memory.free} libres de {memory.total}</span></div>
    {sections.map(section => <section key={section.id}><h3>{section.title}</h3>{section.items.map(item => <button key={item} className="settings-row" onClick={() => setSelected(item)}>{item}<span>›</span></button>)}</section>)}
    {selected && <div className="settings-detail"><b>{selected}</b><p>Panel de configuración virtual de rainOS.</p><button onClick={() => setSelected(null)}>Cerrar</button></div>}
  </div>;
}
