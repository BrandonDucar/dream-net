import { haloEngine, HaloEngine } from './haloEngine.js';
import { getLastDeploy } from './triggers/deployTrigger.js';
export { haloEngine, haloEngine as HaloLoop };
export type { HaloEngine, HaloEngine as HaloLoopType };
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
export { depositPheromone, buildPath, getPheromoneStrength, getPheromoneTrail, evaporatePheromones, getTopPaths } from './stores/pheromoneStore.js';
export type { PheromoneTrail } from './stores/pheromoneStore.js';
export { createHaloRouter } from './router.js';
//# sourceMappingURL=index.d.ts.map