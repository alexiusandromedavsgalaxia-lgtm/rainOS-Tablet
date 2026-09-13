export class Network {
  constructor({ wifi = null, bluetooth = null, cellular = null } = {}) {
    this.wifi = wifi;
    this.bluetooth = bluetooth;
    this.cellular = cellular;
    this.airplaneMode = false;
    this.defaultRoute = null;
  }

  setAirplaneMode(enabled) {
    this.airplaneMode = Boolean(enabled);
    if (this.airplaneMode) {
      this.wifi?.setEnabled?.(false);
      this.bluetooth?.setEnabled?.(false);
      this.cellular?.setEnabled?.(false);
    }
    return this.airplaneMode;
  }

  selectRoute(route) { this.defaultRoute = route; return this.defaultRoute; }
  getAvailableRoutes() { return { wifi: Boolean(this.wifi?.connected), bluetooth: Boolean(this.bluetooth?.connections?.size), cellular: Boolean(this.cellular?.registered) }; }
  snapshot() { return { airplaneMode: this.airplaneMode, defaultRoute: this.defaultRoute, routes: this.getAvailableRoutes() }; }
}

export default Network;
