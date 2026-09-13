export const GPUState = Object.freeze({
  OFF: 'off',
  IDLE: 'idle',
  RUNNING: 'running',
  RESETTING: 'resetting',
  FAULT: 'fault',
});

export class GPU {
  constructor({
    model = 'rainOS Virtual GPU',
    vendor = 'rainOS Hardware Labs',
    architecture = 'RVG-1',
    memory = 'shared',
    memoryGB = 4,
    executionUnits = 16,
    shaderUnits = 128,
    textureUnits = 8,
    rasterUnits = 4,
    maxFrequencyMHz = 900,
    maxTemperatureC = 95,
  } = {}) {
    this.model = model;
    this.vendor = vendor;
    this.architecture = architecture;
    this.memory = memory;
    this.memoryGB = memoryGB;
    this.executionUnits = executionUnits;
    this.shaderUnits = shaderUnits;
    this.textureUnits = textureUnits;
    this.rasterUnits = rasterUnits;
    this.maxFrequencyMHz = maxFrequencyMHz;
    this.frequencyMHz = 0;
    this.maxTemperatureC = maxTemperatureC;
    this.temperatureC = 35;
    this.load = 0;
    this.powerWatts = 0;
    this.state = GPUState.OFF;
    this.frameCount = 0;
    this.commandQueue = [];
    this.renderTargets = new Map();
    this.capabilities = new Set([
      '2d',
      '3d',
      'texture-mapping',
      'alpha-blending',
      'depth-testing',
      'multisampling',
      'command-buffering',
      'hardware-compositing',
    ]);
  }

  boot() {
    if (this.state !== GPUState.OFF) return this.state;
    this.state = GPUState.IDLE;
    this.frequencyMHz = Math.round(this.maxFrequencyMHz * 0.25);
    this.powerWatts = 0.8;
    return this.state;
  }

  shutdown() {
    this.commandQueue.length = 0;
    this.state = GPUState.OFF;
    this.frequencyMHz = 0;
    this.load = 0;
    this.powerWatts = 0;
    return this.state;
  }

  reset() {
    this.state = GPUState.RESETTING;
    this.commandQueue.length = 0;
    this.renderTargets.clear();
    this.frameCount = 0;
    this.load = 0;
    this.temperatureC = 35;
    this.state = GPUState.IDLE;
    return this.state;
  }

  setLoad(value) {
    if (!Number.isFinite(value)) throw new TypeError('GPU load must be a number');
    this.load = Math.max(0, Math.min(1, value));
    this.frequencyMHz = Math.round(this.maxFrequencyMHz * (0.25 + this.load * 0.75));
    this.powerWatts = Number((0.8 + this.load * 7.2).toFixed(2));
    this.temperatureC = Number((35 + this.load * 48).toFixed(1));
    if (this.load > 0 && this.state === GPUState.IDLE) this.state = GPUState.RUNNING;
    if (this.load === 0 && this.state === GPUState.RUNNING) this.state = GPUState.IDLE;
    if (this.temperatureC >= this.maxTemperatureC) this.state = GPUState.FAULT;
    return this.load;
  }

  supports(capability) {
    return this.capabilities.has(capability);
  }

  submit(command) {
    if (this.state === GPUState.OFF) this.boot();
    if (this.state === GPUState.FAULT) throw new Error('GPU is in a fault state');
    if (!command || typeof command !== 'object') throw new TypeError('GPU command must be an object');
    const packet = { id: crypto?.randomUUID?.() ?? `${Date.now()}-${this.commandQueue.length}`, ...command, submittedAt: Date.now() };
    this.commandQueue.push(packet);
    return packet;
  }

  processNextCommand() {
    const command = this.commandQueue.shift();
    if (!command) return null;
    this.setLoad(Math.min(1, this.load + 0.08));
    this.frameCount += command.type === 'present' ? 1 : 0;
    return command;
  }

  createRenderTarget(id, width, height, format = 'rgba8') {
    if (!id || !Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      throw new TypeError('Invalid render target dimensions');
    }
    const target = { id, width, height, format, createdAt: Date.now(), busy: false };
    this.renderTargets.set(id, target);
    return target;
  }

  destroyRenderTarget(id) {
    return this.renderTargets.delete(id);
  }

  getStatus() {
    return {
      model: this.model,
      architecture: this.architecture,
      state: this.state,
      load: this.load,
      frequencyMHz: this.frequencyMHz,
      temperatureC: this.temperatureC,
      powerWatts: this.powerWatts,
      queuedCommands: this.commandQueue.length,
      frameCount: this.frameCount,
      renderTargets: this.renderTargets.size,
    };
  }
}

export default GPU;
