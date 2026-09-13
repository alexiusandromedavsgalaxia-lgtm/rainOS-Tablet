export const DisplayState = Object.freeze({ OFF: 'off', ON: 'on', SLEEP: 'sleep', FAULT: 'fault' });
export const Orientation = Object.freeze({ PORTRAIT: 'portrait', LANDSCAPE: 'landscape' });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class Display {
  constructor({ width = 0, height = 0, refreshRate = 60, brightness = 0.8, pixelRatio = 1, hdr = true, colorMode = 'display-p3' } = {}) {
    this.width = width;
    this.height = height;
    this.nativeWidth = width;
    this.nativeHeight = height;
    this.refreshRate = refreshRate;
    this.brightness = clamp(brightness, 0, 1);
    this.pixelRatio = pixelRatio;
    this.hdr = Boolean(hdr);
    this.colorMode = colorMode;
    this.orientation = Orientation.PORTRAIT;
    this.state = DisplayState.OFF;
    this.vsync = true;
    this.frameCount = 0;
    this.droppedFrames = 0;
    this.presentedFrames = 0;
    this.lastFrameTime = 0;
    this.powerWatts = 0;
    this.maxBrightness = 1;
    this.touchSurface = { x: 0, y: 0, width, height };
  }

  initialize() {
    this.state = DisplayState.ON;
    this.powerWatts = Number((1.2 + this.brightness * 2.8).toFixed(2));
    this.refresh();
    return this.getStatus();
  }

  shutdown() {
    this.state = DisplayState.OFF;
    this.powerWatts = 0;
    return this.state;
  }

  sleep() { this.state = DisplayState.SLEEP; this.powerWatts = 0.15; return this.state; }
  wake() { this.state = DisplayState.ON; this.powerWatts = Number((1.2 + this.brightness * 2.8).toFixed(2)); return this.state; }

  refresh() {
    if (typeof window !== 'undefined') {
      this.width = Math.max(1, window.innerWidth);
      this.height = Math.max(1, window.innerHeight);
      this.pixelRatio = window.devicePixelRatio || this.pixelRatio;
    }
    this.touchSurface = { x: 0, y: 0, width: this.width, height: this.height };
    return { width: this.width, height: this.height, pixelRatio: this.pixelRatio };
  }

  setBrightness(value) {
    if (!Number.isFinite(value)) throw new TypeError('Brightness must be numeric');
    this.brightness = clamp(value, 0, this.maxBrightness);
    this.powerWatts = this.state === DisplayState.ON ? Number((1.2 + this.brightness * 2.8).toFixed(2)) : this.powerWatts;
    return this.brightness;
  }

  setRefreshRate(rate) {
    if (!Number.isFinite(rate) || rate <= 0 || rate > 240) throw new RangeError('Invalid refresh rate');
    this.refreshRate = rate;
    return this.refreshRate;
  }

  setOrientation(orientation) {
    if (!Object.values(Orientation).includes(orientation)) throw new RangeError('Invalid display orientation');
    this.orientation = orientation;
    return this.orientation;
  }

  presentFrame({ timestamp = Date.now(), rendered = true } = {}) {
    if (this.state !== DisplayState.ON) return false;
    this.frameCount += 1;
    if (!rendered) this.droppedFrames += 1;
    else {
      this.presentedFrames += 1;
      this.lastFrameTime = timestamp;
    }
    return rendered;
  }

  getPhysicalResolution() {
    return { width: Math.round(this.width * this.pixelRatio), height: Math.round(this.height * this.pixelRatio) };
  }

  getStatus() {
    return {
      state: this.state,
      width: this.width,
      height: this.height,
      nativeWidth: this.nativeWidth,
      nativeHeight: this.nativeHeight,
      refreshRate: this.refreshRate,
      brightness: this.brightness,
      pixelRatio: this.pixelRatio,
      orientation: this.orientation,
      hdr: this.hdr,
      colorMode: this.colorMode,
      vsync: this.vsync,
      frameCount: this.frameCount,
      presentedFrames: this.presentedFrames,
      droppedFrames: this.droppedFrames,
      powerWatts: this.powerWatts,
    };
  }
}

export default Display;
