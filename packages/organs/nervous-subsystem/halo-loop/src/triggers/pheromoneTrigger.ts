import type { HaloEngine } from "../haloEngine";
import type { TriggerRegistration } from "../types";
import { depositPheromone, buildPath, evaporatePheromones } from "../stores/pheromoneStore";

let evaporationInterval: NodeJS.Timeout | null = null;

export function registerPheromoneTrigger(engine: HaloEngine): TriggerRegistration {
  // Start nightly evaporation
  if (!evaporationInterval) {
    evaporationInterval = setInterval(() => {
      const removed = evaporatePheromones();
      if (removed > 0) {
        console.log(`[PheromoneTrigger] Evaporated ${removed} weak trails`);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
  }

  return {
    name: "pheromoneTrigger",
    stop: () => {
      if (evaporationInterval) {
        clearInterval(evaporationInterval);
        evaporationInterval = null;
      }
    },
  };
}

/**
 * Record successful task execution
 */
export function recordTaskSuccess(context: {
  agent?: string;
  endpoint?: string;
  provider?: string;
  region?: string;
  time?: string;
}): void {
  const path = buildPath(context);
  depositPheromone(path, true, 0.1);
}

/**
 * Record failed task execution
 */
export function recordTaskFailure(context: {
  agent?: string;
  endpoint?: string;
  provider?: string;
  region?: string;
  time?: string;
}): void {
  const path = buildPath(context);
  depositPheromone(path, false, 0.1);
}

