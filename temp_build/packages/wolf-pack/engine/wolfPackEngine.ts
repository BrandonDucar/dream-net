import type { WolfContext, WolfPackStatus, WolfSignal } from "../types";
import { detectAnomalies } from "../detectors/anomalyDetector";
import { TargetTracker } from "../trackers/targetTracker";
import { performPackStrikes, type WolfStrikeResult } from "../strategies/strikeStrategy";

let lastRunAt: number | null = null;
let lastSignals: WolfSignal[] = [];
let lastStrikeResults: WolfStrikeResult[] = [];

export function runWolfPackCycle(ctx: WolfContext): {
  signals: WolfSignal[];
  strikes: WolfStrikeResult[];
} {
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

export function wolfPackStatus(): WolfPackStatus {
  return {
    lastRunAt,
    lastSignalsCount: lastSignals.length,
    activeTargets: TargetTracker.listTargets(),
  };
}

