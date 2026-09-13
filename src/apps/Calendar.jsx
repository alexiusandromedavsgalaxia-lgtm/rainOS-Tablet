import { useMemo, useState } from 'react';

const pad = value => String(value).padStart(2, '0');
const keyFor = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default function Calendar() {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => keyFor(new Date()));
  const [events, setEvents] = useState({});
  const [view, setView] = useState('month');
  const month = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1), [cursor]);
  const firstDay = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + days) / 7) * 7 }, (_, index) => { const day = index - firstDay + 1; return day < 1 || day > days ? null : new Date(month.getFullYear(), month.getMonth(), day); });
  const title = month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const addEvent = () => { const text = window.prompt('Nuevo evento'); if (!text?.trim()) return; setEvents(current => ({ ...current, [selected]: [...(current[selected] ?? []), text.trim()] })); };
  const move = delta => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  return <div className="calendar-app">
    <header className="calendar-toolbar"><div className="calendar-brand"><span className="eyebrow">Calendario</span><h1>{title}</h1></div><div className="calendar-actions"><button onClick={() => setCursor(new Date())}>Hoy</button><button onClick={() => move(-1)}>‹</button><button onClick={() => move(1)}>›</button><button className="view-picker" onClick={() => setView(view === 'month' ? 'list' : 'month')}>{view === 'month' ? 'Mes' : 'Lista'}⌄</button><button className="add-event" onClick={addEvent}>＋</button></div></header>
    {view === 'month' ? <><div className="calendar-weekdays">{['lun','mar','mié','jue','vie','sáb','dom'].map(day => <b key={day}>{day}</b>)}</div><div className="calendar-grid">{cells.map((date, index) => date ? <button key={keyFor(date)} className={`${keyFor(date) === selected ? 'selected' : ''} ${date.toDateString() === new Date().toDateString() ? 'today' : ''}`} onClick={() => setSelected(keyFor(date))}><span>{date.getDate()}</span>{events[keyFor(date)]?.map((event, i) => <i key={i}>{event}</i>)}</button> : <span key={`empty-${index}`} />)}</div></> : <div className="calendar-list">{Object.entries(events).length ? Object.entries(events).flatMap(([date, items]) => items.map((event, i) => <button key={`${date}-${i}`} onClick={() => setSelected(date)}><b>{new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}</b><span>{event}</span></button>)) : <div className="calendar-empty"><span>○</span><b>No hay eventos</b><small>Tus próximos eventos aparecerán aquí.</small></div>}</div>}
    <section className="calendar-events"><div><span className="event-date">{new Date(`${selected}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span><h2>{(events[selected] ?? []).length ? 'Eventos' : 'Sin eventos'}</h2></div>{(events[selected] ?? []).map((event, index) => <article key={`${event}-${index}`}><span />{event}</article>)}{!(events[selected] ?? []).length && <p>Todo despejado para este día.</p>}</section>
  </div>;
}
