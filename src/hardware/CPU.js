export const CPUState = Object.freeze({
  OFF: 'off',
  IDLE: 'idle',
  RUNNING: 'running',
  THROTTLED: 'throttled',
  FAULT: 'fault',
});

export class CPU {
  constructor({
    model = 'rainOS Virtual CPU',
    vendor = 'rainOS Hardware Labs',
    architecture = 'ARM64',
    cores = 8,
    threadsPerCore = 1,
    baseFrequencyMHz = 1200,
    boostFrequencyMHz = 2400,
    cacheL1KB = 64,
    cacheL2KB = 512,
    cacheL3MB = 4,
    maxTemperatureC = 95,
  } = {}) {
    this.model = model;
    this.vendor = vendor;
    this.architecture = architecture;
    this.cores = cores;
    this.threadsPerCore = threadsPerCore;
    this.baseFrequencyMHz = baseFrequencyMHz;
    this.boostFrequencyMHz = boostFrequencyMHz;
    this.frequencyMHz = 0;
    this.cache = { l1KB: cacheL1KB, l2KB: cacheL2KB, l3MB: cacheL3MB };
    this.maxTemperatureC = maxTemperatureC;
    this.temperatureC = 35;
    this.load = 0;
    this.powerWatts = 0;
    this.state = CPUState.OFF;
    this.instructionsExecuted = 0;
    this.cycles = 0;
    this.interrupts = 0;
    this.coreLoads = Array.from({ length: cores }, () => 0);
  }

  boot() {
    if (this.state !== CPUState.OFF) return this.state;
    this.state = CPUState.IDLE;
    this.frequencyMHz = this.baseFrequencyMHz;
    this.powerWatts = 1;
    return this.state;
  }

  shutdown() {
    this.state = CPUState.OFF;
    this.frequencyMHz = 0;
    this.load = 0;
    this.powerWatts = 0;
    this.coreLoads.fill(0);
    return this.state;
  }

  setLoad(value, coreIndex = null) {
    if (!Number.isFinite(value)) throw new TypeError('CPU load must be a number');
    const load = Math.max(0, Math.min(1, value));
    if (coreIndex === null) this.coreLoads.fill(load);
    else if (Number.isInteger(coreIndex) && coreIndex >= 0 && coreIndex < this.cores) this.coreLoads[coreIndex] = load;
    else throw new RangeError('Invalid CPU core index');
    this.load = this.coreLoads.reduce((sum, current) => sum + current, 0) / this.cores;
    this.frequencyMHz = Math.round(this.baseFrequencyMHz + (this.boostFrequencyMHz - this.baseFrequencyMHz) * this.load);
    this.powerWatts = Number((1 + this.load * 8).toFixed(2));
    this.temperatureC = Number((35 + this.load * 50).toFixed(1));
    this.state = this.temperatureC >= this.maxTemperatureC ? CPUState.THROTTLED : this.load > 0 ? CPUState.RUNNING : CPUState.IDLE;
    return this.load;
  }

  execute(instructionCount = 1) {
    if (!Number.isInteger(instructionCount) || instructionCount < 0) throw new RangeError('Instruction count must be a non-negative integer');
    if (this.state === CPUState.OFF) this.boot();
    if (this.state === CPUState.FAULT) throw new Error('CPU is in a fault state');
    this.instructionsExecuted += instructionCount;
    this.cycles += Math.max(1, instructionCount);
    return this.instructionsExecuted;
  }

  raiseInterrupt() {
    this.interrupts += 1;
    return this.interrupts;
  }

  getLogicalProcessors() {
    return this.cores * this.threadsPerCore;
  }

  getStatus() {
    return {
      model: this.model,
      architecture: this.architecture,
      state: this.state,
      cores: this.cores,
      logicalProcessors: this.getLogicalProcessors(),
      load: this.load,
      frequencyMHz: this.frequencyMHz,
      temperatureC: this.temperatureC,
      powerWatts: this.powerWatts,
      instructionsExecuted: this.instructionsExecuted,
      interrupts: this.interrupts,
    };
  }
}

export default CPU;
