import type { OctopusContext, OctopusRuntimeStatus } from "../types";
import { runOctopusCycle, getQueuedTaskCount } from "../engine/octopusEngine";
import { ArmRegistry } from "../arms/armRegistry";
import { registerDefaultArms } from "../arms/defaultArms";

let initialized = false;
let lastRunAt: number | null = null;

export async function ensureOctopusInitialized() {
  if (initialized) return;
  registerDefaultArms();
  initialized = true;
}

export async function runOctopusScheduler(ctx: OctopusContext) {
  await ensureOctopusInitialized();
  await runOctopusCycle(ctx);
  lastRunAt = Date.now();
}

export function octopusStatus(): OctopusRuntimeStatus {
  return {
    lastRunAt,
    arms: ArmRegistry.status(),
    queuedTasks: getQueuedTaskCount(),
  };
}

