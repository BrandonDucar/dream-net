import type { PSLContext, PSLStatus } from './types.js';
import { runPSLCycle, pslStatus } from './scheduler/pslScheduler.js';

export const PredatorScavengerLoop = {
  run(context: PSLContext): PSLStatus {
    return runPSLCycle(context);
  },

  status(): PSLStatus {
    return pslStatus();
  },
};

export * from './types.js';
export default PredatorScavengerLoop;

