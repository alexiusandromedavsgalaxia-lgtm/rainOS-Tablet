import { useEffect, useMemo, useState } from 'react';
import { apps } from '../apps/appRegistry.js';

export default function SearchOverlay({ onClose, onOpenApp }) {
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  useEffect(() => { const id = setTimeout(() => document.querySelector('.spotlight-input')?.focus(), 40); return () => clearTimeout(id); }, []);
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('es-ES');
    if (!q) return apps.slice(0, 8);
    return apps.filter(app => app.name.toLocaleLowerCase('es-ES').includes(q)).slice(0, 8);
  }, [query]);
  const askSiri = () => {
    setListening(true);
    window.setTimeout(() => setListening(false), 1400);
  };
  return <aside className="spotlight-overlay" aria-label="Buscar con Spotlight">
    <button className="spotlight-dismiss" onClick={onClose} aria-label="Cerrar búsqueda" />
    <section className="spotlight-panel">
      <div className="spotlight-search-row">
        <span className="spotlight-symbol" aria-hidden="true">⌕</span>
        <input className="spotlight-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar" aria-label="Buscar" />
        <button className={`spotlight-siri ${listening ? 'listening' : ''}`} onClick={askSiri} aria-label="Buscar con Siri">◉</button>
      </div>
      {listening && <div className="spotlight-listening">Siri está escuchando…</div>}
      <div className="spotlight-results">
        {results.map(app => <button key={app.id} className="spotlight-result" onClick={() => onOpenApp(app)}>
          <span className={`icon-art icon-art-${app.id}`} />
          <span><strong>{app.name}</strong><small>Aplicación</small></span>
        </button>)}
        {!results.length && <div className="spotlight-empty">No se encontraron resultados</div>}
      </div>
    </section>
  </aside>;
}
