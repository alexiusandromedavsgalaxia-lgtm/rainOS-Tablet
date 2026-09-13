import { useMemo, useState } from 'react';

const pad = value => String(value).padStart(2, '0');
const keyFor = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default function Calendar() {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => keyFor(new Date()));
  const [events, setEvents] = useState({});
  const month = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1), [cursor]);
  const firstDay = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + days) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1;
    return day < 1 || day > days ? null : new Date(month.getFullYear(), month.getMonth(), day);
  });
  const title = month.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const addEvent = () => {
    const text = window.prompt('Nuevo evento');
    if (!text?.trim()) return;
    setEvents(current => ({ ...current, [selected]: [...(current[selected] ?? []), text.trim()] }));
  };
  return <div className="calendar-app">
    <header className="calendar-toolbar"><button onClick={() => setCursor(new Date())}>Hoy</button><div><button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>‹</button><strong>{title}</strong><button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>›</button></div><button onClick={addEvent}>＋</button></header>
    <div className="calendar-weekdays">{['lun','mar','mié','jue','vie','sáb','dom'].map(day => <b key={day}>{day}</b>)}</div>
    <div className="calendar-grid">{cells.map((date, index) => date ? <button key={keyFor(date)} className={keyFor(date) === selected ? 'selected' : ''} onClick={() => setSelected(keyFor(date))}><span>{date.getDate()}</span>{events[keyFor(date)]?.length ? <i>{events[keyFor(date)].length}</i> : null}</button> : <span key={`empty-${index}`} />)}</div>
    <section className="calendar-events"><h3>{new Date(`${selected}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>{(events[selected] ?? []).length ? events[selected].map((event, index) => <article key={`${event}-${index}`}><span />{event}</article>) : <p>No hay eventos programados.</p>}</section>
  </div>;
}
