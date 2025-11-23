import { haloEngine } from "./haloEngine";
import { registerTimeTrigger } from "./triggers/timeTrigger";
import { registerRequestVolumeTrigger, recordRequest } from "./triggers/requestVolumeTrigger";
import { registerErrorRateTrigger, recordError } from "./triggers/errorRateTrigger";
import { registerDeployTrigger, notifyDeploy, getLastDeploy } from "./triggers/deployTrigger";
import { registerEventWormholeTrigger, triggerHaloFromEvent } from "./triggers/eventWormholeTrigger";
export { haloEngine };
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
