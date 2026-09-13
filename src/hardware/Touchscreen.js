export class Touchscreen {
  constructor() {
    this.enabled = true;
    this.pointerCount = 0;
  }
  setEnabled(enabled) { this.enabled = Boolean(enabled); }
}
export default Touchscreen;
