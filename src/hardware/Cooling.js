export class Cooling {
  constructor({ fanCount = 1 } = {}) {
    this.fanCount = fanCount;
    this.enabled = true;
    this.fanSpeed = 0;
    this.temperatureC = 30;
    this.ambientC = 25;
  }

  setFanSpeed(value) { this.fanSpeed = Math.max(0, Math.min(1, Number(value) || 0)); return this.fanSpeed; }
  setEnabled(value) { this.enabled = Boolean(value); if (!this.enabled) this.fanSpeed = 0; return this.enabled; }
  update(heat = 0, seconds = 1) { const effect = this.enabled ? this.fanSpeed * this.fanCount : 0; this.temperatureC += (Math.max(0, heat) - effect) * 0.01 * Math.max(0, seconds); this.temperatureC += (this.ambientC - this.temperatureC) * 0.001; return this.temperatureC; }
  snapshot() { return { fanCount: this.fanCount, enabled: this.enabled, fanSpeed: this.fanSpeed, temperatureC: this.temperatureC, ambientC: this.ambientC }; }
}

export default Cooling;
