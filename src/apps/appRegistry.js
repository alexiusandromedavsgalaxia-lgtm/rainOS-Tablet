export const apps = [
  { id: 'calendar', name: 'Calendario', category: 'productivity', system: true },
  { id: 'photos', name: 'Fotos', category: 'media', system: true },
  { id: 'camera', name: 'Cámara', category: 'media', system: true },
  { id: 'mail', name: 'Mail', category: 'communication', system: true },
  { id: 'messages', name: 'Mensajes', category: 'communication', system: true, badge: 2 },
  { id: 'facetime', name: 'FaceTime', category: 'communication', system: true },
  { id: 'contacts', name: 'Contactos', category: 'communication', system: true },
  { id: 'safari', name: 'Safari', category: 'internet', system: true },
  { id: 'maps', name: 'Mapas', category: 'navigation', system: true },
  { id: 'findmy', name: 'Buscar', category: 'navigation', system: true },
  { id: 'music', name: 'Música', category: 'media', system: true },
  { id: 'tv', name: 'TV', category: 'media', system: true },
  { id: 'podcasts', name: 'Podcasts', category: 'media', system: true },
  { id: 'books', name: 'Libros', category: 'media', system: true },
  { id: 'notes', name: 'Notas', category: 'productivity', system: true },
  { id: 'reminders', name: 'Recordatorios', category: 'productivity', system: true },
  { id: 'freeform', name: 'Freeform', category: 'productivity', system: true },
  { id: 'files', name: 'Archivos', category: 'productivity', system: true },
  { id: 'shortcuts', name: 'Atajos', category: 'automation', system: true },
  { id: 'home', name: 'Casa', category: 'home', system: true },
  { id: 'settings', name: 'Ajustes', category: 'system', system: true },
  { id: 'appstore', name: 'App Store', category: 'store', system: true },
  { id: 'weather', name: 'Tiempo', category: 'utilities', system: true },
  { id: 'clock', name: 'Reloj', category: 'utilities', system: true },
  { id: 'calculator', name: 'Calculadora', category: 'utilities', system: true },
  { id: 'voice', name: 'Notas de Voz', category: 'utilities', system: true },
  { id: 'tips', name: 'Consejos', category: 'utilities', system: true },
];

export function getApp(id) { return apps.find(app => app.id === id) ?? null; }
export function getAppsByCategory(category) { return apps.filter(app => app.category === category); }
export function getSystemApps() { return apps.filter(app => app.system); }
export function isInstalled(id) { return Boolean(getApp(id)); }
