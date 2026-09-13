import { useMemo, useState } from 'react';

const catalog = {
  camera: { title: 'Cámara', tabs: ['Foto', 'Vídeo', 'Retrato'], hero: 'camera' },
  contacts: { title: 'Contactos', tabs: ['Todos', 'Grupos'], hero: 'contacts' },
  maps: { title: 'Mapas', tabs: ['Explorar', 'Buscar', 'Biblioteca'], hero: 'maps' },
  reminders: { title: 'Recordatorios', tabs: ['Hoy', 'Programados', 'Todos'], hero: 'reminders' },
  freeform: { title: 'Freeform', tabs: ['Tableros', 'Recientes', 'Compartidos'], hero: 'freeform' },
  home: { title: 'Casa', tabs: ['Inicio', 'Habitaciones', 'Automatizaciones'], hero: 'home' },
  shortcuts: { title: 'Atajos', tabs: ['Todos los atajos', 'Automatización', 'Galería'], hero: 'shortcuts' },
  findmy: { title: 'Buscar', tabs: ['Personas', 'Dispositivos', 'Objetos'], hero: 'findmy' },
  facetime: { title: 'FaceTime', tabs: ['Llamadas', 'Contactos'], hero: 'facetime' },
  books: { title: 'Libros', tabs: ['Leer ahora', 'Biblioteca', 'Tienda'], hero: 'books' },
  podcasts: { title: 'Podcasts', tabs: ['Escuchar ahora', 'Biblioteca', 'Explorar'], hero: 'podcasts' },
  tv: { title: 'TV', tabs: ['Ver ahora', 'Apple TV+', 'Biblioteca'], hero: 'tv' },
  tips: { title: 'Consejos', tabs: ['Descubrir', 'Novedades'], hero: 'tips' },
  voice: { title: 'Notas de Voz', tabs: ['Todas las grabaciones', 'Favoritas'], hero: 'voice' },
};

const seedItems = {
  contacts: ['Mamá', 'Papá', 'Amigos', 'Trabajo'],
  reminders: ['Comprar leche', 'Terminar proyecto', 'Llamar a casa'],
  books: ['Biblioteca', 'Recomendado para ti', 'Leídos recientemente'],
  podcasts: ['Nuevos episodios', 'Tus programas', 'Descubrir'],
  tv: ['Continuar viendo', 'Apple TV+', 'Películas'],
};

export default function AdditionalSystemApp({ id }) {
  const meta = catalog[id] ?? { title: id, tabs: ['Inicio'], hero: 'default' };
  const [tab, setTab] = useState(meta.tabs[0]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const items = seedItems[id] ?? ['Recientes', 'Favoritos', 'Compartidos'];
  const filtered = useMemo(() => items.filter(item => item.toLowerCase().includes(query.toLowerCase())), [items, query]);

  if (id === 'camera') {
    return <div className="native-app camera-native"><div className="native-toolbar"><strong>Cámara</strong><button>Flash</button><button>Live</button></div><div className="camera-preview"><div className="camera-focus">＋</div></div><div className="camera-controls"><button>Fotos</button><button className="shutter" aria-label="Capturar" /><button>Vídeo</button></div></div>;
  }

  return <div className={`native-app native-${meta.hero}`}>
    <header className="native-header"><div><h1>{meta.title}</h1><span>{tab}</span></div><button>•••</button></header>
    <nav className="native-tabs">{meta.tabs.map(item => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}</nav>
    <div className="native-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar" /></div>
    <section className="native-content">
      <div className="native-hero"><span className="native-hero-symbol">{meta.hero === 'maps' || meta.hero === 'findmy' ? '⌖' : meta.hero === 'reminders' ? '✓' : meta.hero === 'books' ? '▤' : meta.hero === 'podcasts' ? '◉' : meta.hero === 'tv' ? '▶' : '✦'}</span><h2>{meta.title}</h2><p>Contenido del sistema</p></div>
      <div className="native-list">{filtered.map((item, index) => <button key={item} className={selected === index ? 'selected' : ''} onClick={() => setSelected(index)}><span className="native-list-icon">{index + 1}</span><span><strong>{item}</strong><small>Información y contenido</small></span><b>›</b></button>)}</div>
    </section>
  </div>;
}

export { catalog };
