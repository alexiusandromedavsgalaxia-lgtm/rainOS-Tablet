export class ProcessManager {
  constructor() { this.processes = new Map(); this.nextPid = 1; this.initialized = false; }
  initialize() { this.initialized = true; this.create('system', { priority: 0 }); return true; }
  create(name, { priority = 10, memoryBytes = 0 } = {}) { const process = { pid: this.nextPid++, name, priority, memoryBytes, state: 'ready', createdAt: Date.now(), cpuTimeMs: 0 }; this.processes.set(process.pid, process); return process; }
  setState(pid, state) { const process = this.processes.get(pid); if (!process) return false; process.state = state; return true; }
  get(pid) { return this.processes.get(pid) ?? null; }
  list() { return [...this.processes.values()]; }
  snapshot() { return { initialized: this.initialized, processCount: this.processes.size, processes: this.list() }; }
}

export default ProcessManager;
