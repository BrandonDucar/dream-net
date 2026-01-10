"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPSLCycle = runPSLCycle;
exports.pslStatus = pslStatus;
const decayDetector_1 = require("../detectors/decayDetector");
const predatorEngine_1 = require("../predators/predatorEngine");
const scavengerEngine_1 = require("../scavengers/scavengerEngine");
let lastRunAt = null;
let lastDecay = [];
let lastPredator = [];
let lastScavenger = [];
function runPSLCycle(ctx) {
    const decay = (0, decayDetector_1.detectDecay)(ctx);
    const predator = (0, predatorEngine_1.runPredatorEngine)(decay, ctx);
    const scavenger = (0, scavengerEngine_1.runScavengerEngine)(decay, ctx);
    lastRunAt = Date.now();
    lastDecay = decay;
    lastPredator = predator;
    lastScavenger = scavenger;
    return pslStatus();
}
function pslStatus() {
    return {
        lastRunAt,
        decaySignals: lastDecay,
        predatorActions: lastPredator,
        scavengerActions: lastScavenger,
    };
}
