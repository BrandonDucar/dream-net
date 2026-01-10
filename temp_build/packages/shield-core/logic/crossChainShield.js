"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCrossChainShield = initializeCrossChainShield;
exports.detectCrossChainThreat = detectCrossChainThreat;
exports.syncCrossChainShields = syncCrossChainShields;
exports.listCrossChainShields = listCrossChainShields;
exports.getCrossChainShieldStats = getCrossChainShieldStats;
const shieldStore_1 = require("../store/shieldStore");
const threatDetector_1 = require("./threatDetector");
const crossChainShields = new Map();
/**
 * Initialize cross-chain shield for a blockchain
 */
function initializeCrossChainShield(blockchain, chainId) {
    const now = Date.now();
    // Create shield layer for this chain
    const phase = `omega-${blockchain}`; // Use omega phase for cross-chain
    let layer = shieldStore_1.ShieldStore.getLayer(phase);
    if (!layer) {
        layer = shieldStore_1.ShieldStore.createLayer(phase);
    }
    const crossChainShield = {
        blockchain,
        shieldLayer: layer,
        chainId,
        active: true,
        lastSync: now,
        threatCount: 0,
        blockedCount: 0,
    };
    crossChainShields.set(blockchain, crossChainShield);
    console.log(`[CrossChainShield] Initialized shield for ${blockchain} (chainId: ${chainId})`);
    return crossChainShield;
}
/**
 * Detect cross-chain threat
 */
function detectCrossChainThreat(blockchain, threatType, level, source) {
    const shield = crossChainShields.get(blockchain);
    if (!shield || !shield.active)
        return null;
    // Create threat using threatDetector
    const threat = (0, threatDetector_1.detectThreat)(threatType, level, source, `cross-chain:${blockchain}`, {
        blockchain,
        chainId: shield.chainId,
    });
    shield.threatCount += 1;
    crossChainShields.set(blockchain, shield);
    return threat;
}
/**
 * Sync shields across chains
 */
function syncCrossChainShields() {
    const now = Date.now();
    const allShields = Array.from(crossChainShields.values());
    // Sync integrity across chains (average)
    const avgIntegrity = allShields.length > 0
        ? allShields.reduce((sum, s) => sum + s.shieldLayer.integrity, 0) / allShields.length
        : 1.0;
    // Update all shields to match average
    for (const shield of allShields) {
        if (shield.active) {
            shieldStore_1.ShieldStore.updateLayer(shield.shieldLayer.phase, { integrity: avgIntegrity });
            shield.lastSync = now;
            crossChainShields.set(shield.blockchain, shield);
        }
    }
    console.log(`[CrossChainShield] Synced ${allShields.length} chain shields (avg integrity: ${(avgIntegrity * 100).toFixed(1)}%)`);
}
/**
 * List all cross-chain shields
 */
function listCrossChainShields() {
    return Array.from(crossChainShields.values());
}
/**
 * Get cross-chain shield stats
 */
function getCrossChainShieldStats() {
    const allShields = Array.from(crossChainShields.values());
    const activeShields = allShields.filter((s) => s.active);
    const avgIntegrity = activeShields.length > 0
        ? activeShields.reduce((sum, s) => sum + s.shieldLayer.integrity, 0) / activeShields.length
        : 1.0;
    const totalThreats = allShields.reduce((sum, s) => sum + s.threatCount, 0);
    const totalBlocked = allShields.reduce((sum, s) => sum + s.blockedCount, 0);
    return {
        totalChains: allShields.length,
        activeChains: activeShields.length,
        avgIntegrity,
        totalThreats,
        totalBlocked,
    };
}
