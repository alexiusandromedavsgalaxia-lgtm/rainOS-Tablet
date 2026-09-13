import { useState } from 'react';

const catalog = [
  { id: 'weather', name: 'Tiempo', glyph: '☀️', description: 'Consulta el tiempo de rainOS.' },
  { id: 'notes', name: 'Notas', glyph: '📝', description: 'Escribe y organiza tus notas.' },
  { id: 'calculator', name: 'Calculadora', glyph: '🧮', description: 'Calculadora científica básica.' },
  { id: 'calendar', name: 'Calendario', glyph: '🗓️', description: 'Gestiona tus eventos.' },
];

export default function AppStore() {
  const [installed, setInstalled] = useState(() => new Set(['weather', 'notes', 'calculator', 'calendar']));
  const toggle = id => setInstalled(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  return <div className="store-app"><header><div><span>App Store</span><h1>Descubre aplicaciones</h1><p>Una tienda virtual integrada en rainOS.</p></div></header><section className="store-feature"><b>Destacado</b><h2>rainOS Tablet</h2><p>Explora el sistema y sus aplicaciones incluidas.</p></section><div className="store-grid">{catalog.map(app => <article key={app.id}><div className="store-icon">{app.glyph}</div><div><h3>{app.name}</h3><p>{app.description}</p></div><button onClick={() => toggle(app.id)}>{installed.has(app.id) ? 'Abrir' : 'Obtener'}</button></article>)}</div></div>;
}
