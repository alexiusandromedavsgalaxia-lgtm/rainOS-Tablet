import { runBootSequence } from './BootSequence.js';
import Kernel from '../kernel/Kernel.js';
import Scheduler from '../kernel/Scheduler.js';
import MemoryManager from '../kernel/MemoryManager.js';
import ProcessManager from '../kernel/ProcessManager.js';
import Hardware from '../hardware/Hardware.js';

export async function bootRainOS({ onStage, hardwareOptions = {} } = {}) {
  const hardware = new Hardware(hardwareOptions);
  const scheduler = new Scheduler();
  const memoryManager = new MemoryManager();
  memoryManager.initialize(hardware.ram.capacityBytes);
  const processManager = new ProcessManager();
  const kernel = new Kernel({ hardware, scheduler, memoryManager, processManager });
  await runBootSequence({ hardware, kernel, onStage });
  return { hardware, kernel, scheduler, memoryManager, processManager };
}

export default bootRainOS;
