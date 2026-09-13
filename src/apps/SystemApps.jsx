import { useMemo, useState } from 'react';

const filesByFolder = {
  'En mi iPad': [{ name: 'Aplicaciones', kind: 'folder' }, { name: 'Documentos', kind: 'folder' }, { name: 'Descargas', kind: 'folder' }, { name: 'rainOS', kind: 'folder' }],
  Documentos: [{ name: 'Notas.txt', kind: 'file', meta: '2 KB' }, { name: 'Proyecto.rain', kind: 'file', meta: '18 KB' }],
  Descargas: [{ name: 'rainOS-update.pkg', kind: 'file', meta: '42 MB' }, { name: 'wallpaper.png', kind: 'file', meta: '3.4 MB' }],
  rainOS: [{ name: 'Apps', kind: 'folder' }, { name: 'System', kind: 'folder' }, { name: 'Users', kind: 'folder' }],
};

export function Files() {
  const [folder, setFolder] = useState('En mi iPad');
  const [selected, setSelected] = useState(null);
  const items = filesByFolder[folder] || filesByFolder['En mi iPad'];
  return <div className="files-app">
    <aside className="files-sidebar"><div className="files-location-title">Ubicaciones</div>{['En mi iPad', 'Documentos', 'Descargas', 'rainOS'].map(item => <button key={item} className={folder === item ? 'active' : ''} onClick={() => { setFolder(item); setSelected(null); }}><span className={item === 'En mi iPad' ? 'file-side-icon ipad' : 'file-side-icon folder'} />{item}</button>)}</aside>
    <main className="files-main"><header><div><span className="eyebrow">Archivos</span><h1>{folder}</h1></div><div className="files-toolbar"><button aria-label="Nueva carpeta">＋</button><button aria-label="Más opciones">•••</button></div></header><div className="files-breadcrumb">{folder === 'En mi iPad' ? 'Ubicaciones' : 'En mi iPad  ›  ' + folder}</div><div className="files-grid">{items.map(item => <button key={item.name} className={`file-card ${selected === item.name ? 'selected' : ''}`} onClick={() => setSelected(item.name)}><span className={`file-large-icon ${item.kind}`} /><b>{item.name}</b>{item.meta && <small>{item.meta}</small>}</button>)}</div>{selected && <footer className="files-selection">{selected} <span>seleccionado</span></footer>}</main>
  </div>;
}

export function Notes() {
  const [notes, setNotes] = useState([{ id: 1, title: 'Bienvenido a rainOS', body: 'Explora rainOS y personaliza tu experiencia.' }, { id: 2, title: 'Ideas', body: '' }]);
  const [selected, setSelected] = useState(1);
  const current = notes.find(note => note.id === selected) || notes[0];
  const update = field => event => setNotes(items => items.map(note => note.id === current.id ? { ...note, [field]: event.target.value } : note));
  const add = () => { const id = Date.now(); setNotes(items => [{ id, title: 'Nueva nota', body: '' }, ...items]); setSelected(id); };
  return <div className="notes-app"><aside className="notes-sidebar"><header><div><span className="eyebrow">Notas</span><h1>Todas</h1></div><button onClick={add} aria-label="Nueva nota">✎</button></header><label className="notes-search">⌕ <input placeholder="Buscar" /></label><div className="notes-list">{notes.map(note => <button key={note.id} className={selected === note.id ? 'selected' : ''} onClick={() => setSelected(note.id)}><b>{note.title || 'Sin título'}</b><small>{note.body || 'Sin texto'}</small></button>)}</div></aside><main className="note-editor"><input className="note-title" value={current.title} onChange={update('title')} placeholder="Título" /><textarea value={current.body} onChange={update('body')} placeholder="Escribe una nota..." /><div className="note-toolbar"><button>✓</button><button>☑</button><button>⌕</button><button>•••</button></div></main></div>;
}

export function Photos() {
  const photos = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ id: i, label: `Foto ${i + 1}`, tone: i % 6 })), []);
  const [tab, setTab] = useState('biblioteca');
  const [selected, setSelected] = useState(null);
  return <div className="photos-app"><aside className="photos-sidebar"><button className={tab === 'biblioteca' ? 'active' : ''} onClick={() => setTab('biblioteca')}>▦ <span>Biblioteca</span></button><button className={tab === 'para-ti' ? 'active' : ''} onClick={() => setTab('para-ti')}>♡ <span>Para ti</span></button><button className={tab === 'albumes' ? 'active' : ''} onClick={() => setTab('albumes')}>▣ <span>Álbumes</span></button></aside><main className="photos-main"><header><div><span className="eyebrow">Fotos</span><h1>{tab === 'biblioteca' ? 'Biblioteca' : tab === 'para-ti' ? 'Para ti' : 'Álbumes'}</h1></div><button className="photos-select">Seleccionar</button></header>{tab === 'albumes' ? <div className="album-cards"><article><div className="album-cover gradient-a"/><b>Recientes</b><small>18 fotos</small></article><article><div className="album-cover gradient-b"/><b>Favoritos</b><small>0 fotos</small></article></div> : <div className="photos-grid">{photos.map(photo => <button key={photo.id} className={`photo-tile tone-${photo.tone} ${selected === photo.id ? 'selected' : ''}`} onClick={() => setSelected(photo.id)}><span>{photo.label}</span></button>)}</div>}</main></div>;
}

export function Safari() {
  const [url, setUrl] = useState('rainos://inicio');
  const [history, setHistory] = useState([]);
  const [tabs, setTabs] = useState([{ id: 1, title: 'Inicio', url: 'rainos://inicio' }]);
  const [activeTab, setActiveTab] = useState(1);
  const navigate = event => { event.preventDefault(); setTabs(items => items.map(tab => tab.id === activeTab ? { ...tab, title: url === 'rainos://inicio' ? 'Inicio' : url.replace(/^https?:\/\//, '').slice(0, 22), url } : tab)); setHistory(items => [url, ...items].slice(0, 10)); };
  const newTab = () => { const id = Date.now(); setTabs(items => [...items, { id, title: 'Inicio', url: 'rainos://inicio' }]); setActiveTab(id); setUrl('rainos://inicio'); };
  return <div className="safari-app"><aside className="safari-tabs"><header><b>Pestañas</b><button onClick={newTab}>＋</button></header>{tabs.map(tab => <button key={tab.id} className={tab.id === activeTab ? 'selected' : ''} onClick={() => { setActiveTab(tab.id); setUrl(tab.url); }}><span className="tab-favicon">◉</span><span>{tab.title}</span><i onClick={e => { e.stopPropagation(); if (tabs.length > 1) { const next = tabs.filter(t => t.id !== tab.id); setTabs(next); if (activeTab === tab.id) { setActiveTab(next[0].id); setUrl(next[0].url); } } }}>×</i></button>)}</aside><main className="safari-main"><div className="safari-toolbar"><button aria-label="Atrás">‹</button><button aria-label="Adelante">›</button><form onSubmit={navigate}><span>⌕</span><input value={url} onChange={e => setUrl(e.target.value)} aria-label="Dirección" /></form><button onClick={() => setHistory([])} aria-label="Recargar">↻</button><button aria-label="Compartir">↑</button></div><section className="safari-start"><div className="safari-orb">◉</div><h1>{url === 'rainos://inicio' ? 'Página de inicio' : url}</h1><p>Una experiencia de navegación local de rainOS.</p><div className="favorites-row"><button>rainOS</button><button>Favoritos</button><button>Historial</button></div>{history.length > 0 && <div className="safari-history"><b>Recientes</b>{history.slice(0, 5).map((item, i) => <span key={`${item}-${i}`}>{item}</span>)}</div>}</section></main></div>;
}

export function Weather() {
  const [unit, setUnit] = useState('C');
  const forecast = [{ day: 'Hoy', temp: 24, icon: '☀', range: '18° / 27°' }, { day: 'Mañana', temp: 25, icon: '◒', range: '19° / 28°' }, { day: 'Jue', temp: 22, icon: '☁', range: '17° / 24°' }, { day: 'Vie', temp: 23, icon: '◔', range: '18° / 25°' }, { day: 'Sáb', temp: 26, icon: '☀', range: '20° / 29°' }];
  return <div className="weather-app"><header className="weather-header"><div><span className="eyebrow">Valencia</span><h1>24°</h1><p>Despejado</p><small>Máx. 27° · Mín. 18°</small></div><div className="weather-sun">☀</div></header><div className="weather-card"><div className="weather-card-title"><b>PRÓXIMAS HORAS</b><span>Ahora</span></div><div className="hourly"><span>20:00<br/><b>☀</b><br/>24°</span><span>21:00<br/><b>☾</b><br/>23°</span><span>22:00<br/><b>☾</b><br/>22°</span><span>23:00<br/><b>☾</b><br/>21°</span></div></div><div className="weather-card"><div className="weather-card-title"><b>PRÓXIMOS DÍAS</b><button onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}>°{unit}</button></div>{forecast.map(item => <div className="forecast-row" key={item.day}><b>{item.day}</b><span>{item.icon}</span><small>{item.range}</small><strong>{item.temp}°</strong></div>)}</div></div>;
}
