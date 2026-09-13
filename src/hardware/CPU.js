export class CPU {
  constructor({ model = 'rainOS Virtual CPU', cores = 8, architecture = 'ARM64' } = {}) {
    this.model = model;
    this.cores = cores;
    this.architecture = architecture;
    this.load = 0;
  }
}
export default CPU;
