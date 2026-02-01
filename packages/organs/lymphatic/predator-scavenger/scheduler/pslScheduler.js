import { detectDecay } from '../detectors/decayDetector.js';
import { runPredatorEngine } from '../predators/predatorEngine.js';
import { runScavengerEngine } from '../scavengers/scavengerEngine.js';
let lastRunAt = null;
let lastDecay = [];
let lastPredator = [];
let lastScavenger = [];
export function runPSLCycle(ctx) {
    const decay = detectDecay(ctx);
    const predator = runPredatorEngine(decay, ctx);
    const scavenger = runScavengerEngine(decay, ctx);
    lastRunAt = Date.now();
    lastDecay = decay;
    lastPredator = predator;
    lastScavenger = scavenger;
    return pslStatus();
}
export function pslStatus() {
    return {
        lastRunAt,
        decaySignals: lastDecay,
        predatorActions: lastPredator,
        scavengerActions: lastScavenger,
    };
}
//# sourceMappingURL=pslScheduler.js.map