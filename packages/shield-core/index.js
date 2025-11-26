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
import { aiThreatDetector } from "./logic/aiThreatDetector";
import { fireAdvancedSpike, fireAdvancedSpikeAtThreat, getBestSpikeType, trackSpikeEffectiveness } from "./logic/advancedSpikes";
import { zeroTrustVerifier } from "./logic/zeroTrust";
import { threatPredictor } from "./logic/threatPredictor";
export const ShieldCore = {
    // Orchestration
    run(context) {
        return runShieldCycle(context);
    },
    status() {
        return ShieldStore.status();
    },
    // Shield Layers
    ensureShieldPhases() {
        return ensureShieldPhases();
    },
    getLayer(phase) {
        return ShieldStore.getLayer(phase);
    },
    listLayers() {
        return ShieldStore.listLayers();
    },
    listActiveLayers() {
        return ShieldStore.listActiveLayers();
    },
    rotateFrequencies() {
        rotateShieldFrequencies();
    },
    // Modulators
    createModulator(phase, modulationType, frequency, amplitude) {
        return createModulator(phase, modulationType, frequency, amplitude);
    },
    ensureDefaultModulators() {
        return ensureDefaultModulators();
    },
    // Emitters
    createEmitter(phase, emissionType, targetThreatTypes, power, range) {
        return createEmitter(phase, emissionType, targetThreatTypes, power, range);
    },
    ensureDefaultEmitters() {
        return ensureDefaultEmitters();
    },
    // Threats
    detectThreat(type, level, source, target, payload) {
        return detectThreat(type, level, source, target, payload);
    },
    getThreat(id) {
        return ShieldStore.getThreat(id);
    },
    listThreats() {
        return ShieldStore.listThreats();
    },
    listRecentThreats(limit) {
        return ShieldStore.listRecentThreats(limit ?? 50);
    },
    blockThreat(id) {
        return ShieldStore.blockThreat(id);
    },
    analyzeThreat(threat) {
        return analyzeThreat(threat);
    },
    // Spikes
    fireSpike(name, type, target, power, meta) {
        return fireSpike(name, type, target, power, meta);
    },
    fireSpikeAtThreat(threat, spikeType) {
        return fireSpikeAtThreat(threat, spikeType);
    },
    listSpikes() {
        return ShieldStore.listSpikes();
    },
    listRecentSpikes(limit) {
        return ShieldStore.listRecentSpikes(limit ?? 50);
    },
    // Cellular Shields
    createCellularShield(cellId, cellType, wormholeId) {
        return createCellularShield(cellId, cellType, wormholeId);
    },
    getCellularShield(cellId) {
        return getCellularShield(cellId);
    },
    listCellularShields() {
        return listCellularShields();
    },
    updateCellularShieldIntegrity(cellId, integrity) {
        return updateCellularShieldIntegrity(cellId, integrity);
    },
    propagateShieldViaWormhole(signalType, sourcePhase, payload, targetCells) {
        return propagateShieldViaWormhole(signalType, sourcePhase, payload, targetCells);
    },
    getCellularShieldStats() {
        return getCellularShieldStats();
    },
    getRecentWormholeSignals(limit) {
        return getRecentWormholeSignals(limit ?? 50);
    },
    // Shield Learning
    learnFromThreats() {
        return learnFromThreats();
    },
    predictThreatSeverity(threat) {
        return predictThreatSeverity(threat);
    },
    getThreatPatterns() {
        return getThreatPatterns();
    },
    // Cross-Chain Shields
    initializeCrossChainShield(blockchain, chainId) {
        return initializeCrossChainShield(blockchain, chainId);
    },
    syncCrossChainShields() {
        syncCrossChainShields();
    },
    detectCrossChainThreat(blockchain, threatType, level, source) {
        return detectCrossChainThreat(blockchain, threatType, level, source);
    },
    listCrossChainShields() {
        return listCrossChainShields();
    },
    getCrossChainShieldStats() {
        return getCrossChainShieldStats();
    },
    // AI Threat Detection
    aiThreatDetector,
    // Advanced Spikes
    fireAdvancedSpike,
    fireAdvancedSpikeAtThreat,
    getBestSpikeType,
    trackSpikeEffectiveness,
    // Zero Trust
    zeroTrustVerifier,
    // Threat Prediction
    threatPredictor,
};
export * from "./types";
export * from "./src/risk";
export { aiThreatDetector } from "./logic/aiThreatDetector";
export { fireAdvancedSpike, fireAdvancedSpikeAtThreat, getBestSpikeType, trackSpikeEffectiveness } from "./logic/advancedSpikes";
export { zeroTrustVerifier } from "./logic/zeroTrust";
export { threatPredictor } from "./logic/threatPredictor";
// ShieldCore is already exported above as const, so we don't need to re-export it
export default ShieldCore;
