import type { OctopusContext, OctopusRuntimeStatus } from '../types.js';
import { runOctopusCycle, getQueuedTaskCount } from '../engine/octopusEngine.js';
import { ArmRegistry } from '../arms/armRegistry.js';
import { registerDefaultArms } from '../arms/defaultArms.js';

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

