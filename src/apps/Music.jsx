import { useMemo, useState } from 'react';

const tracks = [
  { id: 1, title: 'Rainfall', artist: 'rainOS Sounds', album: 'Tablet Sessions', duration: '3:42' },
  { id: 2, title: 'Glass Horizon', artist: 'System Audio', album: 'Ambient', duration: '4:18' },
  { id: 3, title: 'Home Screen', artist: 'rainOS Sounds', album: 'Tablet Sessions', duration: '2:57' },
  { id: 4, title: 'Night Mode', artist: 'System Audio', album: 'Ambient', duration: '5:01' },
];

export default function Music() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = tracks[index];
  const progressLabel = useMemo(() => `${Math.floor(progress / 60)}:${String(progress % 60).padStart(2, '0')}`, [progress]);
  const previous = () => setIndex(value => (value - 1 + tracks.length) % tracks.length);
  const next = () => setIndex(value => (value + 1) % tracks.length);
  return <div className="music-app"><aside><h2>Biblioteca</h2><button className="active">Canciones</button><button>Álbumes</button><button>Artistas</button><button>Playlists</button></aside><main><header><span>Escuchando</span><h1>{track.title}</h1><p>{track.artist} · {track.album}</p></header><div className="album-art">♫</div><input className="music-progress" type="range" min="0" max="300" value={progress} onChange={event => setProgress(Number(event.target.value))} /><div className="music-times"><span>{progressLabel}</span><span>{track.duration}</span></div><div className="music-controls"><button onClick={previous}>↶</button><button className="play" onClick={() => setPlaying(value => !value)}>{playing ? 'Ⅱ' : '▶'}</button><button onClick={next}>↷</button></div><section className="track-list">{tracks.map((item, itemIndex) => <button key={item.id} className={itemIndex === index ? 'selected' : ''} onClick={() => { setIndex(itemIndex); setPlaying(true); }}><span>{itemIndex + 1}</span><span><b>{item.title}</b><small>{item.artist}</small></span><time>{item.duration}</time></button>)}</section></main></div>;
}
