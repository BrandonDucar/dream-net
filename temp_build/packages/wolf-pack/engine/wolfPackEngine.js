"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWolfPackCycle = runWolfPackCycle;
exports.wolfPackStatus = wolfPackStatus;
const anomalyDetector_1 = require("../detectors/anomalyDetector");
const targetTracker_1 = require("../trackers/targetTracker");
const strikeStrategy_1 = require("../strategies/strikeStrategy");
let lastRunAt = null;
let lastSignals = [];
let lastStrikeResults = [];
function runWolfPackCycle(ctx) {
    const signals = (0, anomalyDetector_1.detectAnomalies)(ctx);
    targetTracker_1.TargetTracker.trackFromSignals(signals);
    const strikes = (0, strikeStrategy_1.performPackStrikes)(ctx, signals);
    lastRunAt = Date.now();
    lastSignals = signals;
    lastStrikeResults = strikes;
    // Optionally push into Neural Mesh for long-term memory
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "WolfPack",
            signals,
            strikes,
            timestamp: lastRunAt,
        });
    }
    return { signals, strikes };
}
function wolfPackStatus() {
    return {
        lastRunAt,
        lastSignalsCount: lastSignals.length,
        activeTargets: targetTracker_1.TargetTracker.listTargets(),
    };
}
