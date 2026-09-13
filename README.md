# rainOS Tablet

rainOS Tablet is a tablet-first operating-system simulation built with React and Vite. It models the visible tablet shell together with a virtual hardware layer, boot process and kernel services.

## Architecture

```text
src/
├── apps/       Applications and system app surfaces
├── boot/       Power-on and boot sequencing
├── hardware/   Independent virtual hardware components
├── kernel/     Kernel state, scheduling, memory and processes
└── ui/         Reusable tablet interface components
```

The important design rule is that `App.jsx` is only the shell and orchestration layer. Hardware behavior belongs in `hardware/`, kernel behavior belongs in `kernel/`, boot behavior belongs in `boot/`, applications belong in `apps/`, and reusable visual components belong in `ui/`.

## Virtual hardware

The hardware layer contains separate models for CPU, GPU, RAM, internal storage, display, touchscreen, battery, power management, audio, speakers, microphones, cameras, sensors, Wi-Fi, Bluetooth, cellular networking, GPS, NFC, USB, buttons, haptics, motherboard interconnects, cooling and antennas.

These modules expose state, lifecycle operations, queues, counters, capabilities, resource accounting and diagnostics instead of being simple placeholder objects. The GPU, for example, has command queues, render targets, virtual graphics memory, fences, cache statistics and rendering counters. The CPU models cores, logical processors, frequency, load, registers, instruction queues, interrupts, cache statistics and thermal state.

This is a simulation, not a physical emulator. It deliberately models concepts used by real computers without pretending that JavaScript is directly executing ARM instructions or driving real tablet silicon.

## Boot and kernel

The bootloader constructs the virtual hardware and kernel services, then runs staged initialization:

1. power-on
2. hardware initialization
3. memory initialization
4. kernel startup
5. device initialization
6. UI startup
7. ready

The kernel exposes lifecycle state, ticks, interrupts, system-call accounting, uptime and diagnostics. Scheduler, memory and process services are kept separate from the kernel core.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Philosophy

The goal is not to make every file artificially large. The goal is to make every subsystem contain the state and behavior that its responsibility actually requires. A GPU should not be eight lines pretending to be a GPU, and the aggregate hardware controller should not become a 2,000-line junk drawer either.
