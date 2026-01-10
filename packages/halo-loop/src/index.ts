import { haloEngine, HaloEngine } from './haloEngine.js';
import type { TriggerRegistration } from './types.js';
import { registerTimeTrigger } from './triggers/timeTrigger.js';
import { registerRequestVolumeTrigger, recordRequest } from './triggers/requestVolumeTrigger.js';
import { registerErrorRateTrigger, recordError } from './triggers/errorRateTrigger.js';
import { registerDeployTrigger, notifyDeploy, getLastDeploy } from './triggers/deployTrigger.js';
import { registerEventWormholeTrigger, triggerHaloFromEvent } from './triggers/eventWormholeTrigger.js';

export { haloEngine, haloEngine as HaloLoop };
export type { HaloEngine, HaloEngine as HaloLoopType };

export interface HaloLoopRegistration {
  stop: () => void;
}

export function registerHaloLoop(engine: HaloEngine = haloEngine): HaloLoopRegistration {
  const registrations: TriggerRegistration[] = [
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
  recordRequest: (engine: HaloEngine = haloEngine) => recordRequest(engine),
  recordError: (engine: HaloEngine = haloEngine) => recordError(engine),
  notifyDeploy: (metadata?: Record<string, unknown>, engine: HaloEngine = haloEngine) =>
    notifyDeploy(engine, metadata),
  triggerFromEvent: (eventType: string, severity: string, engine: HaloEngine = haloEngine) =>
    triggerHaloFromEvent(eventType, severity),
  getLastDeploy,
};

export { depositPheromone, buildPath, getPheromoneStrength, getPheromoneTrail, evaporatePheromones, getTopPaths } from './stores/pheromoneStore.js';
export type { PheromoneTrail } from './stores/pheromoneStore.js';

export { createHaloRouter } from './router.js';


