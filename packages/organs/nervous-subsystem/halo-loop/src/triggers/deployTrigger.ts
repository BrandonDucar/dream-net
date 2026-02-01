import type { HaloEngine } from "../haloEngine";
import type { TriggerRegistration } from "../types";

let lastDeploy: string | null = null;

export function registerDeployTrigger(_engine: HaloEngine): TriggerRegistration {
  return {
    name: "deployTrigger",
    stop: () => {
      lastDeploy = null;
    },
  };
}

export function notifyDeploy(engine: HaloEngine, metadata?: Record<string, unknown>): void {
  lastDeploy = new Date().toISOString();
  void engine.runCycle("deployTrigger", { metadata });
}

export function getLastDeploy(): string | null {
  return lastDeploy;
}


