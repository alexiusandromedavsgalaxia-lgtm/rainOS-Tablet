const KEY='rainos.preferences.v2';
const defaults={appearance:'dark',liquidGlass:'clear',wifi:true,bluetooth:true,brightness:80,sound:70,volumeLimit:100};
export function loadPreferences(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}
export function savePreferences(prefs){const next={...defaults,...prefs};localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new CustomEvent('rainos-preferences',{detail:next}));return next}
export function updatePreference(key,value){return savePreferences({...loadPreferences(),[key]:value})}
export {defaults as defaultPreferences};
