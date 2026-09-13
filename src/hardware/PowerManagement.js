export const PowerState = Object.freeze({ ACTIVE: 'active', IDLE: 'idle', SLEEP: 'sleep', HIBERNATE: 'hibernate', SHUTDOWN: 'shutdown' });

export class PowerManagement {
  constructor({ budgetWatts = 18, lowPowerThreshold = 0.2 } = {}) {
    this.state = PowerState.ACTIVE;
    this.sleeping = false;
    this.lowPowerMode = false;
    this.budgetWatts = budgetWatts;
    this.currentLoadWatts = 0;
    this.thermalState = 'nominal';
    this.lowPowerThreshold = lowPowerThreshold;
    this.devices = new Map();
    this.rails = new Map();
    this.transitions = [];
  }

  registerDevice(name, { idleWatts = 0.05, activeWatts = 1 } = {}) {
    const device = { name, idleWatts, activeWatts, enabled: true, requestedWatts: idleWatts };
    this.devices.set(name, device);
    this._recalculate();
    return device;
  }

  setDeviceLoad(name, watts) {
    const device = this.devices.get(name);
    if (!device) throw new Error(`Unknown power device: ${name}`);
    device.requestedWatts = Math.max(0, watts);
    this._recalculate();
    return device.requestedWatts;
  }

  setLowPowerMode(enabled) {
    this.lowPowerMode = Boolean(enabled);
    if (this.lowPowerMode) this.budgetWatts *= 0.7;
    return this.lowPowerMode;
  }

  sleep() { this._transition(PowerState.SLEEP); this.sleeping = true; return this.state; }
  wake() { this._transition(PowerState.ACTIVE); this.sleeping = false; return this.state; }
  hibernate() { this._transition(PowerState.HIBERNATE); this.sleeping = true; return this.state; }
  shutdown() { this._transition(PowerState.SHUTDOWN); this.sleeping = true; for (const device of this.devices.values()) device.enabled = false; this._recalculate(); return this.state; }
  resume() { for (const device of this.devices.values()) device.enabled = true; this.sleeping = false; this._transition(PowerState.ACTIVE); this._recalculate(); return this.state; }

  setThermalState(state) { this.thermalState = state; return state; }
  addRail(name, voltage = 1) { this.rails.set(name, { name, voltage, enabled: true }); return this.rails.get(name); }
  setRail(name, enabled) { const rail = this.rails.get(name); if (!rail) return false; rail.enabled = Boolean(enabled); return rail.enabled; }

  snapshot() {
    return { state: this.state, sleeping: this.sleeping, lowPowerMode: this.lowPowerMode, budgetWatts: this.budgetWatts, currentLoadWatts: this.currentLoadWatts, thermalState: this.thermalState, deviceCount: this.devices.size, rails: [...this.rails.values()], transitions: [...this.transitions] };
  }

  _recalculate() {
    this.currentLoadWatts = [...this.devices.values()].filter(device => device.enabled).reduce((sum, device) => sum + device.requestedWatts, 0);
  }

  _transition(state) {
    this.state = state;
    this.transitions.push({ state, timestamp: Date.now() });
    if (this.transitions.length > 32) this.transitions.shift();
  }
}

export default PowerManagement;
