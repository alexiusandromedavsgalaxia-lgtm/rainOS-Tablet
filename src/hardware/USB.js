export class USB {
  constructor({ ports = 2, generation = 'USB-C' } = {}) {
    this.ports = Array.from({ length: ports }, (_, index) => ({ id: index, generation, active: false, device: null, speedGbps: 10, powerBudgetW: 15 }));
    this.enabled = true;
    this.transferCount = 0;
    this.rxBytes = 0;
    this.txBytes = 0;
  }

  attach(portId, device) { const port = this.ports.find(item => item.id === portId); if (!port || !this.enabled) throw new Error('USB port unavailable'); port.active = true; port.device = { ...device }; return port; }
  detach(portId) { const port = this.ports.find(item => item.id === portId); if (!port) return false; port.active = false; port.device = null; return true; }
  setEnabled(enabled) { this.enabled = Boolean(enabled); if (!this.enabled) this.ports.forEach(port => { port.active = false; port.device = null; }); return this.enabled; }
  transfer(portId, rxBytes = 0, txBytes = 0) { const port = this.ports.find(item => item.id === portId); if (!port?.active) throw new Error('USB device is not active'); this.rxBytes += Math.max(0, rxBytes); this.txBytes += Math.max(0, txBytes); this.transferCount += 1; return { portId, rxBytes, txBytes, speedGbps: port.speedGbps }; }
  snapshot() { return { enabled: this.enabled, ports: this.ports, transferCount: this.transferCount, rxBytes: this.rxBytes, txBytes: this.txBytes }; }
}

export default USB;
