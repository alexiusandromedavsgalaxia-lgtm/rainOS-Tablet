export const BatteryState = Object.freeze({ DISCONNECTED: 'disconnected', CHARGING: 'charging', DISCHARGING: 'discharging', FULL: 'full', CRITICAL: 'critical', FAULT: 'fault' });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class Battery {
  constructor({ capacityWh = 32, voltageNominal = 3.85, level = 1, health = 1, cycleCount = 0, temperatureC = 27 } = {}) {
    this.capacityWh = capacityWh;
    this.voltageNominal = voltageNominal;
    this.level = clamp(level, 0, 1);
    this.health = clamp(health, 0, 1);
    this.cycleCount = Math.max(0, cycleCount);
    this.temperatureC = temperatureC;
    this.charging = false;
    this.connected = false;
    this.powerWatts = 0;
    this.currentA = 0;
    this.energyThroughputWh = 0;
    this.events = [];
    this.state = this.level <= 0.05 ? BatteryState.CRITICAL : this.level >= 0.999 ? BatteryState.FULL : BatteryState.DISCHARGING;
  }

  connectCharger(powerWatts = 20) {
    this.connected = true;
    this.charging = true;
    this.powerWatts = Math.max(0, powerWatts);
    this.currentA = this.powerWatts / this.voltageNominal;
    this._updateState();
    return this.getStatus();
  }

  disconnectCharger() {
    this.connected = false;
    this.charging = false;
    this.powerWatts = 0;
    this.currentA = 0;
    this._updateState();
    return this.getStatus();
  }

  consume(watts, seconds = 1) {
    const draw = Math.max(0, Number(watts) || 0);
    const fraction = draw * Math.max(0, seconds) / 3600 / (this.capacityWh * Math.max(0.1, this.health));
    this.level = clamp(this.level - fraction, 0, 1);
    this.energyThroughputWh += draw * Math.max(0, seconds) / 3600;
    this.currentA = draw / Math.max(0.1, this.voltageNominal * this.level);
    this.charging = false;
    this.powerWatts = draw;
    this._updateState();
    return this.level;
  }

  charge(watts, seconds = 1) {
    const input = Math.max(0, Number(watts) || 0);
    const efficiency = this.level < 0.8 ? 0.92 : 0.75;
    const fraction = input * Math.max(0, seconds) / 3600 * efficiency / (this.capacityWh * Math.max(0.1, this.health));
    this.level = clamp(this.level + fraction, 0, 1);
    this.energyThroughputWh += input * Math.max(0, seconds) / 3600;
    this.currentA = input / this.voltageNominal;
    this.charging = this.level < 0.999;
    this.powerWatts = input;
    this._updateState();
    return this.level;
  }

  setLevel(level) {
    this.level = clamp(level, 0, 1);
    this._updateState();
    return this.level;
  }

  setTemperature(value) {
    this.temperatureC = Number(value) || 0;
    if (this.temperatureC > 55) this._record('High battery temperature');
    this._updateState();
    return this.temperatureC;
  }

  age(cycles = 1) {
    this.cycleCount += Math.max(0, cycles);
    this.health = clamp(this.health - Math.max(0, cycles) * 0.00008, 0, 1);
    return this.health;
  }

  getStatus() {
    return { state: this.state, level: this.level, health: this.health, capacityWh: this.capacityWh, voltageV: this.voltageNominal, currentA: this.currentA, powerWatts: this.powerWatts, temperatureC: this.temperatureC, cycleCount: this.cycleCount, connected: this.connected, charging: this.charging, energyThroughputWh: this.energyThroughputWh };
  }

  diagnostics() {
    return { healthy: this.state !== BatteryState.FAULT && this.temperatureC < 60, state: this.state, events: [...this.events] };
  }

  _updateState() {
    if (this.temperatureC >= 60) this.state = BatteryState.FAULT;
    else if (this.level <= 0.05) this.state = BatteryState.CRITICAL;
    else if (this.level >= 0.999) this.state = BatteryState.FULL;
    else if (this.charging && this.connected) this.state = BatteryState.CHARGING;
    else this.state = BatteryState.DISCHARGING;
  }

  _record(message) {
    this.events.push({ message, timestamp: Date.now() });
    if (this.events.length > 32) this.events.shift();
  }
}

export default Battery;
