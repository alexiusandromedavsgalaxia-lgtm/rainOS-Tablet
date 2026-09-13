export const TouchState = Object.freeze({ DISABLED: 'disabled', READY: 'ready', ACTIVE: 'active', CALIBRATING: 'calibrating', FAULT: 'fault' });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class Touchscreen {
  constructor({ width = 2048, height = 2732, maxTouches = 10, maxPressure = 1 } = {}) {
    this.width = width;
    this.height = height;
    this.maxTouches = maxTouches;
    this.maxPressure = maxPressure;
    this.enabled = true;
    this.state = TouchState.READY;
    this.pointerCount = 0;
    this.contacts = new Map();
    this.events = [];
    this.calibration = { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
    this.gestureStats = { taps: 0, swipes: 0, pinches: 0 };
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    this.state = this.enabled ? TouchState.READY : TouchState.DISABLED;
    if (!this.enabled) this.clearContacts();
    return this.enabled;
  }

  beginContact(id, x, y, pressure = 1) {
    if (!this.enabled) return false;
    if (this.contacts.size >= this.maxTouches && !this.contacts.has(id)) throw new RangeError('Maximum touch contacts reached');
    const contact = { id, x: this._x(x), y: this._y(y), pressure: clamp(pressure, 0, this.maxPressure), startedAt: Date.now(), updatedAt: Date.now() };
    this.contacts.set(id, contact);
    this.pointerCount = this.contacts.size;
    this.state = TouchState.ACTIVE;
    this._pushEvent({ type: 'start', ...contact });
    return contact;
  }

  moveContact(id, x, y, pressure = 1) {
    const contact = this.contacts.get(id);
    if (!contact || !this.enabled) return false;
    contact.x = this._x(x);
    contact.y = this._y(y);
    contact.pressure = clamp(pressure, 0, this.maxPressure);
    contact.updatedAt = Date.now();
    this._pushEvent({ type: 'move', ...contact });
    return contact;
  }

  endContact(id) {
    const contact = this.contacts.get(id);
    if (!contact) return false;
    this.contacts.delete(id);
    this.pointerCount = this.contacts.size;
    if (this.contacts.size === 0) this.state = TouchState.READY;
    this._pushEvent({ type: 'end', ...contact, endedAt: Date.now() });
    return true;
  }

  clearContacts() {
    this.contacts.clear();
    this.pointerCount = 0;
    if (this.enabled) this.state = TouchState.READY;
  }

  calibrate({ offsetX = 0, offsetY = 0, scaleX = 1, scaleY = 1 } = {}) {
    this.state = TouchState.CALIBRATING;
    this.calibration = { offsetX, offsetY, scaleX, scaleY };
    this.state = this.enabled ? TouchState.READY : TouchState.DISABLED;
    return this.calibration;
  }

  drainEvents() {
    const events = [...this.events];
    this.events.length = 0;
    return events;
  }

  getStatus() { return { state: this.state, enabled: this.enabled, pointerCount: this.pointerCount, maxTouches: this.maxTouches, resolution: [this.width, this.height], contacts: [...this.contacts.values()], gestureStats: { ...this.gestureStats } }; }

  _x(value) { return clamp(Number(value) * this.calibration.scaleX + this.calibration.offsetX, 0, this.width); }
  _y(value) { return clamp(Number(value) * this.calibration.scaleY + this.calibration.offsetY, 0, this.height); }
  _pushEvent(event) { this.events.push({ ...event, timestamp: Date.now() }); if (this.events.length > 128) this.events.shift(); }
}

export default Touchscreen;
