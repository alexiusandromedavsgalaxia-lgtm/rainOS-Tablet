export const StorageState = Object.freeze({ OFF: 'off', MOUNTED: 'mounted', BUSY: 'busy', READ_ONLY: 'read-only', FAULT: 'fault' });

export class InternalMemory {
  constructor({ capacityGB = 1024, type = 'NMVe', blockSizeKB = 4 } = {}) {
    this.capacityGB = capacityGB;
    this.capacityBytes = Math.floor(capacityGB * 1024 ** 3);
    this.type = type;
    this.blockSizeKB = blockSizeKB;
    this.blockSizeBytes = blockSizeKB * 1024;
    this.usedBytes = 0;
    this.state = StorageState.OFF;
    this.mounted = false;
    this.readOnly = false;
    this.readBytes = 0;
    this.writtenBytes = 0;
    this.operationCount = 0;
    this.files = new Map();
    this.nextFileId = 1;
    this.ioQueue = [];
  }

  mount() { this.mounted = true; this.state = this.readOnly ? StorageState.READ_ONLY : StorageState.MOUNTED; return this.state; }
  unmount() { this.mounted = false; this.state = StorageState.OFF; return this.state; }
  setReadOnly(enabled) { this.readOnly = Boolean(enabled); if (this.mounted) this.state = this.readOnly ? StorageState.READ_ONLY : StorageState.MOUNTED; return this.readOnly; }

  createFile(name, sizeBytes = 0, owner = 'system') {
    this._ensureWritable();
    const bytes = this._align(sizeBytes);
    if (this.usedBytes + bytes > this.capacityBytes) throw new RangeError('Storage capacity exceeded');
    const id = `file-${this.nextFileId++}`;
    const file = { id, name, owner, sizeBytes: bytes, createdAt: Date.now(), modifiedAt: Date.now() };
    this.files.set(id, file);
    this.usedBytes += bytes;
    return file;
  }

  deleteFile(id) {
    this._ensureWritable();
    const file = this.files.get(id);
    if (!file) return false;
    this.files.delete(id);
    this.usedBytes = Math.max(0, this.usedBytes - file.sizeBytes);
    this.operationCount += 1;
    return true;
  }

  read(bytes) {
    const amount = Math.max(0, Math.floor(bytes));
    this.state = StorageState.BUSY;
    this.readBytes += amount;
    this.operationCount += 1;
    this.state = this.mounted ? (this.readOnly ? StorageState.READ_ONLY : StorageState.MOUNTED) : StorageState.OFF;
    return amount;
  }

  write(bytes) {
    this._ensureWritable();
    const amount = Math.max(0, Math.floor(bytes));
    this.state = StorageState.BUSY;
    this.writtenBytes += amount;
    this.operationCount += 1;
    this.state = StorageState.MOUNTED;
    return amount;
  }

  queueIO(operation) { this.ioQueue.push({ ...operation, queuedAt: Date.now() }); return this.ioQueue.length; }
  flushIO() { const queue = [...this.ioQueue]; this.ioQueue.length = 0; return queue; }
  get freeBytes() { return Math.max(0, this.capacityBytes - this.usedBytes); }
  get utilization() { return this.capacityBytes ? this.usedBytes / this.capacityBytes : 0; }
  snapshot() { return { capacityGB: this.capacityGB, usedGB: this.usedBytes / 1024 ** 3, freeGB: this.freeBytes / 1024 ** 3, utilization: this.utilization, type: this.type, state: this.state, mounted: this.mounted, readOnly: this.readOnly, fileCount: this.files.size, readBytes: this.readBytes, writtenBytes: this.writtenBytes, operationCount: this.operationCount, queuedIO: this.ioQueue.length }; }

  _align(bytes) { return Math.ceil(Math.max(0, Number(bytes) || 0) / this.blockSizeBytes) * this.blockSizeBytes; }
  _ensureWritable() { if (!this.mounted) this.mount(); if (this.readOnly) throw new Error('Storage is read-only'); if (this.state === StorageState.FAULT) throw new Error('Storage is in a fault state'); }
}

export default InternalMemory;
