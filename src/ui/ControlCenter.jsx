export default function ControlCenter({ wifi, bluetooth, brightness, sound, onWifi, onBluetooth, onBrightness, onSound }) {
  return <aside className="control-center"><h2>Centro de Control</h2><div className="controls">
    <button className={wifi ? 'active' : ''} onClick={onWifi}>Wi‑Fi<br /><b>{wifi ? 'Conectado' : 'Desactivado'}</b></button>
    <button className={bluetooth ? 'active' : ''} onClick={onBluetooth}>Bluetooth<br /><b>{bluetooth ? 'Activado' : 'Desactivado'}</b></button>
    <label>Brillo <b>{brightness}%</b><input type="range" min="20" max="100" value={brightness} onChange={event => onBrightness(Number(event.target.value))} /></label>
    <label>Sonido <b>{sound}%</b><input type="range" min="0" max="100" value={sound} onChange={event => onSound(Number(event.target.value))} /></label>
  </div></aside>;
}
