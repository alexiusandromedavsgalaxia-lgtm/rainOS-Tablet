export default function StatusBar({ time, wifi }) {
  return <header className="statusbar">
    <span>{time}</span>
    <span className="status-title">rainOS</span>
    <span>{wifi ? '◉' : '○'}　▮▮▮　100%</span>
  </header>;
}
