export class GPS {
  constructor() {
    this.enabled = true;
    this.fix = false;
    this.accuracyMeters = Infinity;
    this.latitude = 0;
    this.longitude = 0;
    this.altitudeMeters = 0;
    this.speedMps = 0;
    this.headingDegrees = 0;
    this.satellites = 0;
    this.lastFixAt = null;
  }

  setEnabled(enabled) { this.enabled = Boolean(enabled); if (!this.enabled) this.fix = false; return this.enabled; }
  acquireFix({ latitude = 0, longitude = 0, altitudeMeters = 0, accuracyMeters = 5, satellites = 12 } = {}) { if (!this.enabled) throw new Error('GPS is disabled'); this.latitude = latitude; this.longitude = longitude; this.altitudeMeters = altitudeMeters; this.accuracyMeters = accuracyMeters; this.satellites = satellites; this.fix = satellites >= 4; this.lastFixAt = this.fix ? Date.now() : null; return this.getLocation(); }
  updateMotion({ speedMps = this.speedMps, headingDegrees = this.headingDegrees } = {}) { this.speedMps = Math.max(0, speedMps); this.headingDegrees = ((headingDegrees % 360) + 360) % 360; }
  getLocation() { return { fix: this.fix, latitude: this.latitude, longitude: this.longitude, altitudeMeters: this.altitudeMeters, accuracyMeters: this.accuracyMeters, speedMps: this.speedMps, headingDegrees: this.headingDegrees, satellites: this.satellites, lastFixAt: this.lastFixAt }; }
}

export default GPS;
