export class Motherboard {
  constructor({ boardName = 'rainOS Tablet Logic Board', busWidth = 128 } = {}) {
    this.boardName = boardName;
    this.busWidth = busWidth;
    this.powered = false;
    this.components = new Map();
    this.buses = new Map();
    this.interruptLines = new Map();
    this.clockMHz = 100;
    this.temperatureC = 30;
    this.firmwareVersion = '1.0.0';
  }

  registerComponent(name, device) { this.components.set(name, device); return device; }
  registerBus(name, { width = this.busWidth, speedMHz = this.clockMHz } = {}) { const bus = { name, width, speedMHz, active: true, transactions: 0 }; this.buses.set(name, bus); return bus; }
  connect(source, target, busName) { const bus = this.buses.get(busName) ?? this.registerBus(busName); bus.transactions += 1; return { source, target, bus: busName, width: bus.width }; }
  registerInterrupt(line, owner) { this.interruptLines.set(line, owner); return owner; }
  powerOn() { this.powered = true; return true; }
  powerOff() { this.powered = false; return true; }
  diagnostics() { return { boardName: this.boardName, powered: this.powered, componentCount: this.components.size, busCount: this.buses.size, interruptLines: this.interruptLines.size, clockMHz: this.clockMHz, temperatureC: this.temperatureC, firmwareVersion: this.firmwareVersion }; }
}

export default Motherboard;
