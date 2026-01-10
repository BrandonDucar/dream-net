import type { OrchestratorContext, CycleTelemetry, OrchestratorStatus } from './types.js';
import { runCycle } from './logic/runCycle.js';
import { OrchestratorStore } from './store/orchestratorStore.js';

export const OrchestratorCore = {
  async runSingleCycle(context: OrchestratorContext): Promise<CycleTelemetry> {
    const status = OrchestratorStore.status();
    const nextCycleId = (status.totalCycles ?? 0) + 1;
    return runCycle(context, nextCycleId);
  },

  getStatus(): OrchestratorStatus {
    return OrchestratorStore.status();
  },

  /**
   * Convenience helper: run cycles on a fixed interval.
   * Caller is responsible for holding and clearing the interval.
   */
  startIntervalLoop(context: OrchestratorContext, intervalMs: number): NodeJS.Timeout {
    return setInterval(() => {
      void OrchestratorCore.runSingleCycle(context);
    }, intervalMs);
  },
};

export * from './types.js';
export default OrchestratorCore;

