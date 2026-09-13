export class GPU {
  constructor({ model = 'rainOS Virtual GPU', memory = 'shared' } = {}) {
    this.model = model;
    this.memory = memory;
    this.load = 0;
  }
}
export default GPU;
