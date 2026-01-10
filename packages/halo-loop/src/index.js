import { haloEngine } from './haloEngine.js';
import { registerTimeTrigger } from './triggers/timeTrigger.js';
import { registerRequestVolumeTrigger, recordRequest } from './triggers/requestVolumeTrigger.js';
import { registerErrorRateTrigger, recordError } from './triggers/errorRateTrigger.js';
import { registerDeployTrigger, notifyDeploy, getLastDeploy } from './triggers/deployTrigger.js';
import { registerEventWormholeTrigger, triggerHaloFromEvent } from './triggers/eventWormholeTrigger.js';
export { haloEngine, haloEngine as HaloLoop };
export function registerHaloLoop(engine = haloEngine) {
    const registrations = [
        registerTimeTrigger(engine),
        registerRequestVolumeTrigger(engine),
        registerErrorRateTrigger(engine),
        registerDeployTrigger(engine),
        registerEventWormholeTrigger(engine),
    ];
    return {
        stop: () => registrations.forEach((entry) => entry.stop()),
    };
}
export const haloTriggers = {
    recordRequest: (engine = haloEngine) => recordRequest(engine),
    recordError: (engine = haloEngine) => recordError(engine),
    notifyDeploy: (metadata, engine = haloEngine) => notifyDeploy(engine, metadata),
    triggerFromEvent: (eventType, severity, engine = haloEngine) => triggerHaloFromEvent(eventType, severity),
    getLastDeploy,
};
export { depositPheromone, buildPath, getPheromoneStrength, getPheromoneTrail, evaporatePheromones, getTopPaths } from './stores/pheromoneStore.js';
export { createHaloRouter } from './router.js';
//# sourceMappingURL=index.js.map