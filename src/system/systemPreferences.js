const KEY = 'rainos.preferences.v4';

export const defaultPreferences = {
  appearance: 'dark',
  liquidGlass: 70,
  wifi: true,
  bluetooth: true,
  airplaneMode: false,
  brightness: 80,
  sound: 70,
  sounds: true,
  haptics: true,
  reducedMotion: false,
  boldText: false,
  appIconSize: 'medium',
  multitaskingMode: 'windows',
  dockAlwaysVisible: false,
  menuBarGesture: true,
};

export function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { ...defaultPreferences, ...saved };
  } catch {
    return { ...defaultPreferences };
  }
}

export function savePreferences(prefs) {
  const next = { ...defaultPreferences, ...prefs };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('rainos-preferences', { detail: next }));
  return next;
}

export function updatePreference(key, value) {
  return savePreferences({ ...loadPreferences(), [key]: value });
}
