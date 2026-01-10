import type { OrchestratorContext, CycleTelemetry, OrchestratorStatus } from "./types";
export declare const OrchestratorCore: {
    runSingleCycle(context: OrchestratorContext): Promise<CycleTelemetry>;
    getStatus(): OrchestratorStatus;
    /**
     * Convenience helper: run cycles on a fixed interval.
     * Caller is responsible for holding and clearing the interval.
     */
    startIntervalLoop(context: OrchestratorContext, intervalMs: number): NodeJS.Timeout;
};
export * from "./types";
export default OrchestratorCore;
