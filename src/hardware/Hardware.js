import CPU from './CPU.js';
import GPU from './GPU.js';
import RAM from './RAM.js';
import InternalMemory from './InternalMemory.js';
import Display from './Display.js';
import Touchscreen from './Touchscreen.js';
import Battery from './Battery.js';
import PowerManagement from './PowerManagement.js';
import Audio from './Audio.js';
import Speakers from './Speakers.js';
import Microphones from './Microphones.js';
import Cameras from './Cameras.js';
import Sensors from './Sensors.js';
import WiFi from './WiFi.js';
import Bluetooth from './Bluetooth.js';
import Cellular from './Cellular.js';
import GPS from './GPS.js';
import NFC from './NFC.js';
import USB from './USB.js';
import Buttons from './Buttons.js';
import Haptics from './Haptics.js';
import Motherboard from './Motherboard.js';
import Cooling from './Cooling.js';
import Antennas from './Antennas.js';

export const HardwareState = Object.freeze({ OFF: 'off', INITIALIZING: 'initializing', READY: 'ready', SUSPENDED: 'suspended', FAULT: 'fault' });

export class Hardware {
  constructor(options = {}) {
    this.state = HardwareState.OFF;
    this.bootTimestamp = null;
    this.lastDiagnostic = null;
    this.cpu = new CPU(options.cpu);
    this.gpu = new GPU(options.gpu);
    this.ram = new RAM(options.ram);
    this.internalMemory = new InternalMemory(options.internalMemory);
    this.display = new Display(options.display);
    this.touchscreen = new Touchscreen(options.touchscreen);
    this.battery = new Battery(options.battery);
    this.power = new PowerManagement(options.power);
    this.audio = new Audio(options.audio);
    this.speakers = new Speakers(options.speakers);
    this.microphones = new Microphones(options.microphones);
    this.cameras = new Cameras(options.cameras);
    this.sensors = new Sensors(options.sensors);
    this.wifi = new WiFi(options.wifi);
    this.bluetooth = new Bluetooth(options.bluetooth);
    this.cellular = new Cellular(options.cellular);
    this.gps = new GPS(options.gps);
    this.nfc = new NFC(options.nfc);
    this.usb = new USB(options.usb);
    this.buttons = new Buttons(options.buttons);
    this.haptics = new Haptics(options.haptics);
    this.motherboard = new Motherboard(options.motherboard);
    this.cooling = new Cooling(options.cooling);
    this.antennas = new Antennas(options.antennas);
    this.devices = new Map();
    this._registerDevices();
  }

  initialize() {
    if (this.state === HardwareState.READY) return this.state;
    this.state = HardwareState.INITIALIZING;
    this.motherboard.powerOn();
    this.cpu.boot();
    this.gpu.boot();
    this.ram.boot();
    this.internalMemory.mount();
    this.display.initialize();
    this.power.registerDevice('cpu', { idleWatts: 0.4, activeWatts: 8 });
    this.power.registerDevice('gpu', { idleWatts: 0.5, activeWatts: 10 });
    this.power.registerDevice('display', { idleWatts: 0.3, activeWatts: 4 });
    this.state = HardwareState.READY;
    this.bootTimestamp = Date.now();
    return this.state;
  }

  suspend() {
    if (this.state !== HardwareState.READY) return this.state;
    this.power.sleep();
    this.display.sleep();
    this.state = HardwareState.SUSPENDED;
    return this.state;
  }

  resume() {
    if (this.state !== HardwareState.SUSPENDED) return this.state;
    this.power.wake();
    this.display.wake();
    this.state = HardwareState.READY;
    return this.state;
  }

  shutdown() {
    this.display.shutdown();
    this.gpu.shutdown();
    this.cpu.shutdown();
    this.internalMemory.unmount();
    this.motherboard.powerOff();
    this.power.shutdown();
    this.state = HardwareState.OFF;
    return this.state;
  }

  refreshDisplay() { return this.display.refresh(); }

  diagnostics() {
    const report = {
      state: this.state,
      uptimeMs: this.bootTimestamp && this.state !== HardwareState.OFF ? Date.now() - this.bootTimestamp : 0,
      devices: {},
    };
    for (const [name, device] of this.devices) {
      report.devices[name] = typeof device.getStatus === 'function' ? device.getStatus() : typeof device.snapshot === 'function' ? device.snapshot() : { available: true };
    }
    report.healthy = this.state !== HardwareState.FAULT && this.battery.temperatureC < 60;
    this.lastDiagnostic = report;
    return report;
  }

  getDevice(name) { return this.devices.get(name) ?? null; }

  _registerDevices() {
    const entries = { cpu: this.cpu, gpu: this.gpu, ram: this.ram, internalMemory: this.internalMemory, display: this.display, touchscreen: this.touchscreen, battery: this.battery, power: this.power, audio: this.audio, speakers: this.speakers, microphones: this.microphones, cameras: this.cameras, sensors: this.sensors, wifi: this.wifi, bluetooth: this.bluetooth, cellular: this.cellular, gps: this.gps, nfc: this.nfc, usb: this.usb, buttons: this.buttons, haptics: this.haptics, motherboard: this.motherboard, cooling: this.cooling, antennas: this.antennas };
    for (const [name, device] of Object.entries(entries)) this.devices.set(name, device);
  }
}

export default Hardware;
