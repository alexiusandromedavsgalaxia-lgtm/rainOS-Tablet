export class Microphones {
  constructor({ count = 3, sampleRate = 48000, sensitivityDb = -26 } = {}) {
    this.count = count;
    this.sampleRate = sampleRate;
    this.sensitivityDb = sensitivityDb;
    this.enabled = true;
    this.gain = 1;
    this.noiseFloor = 0.015;
    this.inputRoute = 'array';
    this.framesCaptured = 0;
    this.overloads = 0;
    this.channels = Array.from({ length: count }, () => ({ level: 0, active: true }));
  }

  setGain(gain) { this.gain = Math.max(0, Math.min(8, Number(gain) || 0)); return this.gain; }
  setEnabled(enabled) { this.enabled = Boolean(enabled); return this.enabled; }
  capture(frames = 480, sourceLevel = 0.2) {
    if (!this.enabled) return { frames: 0, channels: [] };
    const amount = Math.max(0, Math.floor(frames));
    const level = Math.max(0, Math.min(1, sourceLevel * this.gain));
    if (level > 1) this.overloads += 1;
    this.framesCaptured += amount;
    this.channels.forEach(channel => { channel.level = level; });
    return { frames: amount, channels: this.channels.map(channel => channel.level), noiseFloor: this.noiseFloor };
  }

  snapshot() { return { count: this.count, sampleRate: this.sampleRate, sensitivityDb: this.sensitivityDb, enabled: this.enabled, gain: this.gain, framesCaptured: this.framesCaptured, overloads: this.overloads }; }
}

export default Microphones;
