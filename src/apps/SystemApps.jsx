import { useMemo, useState } from 'react';

export function Files() {
  const [folder, setFolder] = useState('En mi iPad');
  const folders = ['En mi iPad', 'Documentos', 'Descargas', 'rainOS'];
  const files = folder === 'Descargas' ? ['rainOS-update.pkg', 'wallpaper.png'] : folder === 'Documentos' ? ['Notas.txt', 'Proyecto.rain'] : ['Aplicaciones', 'Sistema', 'Usuarios'];
  return <div className="system-file-app"><nav>{folders.map(item => <button key={item} className={folder === item ? 'active' : ''} onClick={() => setFolder(item)}>{item}</button>)}</nav><h2>{folder}</h2><div className="file-grid">{files.map(file => <article key={file}><span>{file.includes('.') ? '📄' : '📁'}</span><b>{file}</b></article>)}</div></div>;
}

export function Notes() {
  const [notes, setNotes] = useState([{ id: 1, title: 'Bienvenido a rainOS', body: 'Esta es una nota virtual.' }]);
  const [selected, setSelected] = useState(1);
  const current = notes.find(note => note.id === selected) ?? notes[0];
  const update = field => event => setNotes(items => items.map(note => note.id === current.id ? { ...note, [field]: event.target.value } : note));
  return <div className="notes-app"><aside>{notes.map(note => <button key={note.id} onClick={() => setSelected(note.id)}>{note.title}</button>)}<button onClick={() => { const id = Date.now(); setNotes(items => [...items, { id, title: 'Nueva nota', body: '' }]); setSelected(id); }}>＋ Nueva nota</button></aside><main><input value={current?.title ?? ''} onChange={update('title')} /><textarea value={current?.body ?? ''} onChange={update('body')} /></main></div>;
}

export function Photos() {
  const photos = useMemo(() => Array.from({ length: 12 }, (_, index) => ({ id: index, label: `Foto ${index + 1}` })), []);
  return <div className="photos-grid">{photos.map(photo => <article key={photo.id}><div className="photo-placeholder">🌈</div><span>{photo.label}</span></article>)}</div>;
}

export function Safari() {
  const [url, setUrl] = useState('rainos://inicio');
  const [history, setHistory] = useState([]);
  const navigate = event => { event.preventDefault(); setHistory(items => [url, ...items].slice(0, 10)); };
  return <div className="browser"><form onSubmit={navigate}><input value={url} onChange={event => setUrl(event.target.value)} aria-label="Dirección" /><button>Ir</button></form><section><h2>{url === 'rainos://inicio' ? 'Inicio' : url}</h2><p>Navegador virtual de rainOS. La navegación externa todavía no está conectada.</p>{history.length > 0 && <small>Historial: {history.join(' · ')}</small>}</section></div>;
}

export function Weather() {
  const forecast = [{ day: 'Hoy', temp: 24, icon: '☀️' }, { day: 'Mañana', temp: 25, icon: '🌤️' }, { day: 'Jueves', temp: 22, icon: '☁️' }, { day: 'Viernes', temp: 23, icon: '🌦️' }];
  return <div className="weather-app"><header><span>☀️</span><div><strong>24°</strong><p>Despejado · 18° / 27°</p></div></header><div className="forecast">{forecast.map(item => <article key={item.day}><b>{item.day}</b><span>{item.icon}</span><strong>{item.temp}°</strong></article>)}</div><footer>Tiempo simulado · rainOS Weather Engine</footer></div>;
}
