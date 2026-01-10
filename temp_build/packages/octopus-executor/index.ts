import type {
  OctopusArmId,
  OctopusTask,
  OctopusContext,
  OctopusRuntimeStatus,
} from "./types";
import { enqueueTask } from "./engine/octopusEngine";
import { runOctopusScheduler, octopusStatus, ensureOctopusInitialized } from "./scheduler/octopusScheduler";

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

export * from "./types";
export default OctopusExecutor;

