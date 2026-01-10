import type { OctopusContext, OctopusRuntimeStatus } from "../types";
export declare function ensureOctopusInitialized(): Promise<void>;
export declare function runOctopusScheduler(ctx: OctopusContext): Promise<void>;
export declare function octopusStatus(): OctopusRuntimeStatus;
