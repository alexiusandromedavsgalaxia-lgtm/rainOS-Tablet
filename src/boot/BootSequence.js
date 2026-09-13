export const BootStage = Object.freeze({ POWER_ON: 'power-on', HARDWARE: 'hardware', MEMORY: 'memory', KERNEL: 'kernel', DEVICES: 'devices', UI: 'ui', READY: 'ready' });

export async function runBootSequence({ kernel, hardware, onStage, delay = 0 } = {}) {
  const stages = [BootStage.POWER_ON, BootStage.HARDWARE, BootStage.MEMORY, BootStage.KERNEL, BootStage.DEVICES, BootStage.UI, BootStage.READY];
  const startedAt = Date.now();
  const completed = [];
  for (const stage of stages) {
    const stageStarted = Date.now();
    onStage?.(stage, { completed, elapsedMs: Date.now() - startedAt });
    if (stage === BootStage.POWER_ON) hardware?.motherboard?.powerOn?.();
    if (stage === BootStage.HARDWARE) { hardware?.initialize?.(); hardware?.refreshDisplay?.(); }
    if (stage === BootStage.MEMORY) kernel?.memoryManager?.initialize?.(hardware?.ram?.capacityBytes ?? 0);
    if (stage === BootStage.KERNEL) kernel?.boot?.();
    if (stage === BootStage.DEVICES) kernel?.deviceManager?.initialize?.(hardware);
    completed.push({ stage, durationMs: Date.now() - stageStarted });
    if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
    else await Promise.resolve();
  }
  return { stage: BootStage.READY, durationMs: Date.now() - startedAt, completed };
}
