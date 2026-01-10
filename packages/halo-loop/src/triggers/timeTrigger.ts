import type { HaloEngine } from "../haloEngine";
import type { TriggerRegistration } from "../types";

export function registerTimeTrigger(
  engine: HaloEngine,
  intervalMs = Number(process.env.HALO_INTERVAL_MS ?? 5 * 60 * 1000),
): TriggerRegistration {
  const interval = setInterval(() => {
    void engine.runCycle("timeTrigger");
  }, intervalMs);

  return {
    name: "timeTrigger",
    stop: () => clearInterval(interval),
  };
}


