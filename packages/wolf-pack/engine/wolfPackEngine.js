import { detectAnomalies } from "../detectors/anomalyDetector";
import { TargetTracker } from "../trackers/targetTracker";
import { performPackStrikes } from "../strategies/strikeStrategy";
let lastRunAt = null;
let lastSignals = [];
let lastStrikeResults = [];
export function runWolfPackCycle(ctx) {
    const signals = detectAnomalies(ctx);
    TargetTracker.trackFromSignals(signals);
    const strikes = performPackStrikes(ctx, signals);
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
export function wolfPackStatus() {
    return {
        lastRunAt,
        lastSignalsCount: lastSignals.length,
        activeTargets: TargetTracker.listTargets(),
    };
}
