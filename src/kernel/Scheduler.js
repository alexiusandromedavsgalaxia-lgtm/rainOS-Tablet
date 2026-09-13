export class Scheduler {
  constructor({ quantumMs = 8 } = {}) {
    this.quantumMs = quantumMs;
    this.running = false;
    this.queue = [];
    this.current = null;
    this.sequence = 0;
    this.contextSwitches = 0;
  }

  start() { this.running = true; return this.running; }
  stop() { this.running = false; this.current = null; return true; }
  enqueue(task) { const entry = { ...task, state: 'ready', queuedAt: Date.now(), sequence: ++this.sequence }; this.queue.push(entry); return entry; }
  remove(id) { const index = this.queue.findIndex(task => task.id === id); if (index < 0) return false; this.queue.splice(index, 1); return true; }
  tick() { if (!this.running) return null; if (this.current) this.queue.push({ ...this.current, state: 'ready' }); this.current = this.queue.shift() ?? null; if (this.current) { this.current.state = 'running'; this.current.lastRunAt = Date.now(); this.contextSwitches += 1; } return this.current; }
  handleInterrupt(source, payload) { if (this.current) this.current.lastInterrupt = { source, payload, timestamp: Date.now() }; return this.current; }
  getSnapshot() { return { running: this.running, quantumMs: this.quantumMs, current: this.current, queue: [...this.queue], contextSwitches: this.contextSwitches }; }
}

export default Scheduler;
