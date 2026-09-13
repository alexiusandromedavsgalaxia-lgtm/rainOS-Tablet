export class Bluetooth {
  constructor({ version = '5.3', address = '00:00:00:00:00:02' } = {}) {
    this.version = version;
    this.address = address;
    this.enabled = true;
    this.scanning = false;
    this.devices = new Map();
    this.connections = new Map();
    this.rxBytes = 0;
    this.txBytes = 0;
  }

  setEnabled(enabled) { this.enabled = Boolean(enabled); if (!this.enabled) this.connections.clear(); return this.enabled; }
  startScan() { if (!this.enabled) throw new Error('Bluetooth is disabled'); this.scanning = true; return this.scanning; }
  stopScan() { this.scanning = false; return true; }
  discover(device) { if (!this.enabled) return false; this.devices.set(device.id, { ...device, discoveredAt: Date.now() }); return this.devices.get(device.id); }
  connect(id) { const device = this.devices.get(id); if (!device) throw new Error('Unknown Bluetooth device'); this.connections.set(id, { id, connectedAt: Date.now(), mtu: 517 }); return this.connections.get(id); }
  disconnect(id) { return this.connections.delete(id); }
  transfer(id, rxBytes = 0, txBytes = 0) { if (!this.connections.has(id)) throw new Error('Bluetooth device is not connected'); this.rxBytes += Math.max(0, rxBytes); this.txBytes += Math.max(0, txBytes); return { rxBytes, txBytes }; }
  snapshot() { return { version: this.version, address: this.address, enabled: this.enabled, scanning: this.scanning, devices: [...this.devices.values()], connections: [...this.connections.values()], rxBytes: this.rxBytes, txBytes: this.txBytes }; }
}

export default Bluetooth;
