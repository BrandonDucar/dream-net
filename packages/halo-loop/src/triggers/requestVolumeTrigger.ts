import type { HaloEngine } from "../haloEngine";
import type { TriggerRegistration } from "../types";

const threshold = Number(process.env.HALO_REQUEST_THRESHOLD ?? 150);
let counter = 0;

export function registerRequestVolumeTrigger(_engine: HaloEngine): TriggerRegistration {
  return {
    name: "requestVolumeTrigger",
    stop: () => {
      counter = 0;
    },
  };
}

export function recordRequest(engine: HaloEngine): void {
  counter += 1;
  if (counter >= threshold) {
    counter = 0;
    void engine.runCycle("requestVolumeTrigger");
  }
}


