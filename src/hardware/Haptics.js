export class Haptics {
  constructor({ actuatorCount = 1, maxIntensity = 1 } = {}) {
    this.actuatorCount = actuatorCount;
    this.maxIntensity = maxIntensity;
    this.enabled = true;
    this.intensity = 0;
    this.active = false;
    this.patterns = new Map();
    this.lastPattern = null;
    this.activationCount = 0;
  }

  setEnabled(enabled) { this.enabled = Boolean(enabled); if (!this.enabled) this.stop(); return this.enabled; }
  registerPattern(name, steps) { this.patterns.set(name, steps.map(step => ({ durationMs: step.durationMs, intensity: Math.max(0, Math.min(this.maxIntensity, step.intensity ?? 1)) }))); return name; }
  play(name = null) { if (!this.enabled) return false; this.active = true; this.activationCount += 1; this.lastPattern = name; if (name && !this.patterns.has(name)) throw new Error('Unknown haptic pattern'); return true; }
  stop() { this.active = false; this.intensity = 0; return true; }
  pulse(intensity = 1) { if (!this.enabled) return false; this.intensity = Math.max(0, Math.min(this.maxIntensity, intensity)); this.active = true; this.activationCount += 1; return this.intensity; }
  snapshot() { return { actuatorCount: this.actuatorCount, enabled: this.enabled, active: this.active, intensity: this.intensity, activationCount: this.activationCount, lastPattern: this.lastPattern, patternCount: this.patterns.size }; }
}

export default Haptics;
