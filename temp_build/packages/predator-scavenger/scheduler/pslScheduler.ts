import type { PSLContext, PSLStatus } from "../types";
import { detectDecay } from "../detectors/decayDetector";
import { runPredatorEngine } from "../predators/predatorEngine";
import { runScavengerEngine } from "../scavengers/scavengerEngine";

let lastRunAt: number | null = null;
let lastDecay: any[] = [];
let lastPredator: any[] = [];
let lastScavenger: any[] = [];

export function runPSLCycle(ctx: PSLContext): PSLStatus {
  const decay = detectDecay(ctx);
  const predator = runPredatorEngine(decay, ctx);
  const scavenger = runScavengerEngine(decay, ctx);

  lastRunAt = Date.now();
  lastDecay = decay;
  lastPredator = predator;
  lastScavenger = scavenger;

  return pslStatus();
}

export function pslStatus(): PSLStatus {
  return {
    lastRunAt,
    decaySignals: lastDecay,
    predatorActions: lastPredator,
    scavengerActions: lastScavenger,
  };
}

