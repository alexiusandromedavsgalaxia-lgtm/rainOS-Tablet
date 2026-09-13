export const KernelState = Object.freeze({ OFF: 'off', BOOTING: 'booting', RUNNING: 'running', SUSPENDED: 'suspended', HALTED: 'halted', FAULT: 'fault' });

export class Kernel {
  constructor({ hardware = null, scheduler = null, memoryManager = null, deviceManager = null, processManager = null } = {}) {
    this.hardware = hardware;
    this.scheduler = scheduler;
    this.memoryManager = memoryManager;
    this.deviceManager = deviceManager;
    this.processManager = processManager;
    this.state = KernelState.OFF;
    this.bootTime = null;
    this.tickCount = 0;
    this.interruptCount = 0;
    this.syscalls = 0;
    this.logs = [];
  }

  boot() {
    if (this.state !== KernelState.OFF && this.state !== KernelState.HALTED) return this.state;
    this.state = KernelState.BOOTING;
    this.hardware?.initialize?.();
    this.scheduler?.start?.();
    this.deviceManager?.initialize?.(this.hardware);
    this.processManager?.initialize?.();
    this.state = KernelState.RUNNING;
    this.bootTime = Date.now();
    this._log('Kernel entered running state');
    return this.state;
  }

  tick() { if (this.state !== KernelState.RUNNING) return 0; this.tickCount += 1; this.scheduler?.tick?.(); return this.tickCount; }
  interrupt(source = 'unknown', payload = null) { this.interruptCount += 1; this._log(`Interrupt: ${source}`); this.scheduler?.handleInterrupt?.(source, payload); return this.interruptCount; }
  syscall(name, payload) { if (this.state !== KernelState.RUNNING) throw new Error('Kernel is not running'); this.syscalls += 1; return { name, payload, sequence: this.syscalls }; }
  suspend() { if (this.state !== KernelState.RUNNING) return this.state; this.hardware?.suspend?.(); this.state = KernelState.SUSPENDED; return this.state; }
  resume() { if (this.state !== KernelState.SUSPENDED) return this.state; this.hardware?.resume?.(); this.state = KernelState.RUNNING; return this.state; }
  halt() { this.state = KernelState.HALTED; this.scheduler?.stop?.(); return this.state; }
  restart() { this.halt(); this.state = KernelState.OFF; return this.boot(); }
  uptime() { return this.bootTime && this.state === KernelState.RUNNING ? Date.now() - this.bootTime : 0; }
  diagnostics() { return { state: this.state, uptimeMs: this.uptime(), ticks: this.tickCount, interrupts: this.interruptCount, syscalls: this.syscalls, hardware: this.hardware?.diagnostics?.() ?? null, logs: [...this.logs] }; }
  _log(message) { this.logs.push({ message, timestamp: Date.now() }); if (this.logs.length > 128) this.logs.shift(); }
}

export default Kernel;
