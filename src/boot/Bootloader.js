import { runBootSequence } from './BootSequence.js';
import Kernel from '../kernel/Kernel.js';
import Hardware from '../hardware/Hardware.js';

export async function bootRainOS({ onStage } = {}) {
  const hardware = new Hardware();
  const kernel = new Kernel({ hardware });
  await runBootSequence({ hardware, kernel, onStage });
  return { hardware, kernel };
}

export default bootRainOS;
