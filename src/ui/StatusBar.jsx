import '../styles/system-chrome.css';

export default function StatusBar({ time, wifi, bluetooth = true, battery = 100, charging = false }) {
  const batteryLevel = Math.max(0, Math.min(100, Math.round(battery)));
  return (
    <header className="statusbar" aria-label="Barra de estado">
      <div className="status-leading">
        <time className="status-time">{time}</time>
      </div>
      <div className="status-indicators" aria-label="Estado del dispositivo">
        <span className="status-icon" title={wifi ? 'Wi‑Fi conectado' : 'Wi‑Fi desactivado'} aria-label={wifi ? 'Wi‑Fi conectado' : 'Wi‑Fi desactivado'}>{wifi ? '⌁' : '×'}</span>
        <span className="status-icon" title={bluetooth ? 'Bluetooth activado' : 'Bluetooth desactivado'} aria-label={bluetooth ? 'Bluetooth activado' : 'Bluetooth desactivado'}>{bluetooth ? 'ᛒ' : '·'}</span>
        <span className="signal-bars" aria-label="Señal buena"><i/><i/><i/><i/></span>
        <span className={`battery ${batteryLevel <= 20 ? 'low' : ''}`} aria-label={`${batteryLevel}% de batería`}><i style={{width:`${batteryLevel}%`}}/>{charging && <b>⚡</b>}</span>
        <span className="battery-percent">{batteryLevel}%</span>
      </div>
    </header>
  );
}
