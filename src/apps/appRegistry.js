export const apps = [
  { id: 'files', name: 'Archivos', glyph: '📁' },
  { id: 'notes', name: 'Notas', glyph: '📝' },
  { id: 'photos', name: 'Fotos', glyph: '🌈' },
  { id: 'safari', name: 'Safari', glyph: '🧭' },
  { id: 'settings', name: 'Ajustes', glyph: '⚙️' },
  { id: 'calculator', name: 'Calculadora', glyph: '🧮' },
  { id: 'clock', name: 'Reloj', glyph: '🕘' },
  { id: 'weather', name: 'Tiempo', glyph: '☀️' },
];

export function getApp(id) {
  return apps.find(app => app.id === id) ?? null;
}
