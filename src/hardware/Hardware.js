export class Hardware {
  constructor() {
    this.display = {
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    };
    this.battery = { level: 1, charging: true };
    this.network = { wifi: true, bluetooth: true };
  }

  refreshDisplay() {
    if (typeof window !== 'undefined') {
      this.display = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return this.display;
  }
}

export default Hardware;
