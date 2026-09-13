import { useMemo, useState } from 'react';

const seed = [
  { id: 1, sender: 'rainOS', subject: 'Bienvenido a tu iPad', body: 'Tu sistema está listo para configurarse.', unread: true, time: '19:02' },
  { id: 2, sender: 'App Store', subject: 'Novedades de aplicaciones', body: 'Hay nuevas aplicaciones disponibles para explorar.', unread: true, time: '17:41' },
  { id: 3, sender: 'Sistema', subject: 'Copia de seguridad', body: 'La última copia de seguridad virtual se completó correctamente.', unread: false, time: 'Lun' },
];

export default function Mail() {
  const [messages, setMessages] = useState(seed);
  const [selected, setSelected] = useState(null);
  const [composer, setComposer] = useState(false);
  const current = messages.find(message => message.id === selected);
  const unread = useMemo(() => messages.filter(message => message.unread).length, [messages]);
  const open = id => { setSelected(id); setMessages(items => items.map(item => item.id === id ? { ...item, unread: false } : item)); };
  return <div className="mail-app">
    <aside><header><h2>Buzones</h2><button onClick={() => setComposer(true)}>✎</button></header><button className="mail-folder active">Entrada <b>{unread}</b></button><button className="mail-folder">VIP</button><button className="mail-folder">Enviados</button><button className="mail-folder">Papelera</button></aside>
    <section className="mail-list"><header><h2>Entrada</h2><span>{messages.length}</span></header>{messages.map(message => <button key={message.id} className={`mail-row ${message.unread ? 'unread' : ''}`} onClick={() => open(message.id)}><span className="mail-avatar">{message.sender[0]}</span><span><b>{message.sender}</b><strong>{message.subject}</strong><small>{message.body}</small></span><time>{message.time}</time></button>)}</section>
    <main className="mail-reader">{current ? <><div className="mail-reader-head"><button onClick={() => setSelected(null)}>‹ Entrada</button><button>•••</button></div><h1>{current.subject}</h1><p className="mail-meta">De {current.sender} · {current.time}</p><p>{current.body}</p></> : <div className="mail-empty">Selecciona un mensaje</div>}</main>
    {composer && <div className="mail-composer"><header><button onClick={() => setComposer(false)}>Cancelar</button><b>Nuevo mensaje</b><button onClick={() => setComposer(false)}>Enviar</button></header><input placeholder="Para" autoFocus /><input placeholder="Asunto" /><textarea placeholder="Escribe tu mensaje…" /></div>}
  </div>;
}
