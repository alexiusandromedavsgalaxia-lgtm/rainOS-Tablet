export const AudioState = Object.freeze({ OFF: 'off', IDLE: 'idle', PLAYING: 'playing', RECORDING: 'recording', FAULT: 'fault' });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class Audio {
  constructor({ sampleRate = 48000, channels = 2, bitDepth = 24 } = {}) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.bitDepth = bitDepth;
    this.volume = 1;
    this.muted = false;
    this.masterGain = 1;
    this.outputRoute = 'speakers';
    this.inputRoute = 'microphones';
    this.state = AudioState.IDLE;
    this.sessions = new Map();
    this.nextSessionId = 1;
    this.framesPlayed = 0;
    this.framesCaptured = 0;
    this.underruns = 0;
  }

  setVolume(volume) { this.volume = clamp(Number(volume) || 0, 0, 1); return this.volume; }
  setMute(muted) { this.muted = Boolean(muted); return this.muted; }
  toggleMute() { return this.setMute(!this.muted); }
  setRoute({ output = this.outputRoute, input = this.inputRoute } = {}) { this.outputRoute = output; this.inputRoute = input; return { output, input }; }

  openSession({ owner = 'system', type = 'playback', sampleRate = this.sampleRate, channels = this.channels } = {}) {
    const id = `audio-${this.nextSessionId++}`;
    const session = { id, owner, type, sampleRate, channels, frames: 0, active: true, createdAt: Date.now() };
    this.sessions.set(id, session);
    this.state = type === 'capture' ? AudioState.RECORDING : AudioState.PLAYING;
    return session;
  }

  closeSession(id) {
    const session = this.sessions.get(id);
    if (!session) return false;
    session.active = false;
    this.sessions.delete(id);
    if (this.sessions.size === 0) this.state = AudioState.IDLE;
    return true;
  }

  renderFrames(id, frames) {
    const session = this.sessions.get(id);
    if (!session || !session.active) throw new Error('Audio session is not active');
    const amount = Math.max(0, Math.floor(frames));
    session.frames += amount;
    if (session.type === 'capture') this.framesCaptured += amount;
    else this.framesPlayed += amount;
    return { id, frames: amount, gain: this.muted ? 0 : this.volume * this.masterGain };
  }

  snapshot() {
    return { state: this.state, volume: this.volume, muted: this.muted, sampleRate: this.sampleRate, channels: this.channels, bitDepth: this.bitDepth, outputRoute: this.outputRoute, inputRoute: this.inputRoute, sessionCount: this.sessions.size, framesPlayed: this.framesPlayed, framesCaptured: this.framesCaptured, underruns: this.underruns };
  }
}

export default Audio;
