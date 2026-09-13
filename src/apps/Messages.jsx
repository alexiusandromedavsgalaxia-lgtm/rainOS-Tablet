import { useMemo, useState } from 'react';

const initialThreads = [
  { id: 1, name: 'rainOS', color: 'r', messages: [{ from: 'them', text: 'Bienvenido a Mensajes.' }, { from: 'me', text: 'hola 👋' }] },
  { id: 2, name: 'Soporte', color: 's', messages: [{ from: 'them', text: 'Tu dispositivo está funcionando correctamente.' }] },
];

export default function Messages() {
  const [threads, setThreads] = useState(initialThreads);
  const [selected, setSelected] = useState(1);
  const [text, setText] = useState('');
  const current = useMemo(() => threads.find(thread => thread.id === selected) ?? threads[0], [threads, selected]);
  const send = event => { event.preventDefault(); if (!text.trim()) return; setThreads(items => items.map(thread => thread.id === current.id ? { ...thread, messages: [...thread.messages, { from: 'me', text: text.trim() }] } : thread)); setText(''); };
  return <div className="messages-app"><aside><header><h2>Mensajes</h2><button onClick={() => setThreads(items => [...items, { id: Date.now(), name: 'Nuevo contacto', color: 'n', messages: [] }])}>✎</button></header>{threads.map(thread => <button key={thread.id} className={thread.id === current.id ? 'selected' : ''} onClick={() => setSelected(thread.id)}><span className="message-avatar">{thread.color.toUpperCase()}</span><span><b>{thread.name}</b><small>{thread.messages.at(-1)?.text ?? 'Nuevo mensaje'}</small></span></button>)}</aside><main><header><span className="message-avatar">{current.color.toUpperCase()}</span><b>{current.name}</b></header><div className="message-history">{current.messages.map((message, index) => <p key={index} className={message.from}>{message.text}</p>)}</div><form onSubmit={send}><input value={text} onChange={event => setText(event.target.value)} placeholder="iMessage" /><button aria-label="Enviar">↑</button></form></main></div>;
}
