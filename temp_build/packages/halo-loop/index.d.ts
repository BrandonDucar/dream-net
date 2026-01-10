import { haloEngine, HaloEngine } from "./haloEngine";
import { getLastDeploy } from "./triggers/deployTrigger";
export { haloEngine };
export type { HaloEngine };
export interface HaloLoopRegistration {
    stop: () => void;
}
export declare function registerHaloLoop(engine?: HaloEngine): HaloLoopRegistration;
export declare const haloTriggers: {
    recordRequest: (engine?: HaloEngine) => void;
    recordError: (engine?: HaloEngine) => void;
    notifyDeploy: (metadata?: Record<string, unknown>, engine?: HaloEngine) => void;
    triggerFromEvent: (eventType: string, severity: string, engine?: HaloEngine) => Promise<void>;
    getLastDeploy: typeof getLastDeploy;
};
