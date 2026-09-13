export class Speakers {
  constructor({ count = 4, maxVolumeDb = 90, impedanceOhms = 4 } = {}) {
    this.count = count;
    this.maxVolumeDb = maxVolumeDb;
    this.impedanceOhms = impedanceOhms;
    this.enabled = true;
    this.volume = 0.7;
    this.muted = false;
    this.channelLevels = Array.from({ length: count }, () => 0.7);
    this.temperatureC = 25;
    this.powerWatts = 0;
    this.clips = 0;
  }

  setVolume(value) { this.volume = Math.max(0, Math.min(1, value)); this.channelLevels.fill(this.volume); return this.volume; }
  setMuted(value) { this.muted = Boolean(value); return this.muted; }
  enable(value = true) { this.enabled = Boolean(value); if (!this.enabled) this.powerWatts = 0; return this.enabled; }
  playFrame(amplitude = 0.5) {
    if (!this.enabled || this.muted) return { audible: false, powerWatts: 0 };
    const level = Math.max(0, Math.min(1, amplitude));
    if (level > 0.98) this.clips += 1;
    this.powerWatts = Number((0.4 + level * this.volume * this.count * 0.35).toFixed(3));
    this.temperatureC += level * 0.01;
    return { audible: true, level, powerWatts: this.powerWatts };
  }

  snapshot() { return { count: this.count, enabled: this.enabled, volume: this.volume, muted: this.muted, temperatureC: this.temperatureC, powerWatts: this.powerWatts, clips: this.clips }; }
}

export default Speakers;
