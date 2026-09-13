export const BootStage = Object.freeze({ POWER_ON: 'power-on', HARDWARE: 'hardware', KERNEL: 'kernel', UI: 'ui', READY: 'ready' });

export async function runBootSequence({ kernel, hardware, onStage } = {}) {
  const stages = [BootStage.POWER_ON, BootStage.HARDWARE, BootStage.KERNEL, BootStage.UI, BootStage.READY];
  for (const stage of stages) {
    onStage?.(stage);
    if (stage === BootStage.HARDWARE) hardware?.refreshDisplay?.();
    if (stage === BootStage.KERNEL) kernel?.boot?.();
    await Promise.resolve();
  }
  return BootStage.READY;
}
