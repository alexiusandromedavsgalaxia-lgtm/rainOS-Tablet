import { useRef } from 'react';

export default function HomeIndicator({ onHome, onSwitcher }) {
  const start = useRef(null);
  const moved = useRef(false);
  const onStart = e => { const t=e.touches?.[0]; if(t){start.current={x:t.clientX,y:t.clientY};moved.current=false;} };
  const onMove = e => { const t=e.touches?.[0]; if(!t||!start.current)return; if(Math.abs(t.clientY-start.current.y)>18)moved.current=true; };
  const onEnd = e => { const t=e.changedTouches?.[0]; const s=start.current; start.current=null; if(!t||!s)return; const dy=s.y-t.clientY; const dx=Math.abs(t.clientX-s.x); if(dy>70&&dx<120){if(s.y>window.innerHeight-180)onSwitcher?.();else onHome?.();} };
  return <div className="home-indicator-zone" onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} aria-label="Gestos de inicio"><span className="home-indicator" /></div>;
}
