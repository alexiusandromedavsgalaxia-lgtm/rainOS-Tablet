import { useMemo, useState } from 'react';

const seed = [
  { id: 1, sender: 'rainOS', address: 'hello@rainos.local', subject: 'Bienvenido a rainOS', body: 'Tu iPad virtual está listo. Explora las nuevas funciones del sistema.', unread: true, time: '19:02', date: 'Hoy' },
  { id: 2, sender: 'App Store', address: 'store@rainos.local', subject: 'Novedades de aplicaciones', body: 'Descubre las últimas aplicaciones y actualizaciones disponibles.', unread: true, time: '17:41', date: 'Hoy' },
  { id: 3, sender: 'Sistema', address: 'system@rainos.local', subject: 'Copia de seguridad completada', body: 'La copia de seguridad virtual se completó correctamente.', unread: false, time: 'Lun', date: '8 de septiembre' },
  { id: 4, sender: 'Calendario', address: 'calendar@rainos.local', subject: 'Próximo evento', body: 'Tienes eventos pendientes en tu calendario.', unread: false, time: 'Dom', date: '7 de septiembre' },
];

export default function Mail() {
  const [messages, setMessages] = useState(seed);
  const [selected, setSelected] = useState(null);
  const [composer, setComposer] = useState(false);
  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState('Entrada');
  const [draft, setDraft] = useState({ to: '', subject: '', body: '' });
  const current = messages.find(message => message.id === selected);
  const unread = useMemo(() => messages.filter(message => message.unread).length, [messages]);
  const filtered = messages.filter(message => !query || `${message.sender} ${message.subject} ${message.body}`.toLowerCase().includes(query.toLowerCase()));

  const open = id => {
    setSelected(id);
    setMessages(items => items.map(item => item.id === id ? { ...item, unread: false } : item));
  };
  const send = () => {
    if (!draft.to.trim() && !draft.subject.trim() && !draft.body.trim()) return;
    setComposer(false);
    setDraft({ to: '', subject: '', body: '' });
  };

  return <div className="mail-app">
    <aside className="mail-sidebar">
      <div className="mail-sidebar-head"><div><span>Correo</span><h1>Buzones</h1></div><button className="mail-compose-button" onClick={() => setComposer(true)} aria-label="Nuevo correo">✎</button></div>
      <div className="mail-account"><span className="mail-account-avatar">R</span><span><b>rainOS</b><small>iCloud Mail</small></span><span>›</span></div>
      <nav className="mail-folders">
        {[["Entrada", unread, '⌂'], ['VIP', 0, '★'], ['Borradores', 0, '□'], ['Enviados', 0, '↑'], ['Papelera', 0, '⌫']].map(([name, count, icon]) => <button key={name} className={folder === name ? 'active' : ''} onClick={() => setFolder(name)}><i>{icon}</i><span>{name}</span>{count > 0 && <b>{count}</b>}</button>)}
      </nav>
      <button className="mail-folder settings"><i>⚙</i><span>Editar</span></button>
    </aside>

    <section className="mail-list">
      <header className="mail-list-header"><div><span>{folder}</span><h2>{folder}</h2></div><button onClick={() => setMessages(seed)}>↻</button></header>
      <label className="mail-search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar"/><kbd>⌘</kbd><kbd>F</kbd></label>
      <div className="mail-list-count">{filtered.length} mensajes</div>
      <div className="mail-message-list">{filtered.map(message => <button key={message.id} className={`mail-row ${message.unread ? 'unread' : ''} ${selected === message.id ? 'selected' : ''}`} onClick={() => open(message.id)}><span className="mail-avatar">{message.sender[0]}</span><span className="mail-row-content"><span className="mail-row-top"><b>{message.sender}</b><time>{message.time}</time></span><strong>{message.subject}</strong><small>{message.body}</small></span>{message.unread && <i className="mail-unread-dot"/>}</button>)}</div>
    </section>

    <main className="mail-reader">{current ? <>
      <header className="mail-reader-toolbar"><button onClick={() => setSelected(null)}>‹</button><div/><button>↩</button><button>⌫</button><button>⋯</button></header>
      <article className="mail-message"><div className="mail-message-heading"><span className="mail-large-avatar">{current.sender[0]}</span><div><h1>{current.subject}</h1><b>{current.sender}</b><small>{current.address}</small></div><time>{current.date} · {current.time}</time></div><div className="mail-message-body"><p>Hola,</p><p>{current.body}</p><p>Este mensaje forma parte de la experiencia de correo simulada de rainOS.</p><p>Un saludo,<br/>rainOS</p></div></article>
    </> : <div className="mail-reader-empty"><span>✉</span><h2>Ningún mensaje seleccionado</h2><p>Selecciona un correo de la lista para leerlo.</p></div>}</main>

    {composer && <div className="mail-composer-backdrop" onMouseDown={() => setComposer(false)}><section className="mail-composer" onMouseDown={e => e.stopPropagation()}><header><button onClick={() => setComposer(false)}>Cancelar</button><b>Nuevo mensaje</b><button className="send" onClick={send}>Enviar</button></header><div className="mail-compose-fields"><label>Para<input value={draft.to} onChange={e => setDraft(d => ({ ...d, to: e.target.value }))} autoFocus/></label><label>Asunto<input value={draft.subject} onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))}/></label><textarea value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} placeholder="Escribe tu mensaje…"/></div></section></div>}
  </div>;
}
