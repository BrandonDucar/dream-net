import type { PSLContext, PSLStatus } from "./types";
import { runPSLCycle, pslStatus } from "./scheduler/pslScheduler";

export const PredatorScavengerLoop = {
  run(context: PSLContext): PSLStatus {
    return runPSLCycle(context);
  },

  status(): PSLStatus {
    return pslStatus();
  },
};

export * from "./types";
export default PredatorScavengerLoop;

