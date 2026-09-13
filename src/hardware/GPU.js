export const GPUState = Object.freeze({
  OFF: 'off',
  IDLE: 'idle',
  RUNNING: 'running',
  RESETTING: 'resetting',
  FAULT: 'fault',
});

export const GPUQueueType = Object.freeze({
  GRAPHICS: 'graphics',
  COMPUTE: 'compute',
  COPY: 'copy',
  PRESENT: 'present',
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const makeId = (prefix, counter) => `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;

/**
 * Virtual graphics processor used by rainOS.
 *
 * This is a simulation model rather than a wrapper around the host GPU. It
 * exposes the architectural concepts a tablet GPU needs: execution units,
 * memory hierarchy, command queues, render targets, textures, synchronization,
 * thermal/power state and diagnostics.
 */
export class GPU {
  constructor({
    model = 'rainOS Virtual GPU',
    vendor = 'rainOS Hardware Labs',
    architecture = 'RVG-2',
    memory = 'shared',
    memoryGB = 4,
    memoryBandwidthGBps = 68,
    executionUnits = 16,
    shaderUnits = 128,
    tensorUnits = 8,
    rayTracingUnits = 2,
    textureUnits = 8,
    rasterUnits = 4,
    renderBackends = 4,
    maxFrequencyMHz = 1000,
    maxTemperatureC = 95,
    l1CacheKB = 64,
    l2CacheMB = 4,
  } = {}) {
    this.model = model;
    this.vendor = vendor;
    this.architecture = architecture;
    this.memoryType = memory;
    this.memoryGB = memoryGB;
    this.memoryBandwidthGBps = memoryBandwidthGBps;

    this.executionUnits = executionUnits;
    this.shaderUnits = shaderUnits;
    this.tensorUnits = tensorUnits;
    this.rayTracingUnits = rayTracingUnits;
    this.textureUnits = textureUnits;
    this.rasterUnits = rasterUnits;
    this.renderBackends = renderBackends;

    this.cache = {
      l0InstructionKB: Math.max(1, Math.floor(l1CacheKB / 4)),
      l1KB: l1CacheKB,
      l2MB: l2CacheMB,
    };

    this.maxFrequencyMHz = maxFrequencyMHz;
    this.frequencyMHz = 0;
    this.maxTemperatureC = maxTemperatureC;
    this.temperatureC = 35;
    this.load = 0;
    this.shaderLoad = 0;
    this.computeLoad = 0;
    this.memoryLoad = 0;
    this.powerWatts = 0;
    this.state = GPUState.OFF;

    this.frameCount = 0;
    this.drawCalls = 0;
    this.dispatches = 0;
    this.trianglesRasterized = 0;
    this.textureSamples = 0;
    this.bytesRead = 0;
    this.bytesWritten = 0;

    this.commandSequence = 0;
    this.resourceSequence = 0;
    this.commandQueues = new Map([
      [GPUQueueType.GRAPHICS, []],
      [GPUQueueType.COMPUTE, []],
      [GPUQueueType.COPY, []],
      [GPUQueueType.PRESENT, []],
    ]);

    this.renderTargets = new Map();
    this.buffers = new Map();
    this.textures = new Map();
    this.fences = new Map();

    this.capabilities = new Set([
      '2d',
      '3d',
      'compute',
      'texture-mapping',
      'alpha-blending',
      'depth-testing',
      'stencil-testing',
      'multisampling',
      'command-buffering',
      'hardware-compositing',
      'present',
      'shared-memory',
      'tile-based-rendering',
      'async-compute',
    ]);

    if (tensorUnits > 0) this.capabilities.add('matrix-acceleration');
    if (rayTracingUnits > 0) this.capabilities.add('ray-tracing');

    this.diagnostics = [];
  }

  boot() {
    if (this.state !== GPUState.OFF) return this.state;
    this.state = GPUState.IDLE;
    this.frequencyMHz = Math.round(this.maxFrequencyMHz * 0.25);
    this.powerWatts = 0.8;
    this.temperatureC = 35;
    this._recordDiagnostic('info', 'GPU initialized');
    return this.state;
  }

  shutdown() {
    for (const queue of this.commandQueues.values()) queue.length = 0;
    this.renderTargets.clear();
    this.buffers.clear();
    this.textures.clear();
    this.fences.clear();
    this.state = GPUState.OFF;
    this.frequencyMHz = 0;
    this.load = 0;
    this.shaderLoad = 0;
    this.computeLoad = 0;
    this.memoryLoad = 0;
    this.powerWatts = 0;
    return this.state;
  }

  reset() {
    this.state = GPUState.RESETTING;
    for (const queue of this.commandQueues.values()) queue.length = 0;
    this.renderTargets.clear();
    this.buffers.clear();
    this.textures.clear();
    this.fences.clear();
    this.frameCount = 0;
    this.drawCalls = 0;
    this.dispatches = 0;
    this.trianglesRasterized = 0;
    this.textureSamples = 0;
    this.bytesRead = 0;
    this.bytesWritten = 0;
    this.setLoad(0);
    this.temperatureC = 35;
    this.state = GPUState.IDLE;
    this._recordDiagnostic('info', 'GPU reset completed');
    return this.state;
  }

  setLoad(value) {
    if (!Number.isFinite(value)) throw new TypeError('GPU load must be a number');
    this.load = clamp(value, 0, 1);
    this.shaderLoad = this.load;
    this.computeLoad = this.load;
    this.memoryLoad = clamp(this.load * 0.9, 0, 1);
    this.frequencyMHz = Math.round(this.maxFrequencyMHz * (0.25 + this.load * 0.75));
    this.powerWatts = Number((0.8 + this.load * 7.2).toFixed(2));
    this.temperatureC = Number((35 + this.load * 48).toFixed(1));

    if (this.temperatureC >= this.maxTemperatureC) {
      this.state = GPUState.FAULT;
      this._recordDiagnostic('error', 'GPU thermal limit reached');
    } else if (this.load > 0) {
      this.state = GPUState.RUNNING;
    } else if (this.state !== GPUState.OFF) {
      this.state = GPUState.IDLE;
    }

    return this.load;
  }

  setWorkload({ shader = this.shaderLoad, compute = this.computeLoad, memory = this.memoryLoad } = {}) {
    for (const value of [shader, compute, memory]) {
      if (!Number.isFinite(value)) throw new TypeError('GPU workload values must be numbers');
    }
    this.shaderLoad = clamp(shader, 0, 1);
    this.computeLoad = clamp(compute, 0, 1);
    this.memoryLoad = clamp(memory, 0, 1);
    this.setLoad((this.shaderLoad + this.computeLoad + this.memoryLoad) / 3);
    return this.getWorkload();
  }

  getWorkload() {
    return {
      total: this.load,
      shader: this.shaderLoad,
      compute: this.computeLoad,
      memory: this.memoryLoad,
    };
  }

  supports(capability) {
    return this.capabilities.has(capability);
  }

  submit(command, queue = GPUQueueType.GRAPHICS) {
    if (!Object.values(GPUQueueType).includes(queue)) throw new RangeError(`Unknown GPU queue: ${queue}`);
    if (this.state === GPUState.OFF) this.boot();
    if (this.state === GPUState.FAULT) throw new Error('GPU is in a fault state');
    if (!command || typeof command !== 'object') throw new TypeError('GPU command must be an object');

    const packet = {
      id: makeId('cmd', ++this.commandSequence),
      type: command.type ?? 'custom',
      queue,
      ...command,
      submittedAt: Date.now(),
    };

    this.commandQueues.get(queue).push(packet);
    return packet;
  }

  processNextCommand(queue = GPUQueueType.GRAPHICS) {
    const targetQueue = this.commandQueues.get(queue);
    if (!targetQueue) throw new RangeError(`Unknown GPU queue: ${queue}`);
    const command = targetQueue.shift();
    if (!command) return null;

    this.setLoad(Math.min(1, this.load + 0.08));

    switch (command.type) {
      case 'draw':
        this.drawCalls += 1;
        this.trianglesRasterized += Math.max(0, command.triangles ?? 0);
        break;
      case 'dispatch':
        this.dispatches += 1;
        break;
      case 'sampleTexture':
        this.textureSamples += Math.max(1, command.samples ?? 1);
        break;
      case 'copy':
        this.bytesRead += Math.max(0, command.bytes ?? 0);
        this.bytesWritten += Math.max(0, command.bytes ?? 0);
        break;
      case 'present':
        this.frameCount += 1;
        break;
      default:
        break;
    }

    return command;
  }

  drainQueue(queue = GPUQueueType.GRAPHICS, limit = Infinity) {
    if (!Number.isFinite(limit) && limit !== Infinity) throw new TypeError('Queue limit must be numeric');
    const processed = [];
    while (processed.length < limit) {
      const command = this.processNextCommand(queue);
      if (!command) break;
      processed.push(command);
    }
    if (this.totalQueuedCommands === 0) this.setLoad(Math.max(0, this.load - 0.12));
    return processed;
  }

  createBuffer({ id, sizeBytes, usage = 'vertex', label = '' } = {}) {
    if (!Number.isInteger(sizeBytes) || sizeBytes <= 0) throw new RangeError('Buffer size must be a positive integer');
    const bufferId = id ?? makeId('buffer', ++this.resourceSequence);
    if (this.buffers.has(bufferId)) throw new Error(`Buffer already exists: ${bufferId}`);
    const buffer = { id: bufferId, sizeBytes, usage, label, createdAt: Date.now(), mapped: false };
    this.buffers.set(bufferId, buffer);
    return buffer;
  }

  destroyBuffer(id) {
    return this.buffers.delete(id);
  }

  createTexture({ id, width, height, format = 'rgba8', mipLevels = 1, label = '' } = {}) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      throw new TypeError('Texture dimensions must be positive integers');
    }
    if (!Number.isInteger(mipLevels) || mipLevels < 1) throw new RangeError('mipLevels must be positive');
    const textureId = id ?? makeId('texture', ++this.resourceSequence);
    if (this.textures.has(textureId)) throw new Error(`Texture already exists: ${textureId}`);
    const texture = { id: textureId, width, height, format, mipLevels, label, createdAt: Date.now(), resident: true };
    this.textures.set(textureId, texture);
    return texture;
  }

  destroyTexture(id) {
    return this.textures.delete(id);
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

  createFence(label = '') {
    const id = makeId('fence', ++this.resourceSequence);
    const fence = { id, label, signaled: false, createdAt: Date.now() };
    this.fences.set(id, fence);
    return fence;
  }

  signalFence(id) {
    const fence = this.fences.get(id);
    if (!fence) return false;
    fence.signaled = true;
    return true;
  }

  waitFence(id) {
    const fence = this.fences.get(id);
    return Boolean(fence?.signaled);
  }

  _recordDiagnostic(level, message) {
    this.diagnostics.push({ level, message, timestamp: Date.now() });
    if (this.diagnostics.length > 32) this.diagnostics.shift();
  }

  diagnosticsReport() {
    return {
      healthy: this.state !== GPUState.FAULT,
      state: this.state,
      temperatureC: this.temperatureC,
      maxTemperatureC: this.maxTemperatureC,
      queuedCommands: this.totalQueuedCommands,
      resources: {
        buffers: this.buffers.size,
        textures: this.textures.size,
        renderTargets: this.renderTargets.size,
        fences: this.fences.size,
      },
      messages: [...this.diagnostics],
    };
  }

  get totalQueuedCommands() {
    let total = 0;
    for (const queue of this.commandQueues.values()) total += queue.length;
    return total;
  }

  getStatus() {
    return {
      model: this.model,
      vendor: this.vendor,
      architecture: this.architecture,
      state: this.state,
      memoryGB: this.memoryGB,
      memoryType: this.memoryType,
      memoryBandwidthGBps: this.memoryBandwidthGBps,
      executionUnits: this.executionUnits,
      shaderUnits: this.shaderUnits,
      tensorUnits: this.tensorUnits,
      rayTracingUnits: this.rayTracingUnits,
      textureUnits: this.textureUnits,
      rasterUnits: this.rasterUnits,
      frequencyMHz: this.frequencyMHz,
      temperatureC: this.temperatureC,
      powerWatts: this.powerWatts,
      workload: this.getWorkload(),
      queuedCommands: this.totalQueuedCommands,
      frameCount: this.frameCount,
      drawCalls: this.drawCalls,
      dispatches: this.dispatches,
      buffers: this.buffers.size,
      textures: this.textures.size,
      renderTargets: this.renderTargets.size,
    };
  }
}

export default GPU;
