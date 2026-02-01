import type { HaloEngine } from "../haloEngine";
import type { TriggerRegistration } from "../types";
export declare function registerDeployTrigger(_engine: HaloEngine): TriggerRegistration;
export declare function notifyDeploy(engine: HaloEngine, metadata?: Record<string, unknown>): void;
export declare function getLastDeploy(): string | null;
//# sourceMappingURL=deployTrigger.d.ts.map