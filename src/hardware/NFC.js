export class NFC {
  constructor({ frequencyMHz = 13.56, rangeCm = 4 } = {}) {
    this.frequencyMHz = frequencyMHz;
    this.rangeCm = rangeCm;
    this.enabled = true;
    this.fieldActive = false;
    this.readerMode = false;
    this.tag = null;
    this.transactions = 0;
  }

  setEnabled(enabled) { this.enabled = Boolean(enabled); if (!this.enabled) this.fieldActive = false; return this.enabled; }
  startField() { if (!this.enabled) throw new Error('NFC is disabled'); this.fieldActive = true; return true; }
  stopField() { this.fieldActive = false; this.tag = null; return true; }
  detectTag(tag) { if (!this.fieldActive) throw new Error('NFC field is inactive'); this.tag = { ...tag, detectedAt: Date.now() }; return this.tag; }
  exchange(payload) { if (!this.tag) throw new Error('No NFC tag detected'); this.transactions += 1; return { tagId: this.tag.id, payload, transaction: this.transactions }; }
  snapshot() { return { frequencyMHz: this.frequencyMHz, rangeCm: this.rangeCm, enabled: this.enabled, fieldActive: this.fieldActive, readerMode: this.readerMode, tag: this.tag, transactions: this.transactions }; }
}

export default NFC;
