import { useMemo, useState } from 'react';

const steps = ['Hola', 'Región', 'Red', 'Privacidad', 'Final'];

export default function SetupAssistant({ onComplete }) {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState('España');
  const [wifi, setWifi] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const progress = useMemo(() => Math.round((step / (steps.length - 1)) * 100), [step]);
  const next = () => step === steps.length - 1 ? onComplete() : setStep(value => value + 1);
  return <div className="setup-backdrop"><section className="setup-card"><div className="setup-progress"><span style={{ width: `${progress}%` }} /></div>{step === 0 && <div className="setup-page"><div className="setup-logo">rain</div><h1>Bienvenido a rainOS</h1><p>Vamos a dejar tu tablet preparada. Puedes cambiar estas opciones más tarde desde Ajustes.</p></div>}{step === 1 && <div className="setup-page"><h2>Idioma y región</h2><p>Selecciona la región que utilizará el sistema para fechas, horas y formatos.</p><label>Región<select value={region} onChange={event => setRegion(event.target.value)}><option>España</option><option>Portugal</option><option>Francia</option><option>Alemania</option><option>Italia</option><option>Reino Unido</option></select></label></div>}{step === 2 && <div className="setup-page"><h2>Conexión a internet</h2><p>La red puede configurarse ahora o más tarde.</p><button className={`setup-choice ${wifi ? 'selected' : ''}`} onClick={() => setWifi(value => !value)}><span>⌁</span><b>Wi‑Fi</b><small>{wifi ? 'Activado' : 'Desactivado'}</small></button></div>}{step === 3 && <div className="setup-page"><h2>Privacidad</h2><p>rainOS mantiene los diagnósticos opcionales y te permite cambiar esta decisión desde Ajustes.</p><button className={`setup-choice ${analytics ? 'selected' : ''}`} onClick={() => setAnalytics(value => !value)}><span>◉</span><b>Compartir diagnósticos</b><small>{analytics ? 'Permitido' : 'No compartir'}</small></button></div>}{step === 4 && <div className="setup-page"><div className="setup-logo">✓</div><h1>Todo listo</h1><p>Tu tablet está configurada para empezar a usar rainOS.</p><small>Región: {region} · Wi‑Fi: {wifi ? 'activado' : 'desactivado'}</small></div>}<footer><span>{steps[step]} · {step + 1} de {steps.length}</span><button onClick={next}>{step === steps.length - 1 ? 'Empezar' : 'Continuar'}</button></footer></section></div>;
}
