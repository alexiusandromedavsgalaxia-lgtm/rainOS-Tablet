export const CPUState = Object.freeze({ OFF: 'off', IDLE: 'idle', RUNNING: 'running', THROTTLED: 'throttled', SLEEP: 'sleep', FAULT: 'fault' });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class CPU {
  constructor({ model = 'rainOS Virtual CPU', vendor = 'rainOS Hardware Labs', architecture = 'ARM64', cores = 8, threadsPerCore = 1, baseFrequencyMHz = 1200, boostFrequencyMHz = 2400, cacheL1KB = 64, cacheL2KB = 512, cacheL3MB = 4, maxTemperatureC = 95 } = {}) {
    this.model = model;
    this.vendor = vendor;
    this.architecture = architecture;
    this.cores = cores;
    this.threadsPerCore = threadsPerCore;
    this.baseFrequencyMHz = baseFrequencyMHz;
    this.boostFrequencyMHz = boostFrequencyMHz;
    this.frequencyMHz = 0;
    this.cache = { l1KB: cacheL1KB, l2KB: cacheL2KB, l3MB: cacheL3MB, l1Hits: 0, l1Misses: 0, l2Hits: 0, l2Misses: 0, l3Hits: 0, l3Misses: 0 };
    this.maxTemperatureC = maxTemperatureC;
    this.temperatureC = 35;
    this.load = 0;
    this.powerWatts = 0;
    this.state = CPUState.OFF;
    this.instructionsExecuted = 0;
    this.cycles = 0;
    this.interrupts = 0;
    this.contextSwitches = 0;
    this.stalls = 0;
    this.coreLoads = Array.from({ length: cores }, () => 0);
    this.registers = Array.from({ length: 32 }, (_, index) => ({ name: `x${index}`, value: 0 }));
    this.instructionQueue = [];
    this.branchPredictions = { correct: 0, incorrect: 0 };
  }

  boot() { if (this.state !== CPUState.OFF) return this.state; this.state = CPUState.IDLE; this.frequencyMHz = this.baseFrequencyMHz; this.powerWatts = 1; return this.state; }
  shutdown() { this.state = CPUState.OFF; this.frequencyMHz = 0; this.load = 0; this.powerWatts = 0; this.coreLoads.fill(0); this.instructionQueue.length = 0; return this.state; }
  sleep() { this.state = CPUState.SLEEP; this.frequencyMHz = 0; this.powerWatts = 0.05; return this.state; }
  wake() { if (this.state === CPUState.SLEEP) this.boot(); return this.state; }

  setLoad(value, coreIndex = null) {
    if (!Number.isFinite(value)) throw new TypeError('CPU load must be a number');
    const load = clamp(value, 0, 1);
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

  enqueueInstruction(instruction, core = 0) { const entry = { id: `${Date.now()}-${this.instructionQueue.length}`, instruction, core, queuedAt: Date.now() }; this.instructionQueue.push(entry); return entry; }
  execute(instructionCount = 1) {
    if (!Number.isInteger(instructionCount) || instructionCount < 0) throw new RangeError('Instruction count must be a non-negative integer');
    if (this.state === CPUState.OFF) this.boot();
    if (this.state === CPUState.FAULT) throw new Error('CPU is in a fault state');
    this.instructionsExecuted += instructionCount;
    this.cycles += Math.max(1, Math.ceil(instructionCount / Math.max(0.25, this.load || 1)));
    return this.instructionsExecuted;
  }

  runQueued(maxInstructions = 64) { const count = Math.min(maxInstructions, this.instructionQueue.length); const executed = this.instructionQueue.splice(0, count); this.execute(executed.length); return executed; }
  readRegister(index) { return this.registers[index]?.value ?? 0; }
  writeRegister(index, value) { if (!this.registers[index]) throw new RangeError('Invalid register'); this.registers[index].value = value; return value; }
  touchCache(level, hit = true) { const key = `${level}Hits`; const missKey = `${level}Misses`; if (this.cache[key] === undefined) throw new Error('Unknown cache level'); this.cache[hit ? key : missKey] += 1; return hit; }
  raiseInterrupt(source = 'unknown') { this.interrupts += 1; return { id: this.interrupts, source, timestamp: Date.now() }; }
  contextSwitch() { this.contextSwitches += 1; return this.contextSwitches; }
  getLogicalProcessors() { return this.cores * this.threadsPerCore; }
  getStatus() { return { model: this.model, vendor: this.vendor, architecture: this.architecture, state: this.state, cores: this.cores, logicalProcessors: this.getLogicalProcessors(), load: this.load, coreLoads: [...this.coreLoads], frequencyMHz: this.frequencyMHz, temperatureC: this.temperatureC, powerWatts: this.powerWatts, instructionsExecuted: this.instructionsExecuted, cycles: this.cycles, interrupts: this.interrupts, contextSwitches: this.contextSwitches, stalls: this.stalls, queueLength: this.instructionQueue.length, cache: { ...this.cache } }; }
}

export default CPU;
