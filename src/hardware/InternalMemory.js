export class InternalMemory {
  constructor({ capacityGB = 128, type = 'flash' } = {}) {
    this.capacityGB = capacityGB;
    this.type = type;
    this.usedGB = 0;
  }
}
export default InternalMemory;
