import type { CycleTelemetry, OrchestratorStatus } from '../types.js';

let lastCycle: CycleTelemetry | undefined;
let totalCycles = 0;

export const OrchestratorStore = {
  recordCycle(telemetry: CycleTelemetry) {
    lastCycle = telemetry;
    totalCycles += 1;
  },

  status(): OrchestratorStatus {
    return {
      lastCycle,
      totalCycles,
    };
  },
};

