import type {
  OctopusArmId,
  OctopusTask,
  OctopusContext,
  OctopusRuntimeStatus,
} from './types.js';
import { enqueueTask } from './engine/octopusEngine.js';
import { runOctopusScheduler, octopusStatus, ensureOctopusInitialized } from './scheduler/octopusScheduler.js';

export const OctopusExecutor = {
  async init() {
    await ensureOctopusInitialized();
  },

  enqueue(task: OctopusTask) {
    enqueueTask(task);
  },

  async run(context: OctopusContext) {
    await runOctopusScheduler(context);
  },

  status(): OctopusRuntimeStatus {
    return octopusStatus();
  },
};

export * from './types.js';
export default OctopusExecutor;

