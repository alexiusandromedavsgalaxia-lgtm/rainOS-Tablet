export class Buttons {
  constructor({ names = ['power', 'volumeUp', 'volumeDown'] } = {}) {
    this.buttons = new Map(names.map(name => [name, { name, active: false, activationCount: 0, lastChangedAt: null }]));
    this.eventQueue = [];
  }

  activate(name) { const button = this.buttons.get(name); if (!button) throw new Error(`Unknown button: ${name}`); button.active = true; button.activationCount += 1; button.lastChangedAt = Date.now(); this.eventQueue.push({ type: 'activate', name, timestamp: button.lastChangedAt }); return button; }
  deactivate(name) { const button = this.buttons.get(name); if (!button) return false; button.active = false; button.lastChangedAt = Date.now(); this.eventQueue.push({ type: 'deactivate', name, timestamp: button.lastChangedAt }); return true; }
  isActive(name) { return Boolean(this.buttons.get(name)?.active); }
  drainEvents() { const events = [...this.eventQueue]; this.eventQueue.length = 0; return events; }
  snapshot() { return { buttons: [...this.buttons.values()], queuedEvents: this.eventQueue.length }; }
}

export default Buttons;
