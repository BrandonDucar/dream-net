import type { CycleTelemetry, OrchestratorStatus } from "../types";
export declare const OrchestratorStore: {
    recordCycle(telemetry: CycleTelemetry): void;
    status(): OrchestratorStatus;
};
