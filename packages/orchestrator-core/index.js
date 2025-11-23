import { runCycle } from "./logic/runCycle";
import { OrchestratorStore } from "./store/orchestratorStore";
export const OrchestratorCore = {
    async runSingleCycle(context) {
        const status = OrchestratorStore.status();
        const nextCycleId = (status.totalCycles ?? 0) + 1;
        return runCycle(context, nextCycleId);
    },
    getStatus() {
        return OrchestratorStore.status();
    },
    /**
     * Convenience helper: run cycles on a fixed interval.
     * Caller is responsible for holding and clearing the interval.
     */
    startIntervalLoop(context, intervalMs) {
        return setInterval(() => {
            void OrchestratorCore.runSingleCycle(context);
        }, intervalMs);
    },
};
export * from "./types";
export default OrchestratorCore;
