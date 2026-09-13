export class Audio {
  constructor() {
    this.volume = 1;
    this.muted = false;
  }
  setVolume(volume) { this.volume = Math.max(0, Math.min(1, volume)); }
  toggleMute() { this.muted = !this.muted; return this.muted; }
}
export default Audio;
