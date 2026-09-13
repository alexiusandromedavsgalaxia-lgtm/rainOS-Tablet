export class Battery {
  constructor({ level = 1, charging = true } = {}) {
    this.level = level;
    this.charging = charging;
  }
  setLevel(level) { this.level = Math.max(0, Math.min(1, level)); }
}
export default Battery;
