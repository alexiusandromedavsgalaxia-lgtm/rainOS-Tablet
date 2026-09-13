import { useMemo, useState } from 'react';

const steps = [
  { id: 'welcome', label: 'Bienvenido' },
  { id: 'language', label: 'Idioma y región' },
  { id: 'appearance', label: 'Aspecto' },
  { id: 'network', label: 'Wi‑Fi' },
  { id: 'privacy', label: 'Privacidad' },
  { id: 'security', label: 'Seguridad' },
  { id: 'assistant', label: 'Asistente' },
  { id: 'diagnostics', label: 'Diagnósticos' },
  { id: 'finish', label: 'Final' },
];

export default function SetupAssistant({ onComplete }) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('Español');
  const [region, setRegion] = useState('España');
  const [appearance, setAppearance] = useState('dark');
  const [wifi, setWifi] = useState(true);
  const [passcode, setPasscode] = useState(false);
  const [assistant, setAssistant] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const progress = useMemo(() => Math.round((step / (steps.length - 1)) * 100), [step]);
  const next = () => step === steps.length - 1 ? onComplete({ language, region, appearance, wifi, passcode, assistant, analytics }) : setStep(value => value + 1);
  const current = steps[step].id;

  return <div className="setup-backdrop">
    <section className="setup-card" aria-label="Configuración inicial">
      <div className="setup-progress"><span style={{ width: `${progress}%` }} /></div>
      {current === 'welcome' && <div className="setup-page"><div className="setup-logo">rain</div><h1>Bienvenido a rainOS</h1><p>Configura tu tablet paso a paso. Las decisiones que tomes aquí se pueden cambiar después desde Ajustes.</p></div>}
      {current === 'language' && <div className="setup-page"><h2>Idioma y región</h2><p>Elige cómo mostrará rainOS las fechas, horas, números y menús.</p><label>Idioma<select value={language} onChange={e => setLanguage(e.target.value)}><option>Español</option><option>English</option><option>Français</option><option>Deutsch</option><option>Italiano</option><option>Português</option></select></label><label>Región<select value={region} onChange={e => setRegion(e.target.value)}><option>España</option><option>Portugal</option><option>Francia</option><option>Alemania</option><option>Italia</option><option>Reino Unido</option></select></label></div>}
      {current === 'appearance' && <div className="setup-page"><h2>Elige tu aspecto</h2><p>Puedes cambiarlo en cualquier momento desde Ajustes.</p><div className="appearance-picker"><button className={appearance === 'light' ? 'selected' : ''} onClick={() => setAppearance('light')}><b>Claro</b><span>Fondo claro</span></button><button className={appearance === 'dark' ? 'selected' : ''} onClick={() => setAppearance('dark')}><b>Oscuro</b><span>Fondo oscuro</span></button></div></div>}
      {current === 'network' && <div className="setup-page"><h2>Conéctate a Wi‑Fi</h2><p>Configura una red ahora o continúa sin conexión. Puedes hacerlo más tarde desde el Centro de Control.</p><button className={`setup-choice ${wifi ? 'selected' : ''}`} onClick={() => setWifi(v => !v)}><span>⌁</span><b>Wi‑Fi</b><small>{wifi ? 'Activado · red disponible' : 'Configurar más tarde'}</small></button></div>}
      {current === 'privacy' && <div className="setup-page"><h2>Privacidad</h2><p>Las funciones de diagnóstico y personalización son opcionales. rainOS no necesita activar el envío de diagnósticos para funcionar.</p><button className={`setup-choice ${analytics ? 'selected' : ''}`} onClick={() => setAnalytics(v => !v)}><span>◉</span><b>Compartir diagnósticos</b><small>{analytics ? 'Permitido' : 'No compartir'}</small></button></div>}
      {current === 'security' && <div className="setup-page"><h2>Protege tu tablet</h2><p>Activa un código local para proteger el acceso a la configuración y a los datos guardados en este dispositivo.</p><button className={`setup-choice ${passcode ? 'selected' : ''}`} onClick={() => setPasscode(v => !v)}><span>⌑</span><b>Código del dispositivo</b><small>{passcode ? 'Activado' : 'Configurar más tarde'}</small></button></div>}
      {current === 'assistant' && <div className="setup-page"><h2>Asistente de rainOS</h2><p>Permite que el asistente ayude con búsquedas y acciones dentro del sistema. Puedes desactivarlo más tarde.</p><button className={`setup-choice ${assistant ? 'selected' : ''}`} onClick={() => setAssistant(v => !v)}><span>✦</span><b>Asistente</b><small>{assistant ? 'Activado' : 'Desactivado'}</small></button></div>}
      {current === 'diagnostics' && <div className="setup-page"><h2>Últimos ajustes</h2><p>Ya casi está. El sistema guardará estas preferencias localmente y podrás modificarlas desde Ajustes.</p><div className="setup-choice selected"><span>✓</span><b>Configuración local</b><small>Preparada para empezar</small></div></div>}
      {current === 'finish' && <div className="setup-page"><div className="setup-logo">✓</div><h1>Todo listo</h1><p>Tu tablet está preparada.</p><small>{language} · {region} · {appearance === 'dark' ? 'modo oscuro' : 'modo claro'} · Wi‑Fi {wifi ? 'activado' : 'desactivado'}</small></div>}
      <footer><span>{steps[step].label} · {step + 1} de {steps.length}</span><button onClick={next}>{step === steps.length - 1 ? 'Empezar' : 'Continuar'}</button></footer>
    </section>
  </div>;
}
