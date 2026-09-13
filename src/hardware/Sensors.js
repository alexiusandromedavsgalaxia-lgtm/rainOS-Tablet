export class Sensors {
  constructor() {
    this.enabled = true;
    this.values = {
      accelerometer: { x: 0, y: 0, z: 9.81 },
      gyroscope: { x: 0, y: 0, z: 0 },
      magnetometer: { x: 0, y: 0, z: 0 },
      ambientLight: 300,
      proximity: 1,
      temperatureC: 25,
      barometerHpa: 1013.25,
    };
    this.sampleRateHz = 100;
    this.listeners = new Map();
    this.sequence = 0;
  }

  setEnabled(enabled) { this.enabled = Boolean(enabled); return this.enabled; }
  set(name, value) { if (!(name in this.values)) throw new Error(`Unknown sensor: ${name}`); this.values[name] = value; this.sequence += 1; return value; }
  read(name) { if (!this.enabled) return null; return this.values[name]; }
  readAll() { return this.enabled ? structuredClone(this.values) : {}; }
  subscribe(name, callback) { if (!this.listeners.has(name)) this.listeners.set(name, new Set()); this.listeners.get(name).add(callback); return () => this.listeners.get(name)?.delete(callback); }
  publish(name, value) { this.set(name, value); for (const callback of this.listeners.get(name) ?? []) callback(value); return value; }
  snapshot() { return { enabled: this.enabled, sampleRateHz: this.sampleRateHz, sequence: this.sequence, values: this.readAll() }; }
}

export default Sensors;
