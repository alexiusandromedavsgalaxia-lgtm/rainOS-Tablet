export class Antennas {
  constructor({ count = 4 } = {}) {
    this.antennas = Array.from({ length: count }, (_, id) => ({ id, enabled: true, gainDb: 0, band: 'multi-band', active: false }));
    this.diversityMode = 'auto';
    this.activeLinks = new Map();
  }

  enable(id, enabled = true) { const antenna = this.antennas.find(item => item.id === id); if (!antenna) throw new Error('Unknown antenna'); antenna.enabled = Boolean(enabled); return antenna; }
  tune(id, band, gainDb = 0) { const antenna = this.antennas.find(item => item.id === id); if (!antenna) throw new Error('Unknown antenna'); antenna.band = band; antenna.gainDb = gainDb; return antenna; }
  attach(link, antennaIds = []) { const usable = antennaIds.filter(id => this.antennas.find(item => item.id === id)?.enabled); usable.forEach(id => { this.antennas.find(item => item.id === id).active = true; }); this.activeLinks.set(link, usable); return usable; }
  detach(link) { const ids = this.activeLinks.get(link) ?? []; ids.forEach(id => { const antenna = this.antennas.find(item => item.id === id); if (antenna) antenna.active = false; }); return this.activeLinks.delete(link); }
  snapshot() { return { diversityMode: this.diversityMode, antennas: this.antennas, activeLinks: [...this.activeLinks.entries()] }; }
}

export default Antennas;
