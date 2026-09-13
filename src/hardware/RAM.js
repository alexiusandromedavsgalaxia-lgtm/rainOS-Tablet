export class RAM {
  constructor({ capacityGB = 8 } = {}) {
    this.capacityGB = capacityGB;
    this.usedGB = 0;
  }
}
export default RAM;
