export class Cameras {
  constructor({ rearCount = 2, frontCount = 1, maxWidth = 3840, maxHeight = 2160 } = {}) {
    this.cameras = [
      ...Array.from({ length: rearCount }, (_, index) => ({ id: `rear-${index}`, position: 'rear', width: maxWidth, height: maxHeight, enabled: true })),
      ...Array.from({ length: frontCount }, (_, index) => ({ id: `front-${index}`, position: 'front', width: 1920, height: 1080, enabled: true })),
    ];
    this.activeCamera = null;
    this.streaming = false;
    this.frameRate = 30;
    this.framesCaptured = 0;
    this.exposure = 0;
    this.focusDistance = 1;
    this.flash = false;
  }

  open(id) {
    const camera = this.cameras.find(item => item.id === id);
    if (!camera || !camera.enabled) throw new Error('Camera unavailable');
    this.activeCamera = id;
    return camera;
  }

  close() { this.streaming = false; this.activeCamera = null; return true; }
  setExposure(value) { this.exposure = Math.max(-2, Math.min(2, Number(value) || 0)); return this.exposure; }
  setFocus(distance) { this.focusDistance = Math.max(0.05, Number(distance) || 1); return this.focusDistance; }
  setFlash(enabled) { this.flash = Boolean(enabled); return this.flash; }
  captureFrame() {
    if (!this.activeCamera) throw new Error('No camera is open');
    this.framesCaptured += 1;
    const camera = this.cameras.find(item => item.id === this.activeCamera);
    return { camera: camera.id, width: camera.width, height: camera.height, frame: this.framesCaptured, exposure: this.exposure, focusDistance: this.focusDistance, flash: this.flash };
  }
  startStream(frameRate = 30) { if (!this.activeCamera) throw new Error('No camera is open'); this.frameRate = frameRate; this.streaming = true; return this.frameRate; }
  stopStream() { this.streaming = false; }
  snapshot() { return { cameras: this.cameras, activeCamera: this.activeCamera, streaming: this.streaming, frameRate: this.frameRate, framesCaptured: this.framesCaptured }; }
}

export default Cameras;
