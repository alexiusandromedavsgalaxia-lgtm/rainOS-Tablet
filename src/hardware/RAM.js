export const RAMState = Object.freeze({ OFF: 'off', READY: 'ready', ACTIVE: 'active', FAULT: 'fault' });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class RAM {
  constructor({ capacityGB = 8, pageSizeKB = 4, type = 'LPDDR5', frequencyMHz = 3200, channels = 2 } = {}) {
    if (!Number.isFinite(capacityGB) || capacityGB <= 0) throw new RangeError('RAM capacity must be positive');
    this.capacityGB = capacityGB;
    this.capacityBytes = Math.floor(capacityGB * 1024 ** 3);
    this.pageSizeKB = pageSizeKB;
    this.pageSizeBytes = pageSizeKB * 1024;
    this.type = type;
    this.frequencyMHz = frequencyMHz;
    this.channels = channels;
    this.usedBytes = 0;
    this.reservedBytes = 0;
    this.state = RAMState.OFF;
    this.readBytes = 0;
    this.writtenBytes = 0;
    this.allocations = new Map();
    this.nextAllocationId = 1;
    this.diagnostics = [];
  }

  boot() { this.state = RAMState.READY; return this.state; }

  shutdown() {
    this.allocations.clear();
    this.usedBytes = 0;
    this.reservedBytes = 0;
    this.state = RAMState.OFF;
    return this.state;
  }

  reset() {
    this.allocations.clear();
    this.usedBytes = 0;
    this.reservedBytes = 0;
    this.readBytes = 0;
    this.writtenBytes = 0;
    this.state = RAMState.READY;
    return this.state;
  }

  reserve(bytes, owner = 'system') {
    this._ensureReady();
    const amount = this._pageAlign(bytes);
    if (this.reservedBytes + this.usedBytes + amount > this.capacityBytes) throw new RangeError('RAM capacity exceeded');
    this.reservedBytes += amount;
    return { owner, bytes: amount };
  }

  releaseReserved(bytes) {
    const amount = this._pageAlign(bytes);
    this.reservedBytes = Math.max(0, this.reservedBytes - amount);
    return this.reservedBytes;
  }

  allocate(bytes, owner = 'process', kind = 'heap') {
    this._ensureReady();
    const amount = this._pageAlign(bytes);
    if (amount <= 0) throw new RangeError('Allocation size must be positive');
    if (this.usedBytes + this.reservedBytes + amount > this.capacityBytes) {
      this._diagnostic('error', `Allocation refused for ${owner}`);
      throw new RangeError('RAM capacity exceeded');
    }
    const id = `ram-${this.nextAllocationId++}`;
    const allocation = { id, owner, kind, bytes: amount, createdAt: Date.now(), active: true };
    this.allocations.set(id, allocation);
    this.usedBytes += amount;
    this.state = RAMState.ACTIVE;
    return allocation;
  }

  free(id) {
    const allocation = this.allocations.get(id);
    if (!allocation) return false;
    if (!allocation.active) return false;
    allocation.active = false;
    this.usedBytes -= allocation.bytes;
    this.allocations.delete(id);
    if (this.usedBytes === 0) this.state = RAMState.READY;
    return true;
  }

  read(bytes) {
    const amount = Math.max(0, Math.floor(bytes));
    this.readBytes += amount;
    return amount;
  }

  write(bytes) {
    const amount = Math.max(0, Math.floor(bytes));
    this.writtenBytes += amount;
    return amount;
  }

  get freeBytes() { return Math.max(0, this.capacityBytes - this.usedBytes - this.reservedBytes); }
  get utilization() { return this.capacityBytes ? clamp(this.usedBytes / this.capacityBytes, 0, 1) : 0; }

  snapshot() {
    return {
      capacityGB: this.capacityGB,
      usedGB: this.usedBytes / 1024 ** 3,
      freeGB: this.freeBytes / 1024 ** 3,
      reservedGB: this.reservedBytes / 1024 ** 3,
      utilization: Number(this.utilization.toFixed(4)),
      allocationCount: this.allocations.size,
      state: this.state,
      type: this.type,
      frequencyMHz: this.frequencyMHz,
      channels: this.channels,
      readBytes: this.readBytes,
      writtenBytes: this.writtenBytes,
    };
  }

  diagnosticsReport() {
    return { healthy: this.state !== RAMState.FAULT, state: this.state, utilization: this.utilization, messages: [...this.diagnostics] };
  }

  _pageAlign(bytes) { return Math.ceil(Math.max(0, Number(bytes)) / this.pageSizeBytes) * this.pageSizeBytes; }
  _ensureReady() { if (this.state === RAMState.OFF) this.boot(); if (this.state === RAMState.FAULT) throw new Error('RAM is in a fault state'); }
  _diagnostic(level, message) { this.diagnostics.push({ level, message, timestamp: Date.now() }); if (this.diagnostics.length > 32) this.diagnostics.shift(); }
}

export default RAM;
