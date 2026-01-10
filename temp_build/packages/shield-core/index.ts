import {
  ShieldPhase,
  ShieldLayer,
  ShieldModulator,
  ShieldEmitter,
  Threat,
  ThreatType,
  ThreatLevel,
  OffensiveSpike,
  ShieldContext,
  ShieldStatus,
} from "./types";
import { ShieldStore } from "./store/shieldStore";
import { runShieldCycle } from "./scheduler/shieldScheduler";
import { ensureShieldPhases, rotateShieldFrequencies } from "./logic/shieldRotator";
import { createModulator, ensureDefaultModulators } from "./logic/shieldModulator";
import { createEmitter, ensureDefaultEmitters } from "./logic/shieldEmitter";
import { detectThreat, analyzeThreat } from "./logic/threatDetector";
import { fireSpike, fireSpikeAtThreat } from "./logic/offensiveSpike";
import { createCellularShield, getCellularShield, updateCellularShieldIntegrity, propagateShieldViaWormhole, listCellularShields, getCellularShieldStats, getRecentWormholeSignals } from "./logic/cellularShield";
import { learnFromThreats, predictThreatSeverity, getThreatPatterns } from "./logic/shieldLearner";
import { initializeCrossChainShield, syncCrossChainShields, detectCrossChainThreat, listCrossChainShields, getCrossChainShieldStats } from "./logic/crossChainShield";
import type { CellularShield, CellType, WormholeShieldSignal, Blockchain } from "./types";

export const ShieldCore = {
  // Orchestration
  run(context: ShieldContext): ShieldStatus {
    return runShieldCycle(context);
  },

  status(): ShieldStatus {
    return ShieldStore.status();
  },

  // Shield Layers
  ensureShieldPhases(): ShieldLayer[] {
    return ensureShieldPhases();
  },

  getLayer(phase: ShieldPhase): ShieldLayer | undefined {
    return ShieldStore.getLayer(phase);
  },

  listLayers(): ShieldLayer[] {
    return ShieldStore.listLayers();
  },

  listActiveLayers(): ShieldLayer[] {
    return ShieldStore.listActiveLayers();
  },

  rotateFrequencies(): void {
    rotateShieldFrequencies();
  },

  // Modulators
  createModulator(
    phase: ShieldPhase,
    modulationType: ShieldModulator["modulationType"],
    frequency: number,
    amplitude?: number
  ): ShieldModulator {
    return createModulator(phase, modulationType, frequency, amplitude);
  },

  ensureDefaultModulators(): ShieldModulator[] {
    return ensureDefaultModulators();
  },

  // Emitters
  createEmitter(
    phase: ShieldPhase,
    emissionType: ShieldEmitter["emissionType"],
    targetThreatTypes: ThreatType[],
    power?: number,
    range?: number
  ): ShieldEmitter {
    return createEmitter(phase, emissionType, targetThreatTypes, power, range);
  },

  ensureDefaultEmitters(): ShieldEmitter[] {
    return ensureDefaultEmitters();
  },

  // Threats
  detectThreat(
    type: ThreatType,
    level: ThreatLevel,
    source?: string,
    target?: string,
    payload?: Record<string, any>
  ): Threat {
    return detectThreat(type, level, source, target, payload);
  },

  getThreat(id: string): Threat | undefined {
    return ShieldStore.getThreat(id);
  },

  listThreats(): Threat[] {
    return ShieldStore.listThreats();
  },

  listRecentThreats(limit?: number): Threat[] {
    return ShieldStore.listRecentThreats(limit ?? 50);
  },

  blockThreat(id: string): boolean {
    return ShieldStore.blockThreat(id);
  },

  analyzeThreat(threat: Threat): { shouldBlock: boolean; recommendedSpike?: string } {
    return analyzeThreat(threat);
  },

  // Spikes
  fireSpike(
    name: string,
    type: OffensiveSpike["type"],
    target: string,
    power?: number,
    meta?: Record<string, any>
  ): OffensiveSpike {
    return fireSpike(name, type, target, power, meta);
  },

  fireSpikeAtThreat(threat: Threat, spikeType?: OffensiveSpike["type"]): OffensiveSpike | null {
    return fireSpikeAtThreat(threat, spikeType);
  },

  listSpikes(): OffensiveSpike[] {
    return ShieldStore.listSpikes();
  },

  listRecentSpikes(limit?: number): OffensiveSpike[] {
    return ShieldStore.listRecentSpikes(limit ?? 50);
  },

  // Cellular Shields
  createCellularShield(
    cellId: string,
    cellType: CellType,
    wormholeId?: string
  ): CellularShield {
    return createCellularShield(cellId, cellType, wormholeId);
  },

  getCellularShield(cellId: string): CellularShield | undefined {
    return getCellularShield(cellId);
  },

  listCellularShields(): CellularShield[] {
    return listCellularShields();
  },

  updateCellularShieldIntegrity(cellId: string, integrity: number): boolean {
    return updateCellularShieldIntegrity(cellId, integrity);
  },

  propagateShieldViaWormhole(
    signalType: WormholeShieldSignal["signalType"],
    sourcePhase: ShieldPhase,
    payload: Record<string, any>,
    targetCells?: string[]
  ): WormholeShieldSignal {
    return propagateShieldViaWormhole(signalType, sourcePhase, payload, targetCells);
  },

  getCellularShieldStats() {
    return getCellularShieldStats();
  },

  getRecentWormholeSignals(limit?: number): WormholeShieldSignal[] {
    return getRecentWormholeSignals(limit ?? 50);
  },

  // Shield Learning
  learnFromThreats() {
    return learnFromThreats();
  },

  predictThreatSeverity(threat: Threat): ThreatLevel {
    return predictThreatSeverity(threat);
  },

  getThreatPatterns() {
    return getThreatPatterns();
  },

  // Cross-Chain Shields
  initializeCrossChainShield(blockchain: Blockchain, chainId: string) {
    return initializeCrossChainShield(blockchain, chainId);
  },

  syncCrossChainShields(): void {
    syncCrossChainShields();
  },

  detectCrossChainThreat(
    blockchain: Blockchain,
    threatType: ThreatType,
    level: ThreatLevel,
    source?: string
  ): Threat | null {
    return detectCrossChainThreat(blockchain, threatType, level, source);
  },

  listCrossChainShields() {
    return listCrossChainShields();
  },

  getCrossChainShieldStats() {
    return getCrossChainShieldStats();
  },
};

export * from "./types";
export * from "./src/risk";
// ShieldCore is already exported above as const, so we don't need to re-export it
export default ShieldCore;

