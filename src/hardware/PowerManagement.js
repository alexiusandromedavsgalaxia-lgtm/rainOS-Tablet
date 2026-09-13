export class PowerManagement {
  constructor() {
    this.sleeping = false;
    this.lowPowerMode = false;
  }
  setLowPowerMode(enabled) { this.lowPowerMode = Boolean(enabled); }
  sleep() { this.sleeping = true; }
  wake() { this.sleeping = false; }
}
export default PowerManagement;
