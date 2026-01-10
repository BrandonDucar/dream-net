"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShieldCore = void 0;
const shieldStore_1 = require("./store/shieldStore");
const shieldScheduler_1 = require("./scheduler/shieldScheduler");
const shieldRotator_1 = require("./logic/shieldRotator");
const shieldModulator_1 = require("./logic/shieldModulator");
const shieldEmitter_1 = require("./logic/shieldEmitter");
const threatDetector_1 = require("./logic/threatDetector");
const offensiveSpike_1 = require("./logic/offensiveSpike");
const cellularShield_1 = require("./logic/cellularShield");
const shieldLearner_1 = require("./logic/shieldLearner");
const crossChainShield_1 = require("./logic/crossChainShield");
exports.ShieldCore = {
    // Orchestration
    run(context) {
        return (0, shieldScheduler_1.runShieldCycle)(context);
    },
    status() {
        return shieldStore_1.ShieldStore.status();
    },
    // Shield Layers
    ensureShieldPhases() {
        return (0, shieldRotator_1.ensureShieldPhases)();
    },
    getLayer(phase) {
        return shieldStore_1.ShieldStore.getLayer(phase);
    },
    listLayers() {
        return shieldStore_1.ShieldStore.listLayers();
    },
    listActiveLayers() {
        return shieldStore_1.ShieldStore.listActiveLayers();
    },
    rotateFrequencies() {
        (0, shieldRotator_1.rotateShieldFrequencies)();
    },
    // Modulators
    createModulator(phase, modulationType, frequency, amplitude) {
        return (0, shieldModulator_1.createModulator)(phase, modulationType, frequency, amplitude);
    },
    ensureDefaultModulators() {
        return (0, shieldModulator_1.ensureDefaultModulators)();
    },
    // Emitters
    createEmitter(phase, emissionType, targetThreatTypes, power, range) {
        return (0, shieldEmitter_1.createEmitter)(phase, emissionType, targetThreatTypes, power, range);
    },
    ensureDefaultEmitters() {
        return (0, shieldEmitter_1.ensureDefaultEmitters)();
    },
    // Threats
    detectThreat(type, level, source, target, payload) {
        return (0, threatDetector_1.detectThreat)(type, level, source, target, payload);
    },
    getThreat(id) {
        return shieldStore_1.ShieldStore.getThreat(id);
    },
    listThreats() {
        return shieldStore_1.ShieldStore.listThreats();
    },
    listRecentThreats(limit) {
        return shieldStore_1.ShieldStore.listRecentThreats(limit ?? 50);
    },
    blockThreat(id) {
        return shieldStore_1.ShieldStore.blockThreat(id);
    },
    analyzeThreat(threat) {
        return (0, threatDetector_1.analyzeThreat)(threat);
    },
    // Spikes
    fireSpike(name, type, target, power, meta) {
        return (0, offensiveSpike_1.fireSpike)(name, type, target, power, meta);
    },
    fireSpikeAtThreat(threat, spikeType) {
        return (0, offensiveSpike_1.fireSpikeAtThreat)(threat, spikeType);
    },
    listSpikes() {
        return shieldStore_1.ShieldStore.listSpikes();
    },
    listRecentSpikes(limit) {
        return shieldStore_1.ShieldStore.listRecentSpikes(limit ?? 50);
    },
    // Cellular Shields
    createCellularShield(cellId, cellType, wormholeId) {
        return (0, cellularShield_1.createCellularShield)(cellId, cellType, wormholeId);
    },
    getCellularShield(cellId) {
        return (0, cellularShield_1.getCellularShield)(cellId);
    },
    listCellularShields() {
        return (0, cellularShield_1.listCellularShields)();
    },
    updateCellularShieldIntegrity(cellId, integrity) {
        return (0, cellularShield_1.updateCellularShieldIntegrity)(cellId, integrity);
    },
    propagateShieldViaWormhole(signalType, sourcePhase, payload, targetCells) {
        return (0, cellularShield_1.propagateShieldViaWormhole)(signalType, sourcePhase, payload, targetCells);
    },
    getCellularShieldStats() {
        return (0, cellularShield_1.getCellularShieldStats)();
    },
    getRecentWormholeSignals(limit) {
        return (0, cellularShield_1.getRecentWormholeSignals)(limit ?? 50);
    },
    // Shield Learning
    learnFromThreats() {
        return (0, shieldLearner_1.learnFromThreats)();
    },
    predictThreatSeverity(threat) {
        return (0, shieldLearner_1.predictThreatSeverity)(threat);
    },
    getThreatPatterns() {
        return (0, shieldLearner_1.getThreatPatterns)();
    },
    // Cross-Chain Shields
    initializeCrossChainShield(blockchain, chainId) {
        return (0, crossChainShield_1.initializeCrossChainShield)(blockchain, chainId);
    },
    syncCrossChainShields() {
        (0, crossChainShield_1.syncCrossChainShields)();
    },
    detectCrossChainThreat(blockchain, threatType, level, source) {
        return (0, crossChainShield_1.detectCrossChainThreat)(blockchain, threatType, level, source);
    },
    listCrossChainShields() {
        return (0, crossChainShield_1.listCrossChainShields)();
    },
    getCrossChainShieldStats() {
        return (0, crossChainShield_1.getCrossChainShieldStats)();
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./src/risk"), exports);
// ShieldCore is already exported above as const, so we don't need to re-export it
exports.default = exports.ShieldCore;
