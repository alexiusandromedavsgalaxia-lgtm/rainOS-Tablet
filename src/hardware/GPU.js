export const GPUState = Object.freeze({ OFF: 'off', IDLE: 'idle', RUNNING: 'running', RESETTING: 'resetting', FAULT: 'fault' });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class GPU {
  constructor({ model = 'rainOS Virtual GPU', vendor = 'rainOS Hardware Labs', architecture = 'RVG-1', memoryGB = 4, executionUnits = 16, shaderUnits = 128, textureUnits = 16, rasterUnits = 8, maxFrequencyMHz = 1200, maxTemperatureC = 95 } = {}) {
    this.model = model;
    this.vendor = vendor;
    this.architecture = architecture;
    this.memoryGB = memoryGB;
    this.memoryBytes = memoryGB * 1024 ** 3;
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
    this.droppedFrames = 0;
    this.commandQueue = [];
    this.renderTargets = new Map();
    this.memoryAllocations = new Map();
    this.nextMemoryId = 1;
    this.nextTargetId = 1;
    this.fences = new Map();
    this.nextFenceId = 1;
    this.cache = { l1KB: 128, l2MB: 2, hits: 0, misses: 0 };
    this.stats = { vertices: 0, triangles: 0, fragments: 0, textureSamples: 0, computeInvocations: 0 };
    this.capabilities = { compute: true, rasterization: true, textureSampling: true, hdr: true, instancing: true, asyncCompute: true };
  }

  boot() { if (this.state !== GPUState.OFF) return this.state; this.state = GPUState.IDLE; this.frequencyMHz = this.maxFrequencyMHz * 0.5; this.powerWatts = 0.5; return this.state; }
  shutdown() { this.state = GPUState.OFF; this.frequencyMHz = 0; this.load = 0; this.powerWatts = 0; this.commandQueue.length = 0; this.renderTargets.clear(); this.memoryAllocations.clear(); return this.state; }
  reset() { this.state = GPUState.RESETTING; this.commandQueue.length = 0; this.fences.clear(); this.state = GPUState.IDLE; this.frameCount = 0; return this.state; }
  setLoad(value) { this.load = clamp(Number(value) || 0, 0, 1); this.frequencyMHz = Math.round(this.maxFrequencyMHz * (0.5 + this.load * 0.5)); this.temperatureC = Number((35 + this.load * 50).toFixed(1)); this.powerWatts = Number((0.5 + this.load * 12).toFixed(2)); this.state = this.temperatureC >= this.maxTemperatureC ? GPUState.FAULT : this.load > 0 ? GPUState.RUNNING : GPUState.IDLE; return this.load; }
  supports(capability) { return Boolean(this.capabilities[capability]); }

  allocateMemory(bytes, owner = 'gpu') { const amount = Math.max(0, Math.floor(bytes)); const used = [...this.memoryAllocations.values()].reduce((sum, item) => sum + item.bytes, 0); if (used + amount > this.memoryBytes) throw new RangeError('GPU memory exhausted'); const id = `vram-${this.nextMemoryId++}`; const allocation = { id, owner, bytes: amount, createdAt: Date.now() }; this.memoryAllocations.set(id, allocation); return allocation; }
  releaseMemory(id) { return this.memoryAllocations.delete(id); }
  createRenderTarget({ width = 1, height = 1, format = 'rgba8', samples = 1 } = {}) { const target = { id: `target-${this.nextTargetId++}`, width, height, format, samples, createdAt: Date.now(), framesPresented: 0 }; this.renderTargets.set(target.id, target); return target; }
  destroyRenderTarget(id) { return this.renderTargets.delete(id); }

  submit(command) { const packet = { id: `cmd-${Date.now()}-${this.commandQueue.length}`, ...command, queuedAt: Date.now(), state: 'queued' }; this.commandQueue.push(packet); return packet; }
  processNextCommand() { const command = this.commandQueue.shift(); if (!command) return null; command.state = 'executing'; if (command.type === 'draw') this.draw(command); if (command.type === 'compute') this.compute(command); if (command.type === 'present') this.present(command.targetId); command.state = 'complete'; return command; }
  processQueue(limit = 32) { const completed = []; for (let index = 0; index < limit && this.commandQueue.length; index += 1) completed.push(this.processNextCommand()); return completed; }

  draw({ vertices = 0, triangles = 0, fragments = 0, textureSamples = 0 } = {}) { this.stats.vertices += Math.max(0, vertices); this.stats.triangles += Math.max(0, triangles); this.stats.fragments += Math.max(0, fragments); this.stats.textureSamples += Math.max(0, textureSamples); this.setLoad(Math.min(1, this.load + 0.02)); return this.stats; }
  compute({ invocations = 0 } = {}) { this.stats.computeInvocations += Math.max(0, invocations); this.setLoad(Math.min(1, this.load + 0.015)); return this.stats.computeInvocations; }
  present(targetId) { const target = this.renderTargets.get(targetId); if (!target) return false; target.framesPresented += 1; this.frameCount += 1; return true; }
  createFence() { const id = `fence-${this.nextFenceId++}`; this.fences.set(id, { id, signaled: false, createdAt: Date.now() }); return id; }
  signalFence(id) { const fence = this.fences.get(id); if (!fence) return false; fence.signaled = true; fence.signaledAt = Date.now(); return true; }
  waitFence(id) { return Boolean(this.fences.get(id)?.signaled); }
  touchCache(hit = true) { this.cache[hit ? 'hits' : 'misses'] += 1; return hit; }
  getStatus() { return { model: this.model, vendor: this.vendor, architecture: this.architecture, state: this.state, memoryGB: this.memoryGB, memoryUsedBytes: [...this.memoryAllocations.values()].reduce((sum, item) => sum + item.bytes, 0), executionUnits: this.executionUnits, shaderUnits: this.shaderUnits, textureUnits: this.textureUnits, rasterUnits: this.rasterUnits, frequencyMHz: this.frequencyMHz, temperatureC: this.temperatureC, load: this.load, powerWatts: this.powerWatts, frameCount: this.frameCount, droppedFrames: this.droppedFrames, queueLength: this.commandQueue.length, renderTargets: this.renderTargets.size, stats: { ...this.stats }, cache: { ...this.cache }, capabilities: { ...this.capabilities } }; }
}

export default GPU;
