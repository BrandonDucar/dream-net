import type { OrchestratorContext, CycleTelemetry } from "../types";
/**
 * Main runtime cycle.
 * This is intentionally simple and sequential.
 */
export declare function runCycle(ctx: OrchestratorContext, cycleId: number): Promise<CycleTelemetry>;
