export const apps = [
  { id: 'files', name: 'Archivos', glyph: '📁', category: 'productivity', system: true },
  { id: 'notes', name: 'Notas', glyph: '📝', category: 'productivity', system: true },
  { id: 'photos', name: 'Fotos', glyph: '🌈', category: 'media', system: true },
  { id: 'safari', name: 'Safari', glyph: '🧭', category: 'internet', system: true },
  { id: 'settings', name: 'Ajustes', glyph: '⚙️', category: 'system', system: true },
  { id: 'calculator', name: 'Calculadora', glyph: '🧮', category: 'utilities', system: true },
  { id: 'clock', name: 'Reloj', glyph: '🕘', category: 'utilities', system: true },
  { id: 'weather', name: 'Tiempo', glyph: '☀️', category: 'utilities', system: true },
];

export function getApp(id) { return apps.find(app => app.id === id) ?? null; }
export function getAppsByCategory(category) { return apps.filter(app => app.category === category); }
export function getSystemApps() { return apps.filter(app => app.system); }
export function isInstalled(id) { return Boolean(getApp(id)); }
