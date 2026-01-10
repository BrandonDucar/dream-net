import { haloEngine, HaloEngine } from "./haloEngine";
import type { TriggerRegistration } from "./types";
import { registerTimeTrigger } from "./triggers/timeTrigger";
import { registerRequestVolumeTrigger, recordRequest } from "./triggers/requestVolumeTrigger";
import { registerErrorRateTrigger, recordError } from "./triggers/errorRateTrigger";
import { registerDeployTrigger, notifyDeploy, getLastDeploy } from "./triggers/deployTrigger";
import { registerEventWormholeTrigger, triggerHaloFromEvent } from "./triggers/eventWormholeTrigger";

export { haloEngine };
export type { HaloEngine };

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


