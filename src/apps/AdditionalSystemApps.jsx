import { useMemo, useState } from 'react';

const catalog = {
  contacts: { title: 'Contactos', tabs: ['Todos', 'Favoritos', 'Grupos'], hero: 'contacts', items: ['Mamá', 'Papá', 'Amigos', 'Trabajo'] },
  maps: { title: 'Mapas', tabs: ['Explorar', 'Buscar', 'Biblioteca'], hero: 'maps', items: ['Casa', 'Trabajo', 'Lugares guardados'] },
  reminders: { title: 'Recordatorios', tabs: ['Hoy', 'Programados', 'Todos'], hero: 'reminders', items: ['Comprar leche', 'Terminar proyecto', 'Llamar a casa'] },
  freeform: { title: 'Freeform', tabs: ['Tableros', 'Recientes', 'Compartidos'], hero: 'freeform', items: ['Ideas', 'Proyecto', 'Viaje'] },
  home: { title: 'Casa', tabs: ['Inicio', 'Habitaciones', 'Automatizaciones'], hero: 'home', items: ['Luces', 'Clima', 'Escenas'] },
  shortcuts: { title: 'Atajos', tabs: ['Todos los atajos', 'Automatización', 'Galería'], hero: 'shortcuts', items: ['Abrir música', 'Modo estudio', 'Buenas noches'] },
  findmy: { title: 'Buscar', tabs: ['Personas', 'Dispositivos', 'Objetos'], hero: 'findmy', items: ['Este dispositivo', 'iPad', 'Mochila'] },
  facetime: { title: 'FaceTime', tabs: ['Llamadas', 'Contactos'], hero: 'facetime', items: ['Mamá', 'Papá', 'Amigos'] },
  books: { title: 'Libros', tabs: ['Leer ahora', 'Biblioteca', 'Tienda'], hero: 'books', items: ['Biblioteca', 'Recomendado para ti', 'Leídos recientemente'] },
  podcasts: { title: 'Podcasts', tabs: ['Escuchar ahora', 'Biblioteca', 'Explorar'], hero: 'podcasts', items: ['Nuevos episodios', 'Tus programas', 'Descubrir'] },
  tv: { title: 'TV', tabs: ['Ver ahora', 'Apple TV+', 'Biblioteca'], hero: 'tv', items: ['Continuar viendo', 'Películas', 'Series'] },
  tips: { title: 'Consejos', tabs: ['Descubrir', 'Novedades'], hero: 'tips', items: ['Personaliza rainOS', 'Organiza tus apps', 'Usa el Centro de Control'] },
  voice: { title: 'Notas de Voz', tabs: ['Todas las grabaciones', 'Favoritas'], hero: 'voice', items: ['Nueva grabación'] },
};

const heroGlyph = id => ({ maps:'⌖',findmy:'⌖',reminders:'✓',books:'▤',podcasts:'◉',tv:'▶',contacts:'●',facetime:'▰',home:'⌂',shortcuts:'✦',freeform:'✎',tips:'✦',voice:'∿' }[id] || '✦');

export default function AdditionalSystemApp({ id }) {
  if (id === 'camera') return <CameraApp />;
  const meta = catalog[id] ?? { title: id, tabs: ['Inicio'], hero: id, items: ['Recientes', 'Favoritos', 'Compartidos'] };
  const [tab, setTab] = useState(meta.tabs[0]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState(meta.items);
  const filtered = useMemo(() => items.filter(item => item.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const addItem = () => setItems(current => [...current, `Nuevo elemento ${current.length + 1}`]);

  return <div className={`native-app native-${meta.hero}`}>
    <header className="native-header"><div><h1>{meta.title}</h1><span>{tab}</span></div><button onClick={addItem}>＋</button></header>
    <nav className="native-tabs">{meta.tabs.map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}</nav>
    <div className="native-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar" /></div>
    <section className="native-content">
      <div className="native-hero"><span className="native-hero-symbol">{heroGlyph(id)}</span><h2>{meta.title}</h2><p>{tab} · contenido local de rainOS</p></div>
      <div className="native-list">{filtered.map((item, index) => <button key={`${item}-${index}`} className={selected === index ? 'selected' : ''} onClick={() => setSelected(index)}><span className="native-list-icon">{index + 1}</span><span><strong>{item}</strong><small>{id === 'maps' ? 'Ubicación guardada' : 'Elemento del sistema'}</small></span><b>›</b></button>)}</div>
    </section>
  </div>;
}

function CameraApp() {
  const [mode, setMode] = useState('Foto');
  const [captured, setCaptured] = useState(0);
  return <div className="native-app camera-native">
    <div className="native-toolbar"><button>×</button><strong>Cámara</strong><button>⚙</button></div>
    <div className="camera-preview"><div className="camera-focus">＋</div><span className="camera-counter">{captured} capturas</span></div>
    <div className="camera-modes">{['Cine','Vídeo','Foto','Retrato'].map(item => <button className={mode === item ? 'active' : ''} key={item} onClick={() => setMode(item)}>{item}</button>)}</div>
    <div className="camera-controls"><button>↺</button><button className="shutter" onClick={() => setCaptured(v => v + 1)} aria-label="Capturar" /><button>⌾</button></div>
  </div>;
}

export { catalog };
