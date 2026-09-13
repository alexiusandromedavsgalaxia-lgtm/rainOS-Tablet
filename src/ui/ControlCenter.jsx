export default function ControlCenter({ wifi, bluetooth, brightness, sound, onWifi, onBluetooth, onBrightness, onSound }) {
  return <aside className="control-center" aria-label="Centro de Control">
    <header className="cc-header"><div><span>rainOS</span><h2>Centro de Control</h2></div><button aria-label="Cerrar Centro de Control" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))}>×</button></header>
    <div className="cc-grid">
      <section className="cc-connectivity">
        <button className={`cc-tile ${wifi?'active':''}`} onClick={onWifi}><span className="cc-glyph">⌁</span><div><b>Wi‑Fi</b><small>{wifi?'Conectado':'Desactivado'}</small></div></button>
        <button className={`cc-tile ${bluetooth?'active':''}`} onClick={onBluetooth}><span className="cc-glyph">ᛒ</span><div><b>Bluetooth</b><small>{bluetooth?'Activado':'Desactivado'}</small></div></button>
        <button className="cc-tile"><span className="cc-glyph">◐</span><div><b>Enfoque</b><small>Desactivado</small></div></button>
        <button className="cc-tile"><span className="cc-glyph">⌁</span><div><b>Compartir</b><small>Solo contactos</small></div></button>
      </section>
      <section className="cc-slider-card"><div className="cc-slider-icon">☼</div><div><span>Brillo</span><b>{brightness}%</b></div><input aria-label="Brillo" type="range" min="20" max="100" value={brightness} onChange={event => onBrightness(Number(event.target.value))} /></section>
      <section className="cc-slider-card"><div className="cc-slider-icon">◖</div><div><span>Volumen</span><b>{sound}%</b></div><input aria-label="Volumen" type="range" min="0" max="100" value={sound} onChange={event => onSound(Number(event.target.value))} /></section>
      <section className="cc-media"><div><span>REPRODUCCIÓN</span><strong>Nada se está reproduciendo</strong></div><div className="cc-media-controls"><button aria-label="Anterior">‹</button><button aria-label="Reproducir">▶</button><button aria-label="Siguiente">›</button></div></section>
    </div>
  </aside>;
}
