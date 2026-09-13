export class Display {
  constructor({ width = 0, height = 0, refreshRate = 60 } = {}) {
    this.width = width;
    this.height = height;
    this.refreshRate = refreshRate;
  }
  refresh() {
    if (typeof window !== 'undefined') {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
    return { width: this.width, height: this.height };
  }
}
export default Display;
