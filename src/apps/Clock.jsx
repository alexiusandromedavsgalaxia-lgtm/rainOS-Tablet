import { useEffect, useMemo, useState } from 'react';

export default function Clock() {
  const [now, setNow] = useState(new Date());
  const [stopwatch, setStopwatch] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { if (!running) return undefined; const id = setInterval(() => setStopwatch(value => value + 1), 1000); return () => clearInterval(id); }, [running]);
  const time = useMemo(() => now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), [now]);
  const elapsed = `${Math.floor(stopwatch / 60)}:${String(stopwatch % 60).padStart(2, '0')}`;
  return <div className="clock-app"><section className="clock-face"><span>{time}</span><small>{now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</small></section><section className="stopwatch"><h2>Cronómetro</h2><strong>{elapsed}</strong><div><button onClick={() => setRunning(value => !value)}>{running ? 'Pausar' : 'Iniciar'}</button><button onClick={() => { setRunning(false); setStopwatch(0); }}>Restablecer</button></div></section></div>;
}
