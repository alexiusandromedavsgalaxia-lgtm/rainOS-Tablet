export class MemoryManager {
  constructor() {
    this.totalBytes = 0;
    this.usedBytes = 0;
    this.ownerUsage = new Map();
    this.records = new Map();
    this.nextId = 1;
  }

  initialize(totalBytes = 0) { this.totalBytes = Math.max(0, Number(totalBytes) || 0); this.usedBytes = 0; this.records.clear(); return this.totalBytes; }
  reserve(bytes, owner = 'kernel') { const amount = Math.max(0, Math.floor(bytes)); if (this.usedBytes + amount > this.totalBytes) throw new RangeError('Memory capacity exceeded'); const id = `mem-${this.nextId++}`; const record = { id, owner, bytes: amount, createdAt: Date.now() }; this.records.set(id, record); this.usedBytes += amount; this.ownerUsage.set(owner, (this.ownerUsage.get(owner) ?? 0) + amount); return record; }
  release(id) { const record = this.records.get(id); if (!record) return false; this.records.delete(id); this.usedBytes -= record.bytes; this.ownerUsage.set(record.owner, Math.max(0, (this.ownerUsage.get(record.owner) ?? 0) - record.bytes)); return true; }
  usage(owner = null) { return owner ? this.ownerUsage.get(owner) ?? 0 : this.usedBytes; }
  snapshot() { return { totalBytes: this.totalBytes, usedBytes: this.usedBytes, freeBytes: Math.max(0, this.totalBytes - this.usedBytes), records: this.records.size, owners: Object.fromEntries(this.ownerUsage) }; }
}

export default MemoryManager;
