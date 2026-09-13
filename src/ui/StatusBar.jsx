export default function StatusBar({ time, wifi, bluetooth = true, battery = 100, charging = false, title = 'rainOS' }) {
  const batteryLevel = Math.max(0, Math.min(100, Math.round(battery)));
  return <header className="statusbar" aria-label="Barra de estado">
    <span className="status-time">{time}</span>
    <span className="status-title">{title}</span>
    <span className="status-indicators" aria-label="Estado del dispositivo">
      <span title={wifi ? 'Wi‑Fi conectado' : 'Wi‑Fi desactivado'}>{wifi ? '◉' : '○'}</span>
      <span title={bluetooth ? 'Bluetooth activado' : 'Bluetooth desactivado'}>{bluetooth ? 'ᛒ' : '·'}</span>
      <span className="signal-bars" aria-hidden="true">▮▮▮</span>
      <span title={`${batteryLevel}% de batería`}>{charging ? '⚡' : ''}{batteryLevel}%</span>
    </span>
  </header>;
}
