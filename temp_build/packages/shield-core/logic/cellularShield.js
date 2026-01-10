"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wormholeSignals = exports.cellularShields = void 0;
exports.createCellularShield = createCellularShield;
exports.getCellularShield = getCellularShield;
exports.updateCellularShieldIntegrity = updateCellularShieldIntegrity;
exports.propagateShieldViaWormhole = propagateShieldViaWormhole;
exports.listCellularShields = listCellularShields;
exports.getCellularShieldStats = getCellularShieldStats;
exports.getRecentWormholeSignals = getRecentWormholeSignals;
const shieldStore_1 = require("../store/shieldStore");
let cellularShieldCounter = 0;
function nextCellularShieldId() {
    cellularShieldCounter += 1;
    return `cellular:${Date.now()}:${cellularShieldCounter}`;
}
let wormholeSignalCounter = 0;
function nextWormholeSignalId() {
    wormholeSignalCounter += 1;
    return `wormhole-signal:${Date.now()}:${wormholeSignalCounter}`;
}
const cellularShields = new Map();
exports.cellularShields = cellularShields;
const wormholeSignals = [];
exports.wormholeSignals = wormholeSignals;
/**
 * Create cellular shield for a cell
 */
function createCellularShield(cellId, cellType, wormholeId) {
    const now = Date.now();
    const cellularLayer = shieldStore_1.ShieldStore.getLayer("cellular");
    const baseFrequency = cellularLayer?.frequency.frequency || 15000; // Higher frequency for cellular
    const shield = {
        cellId,
        cellType,
        shieldStrength: 1.0,
        frequency: baseFrequency + Math.random() * 100, // Unique frequency per cell
        integrity: 1.0,
        lastUpdate: now,
        threatCount: 0,
        blockedCount: 0,
        wormholeConnected: !!wormholeId,
        wormholeId,
    };
    cellularShields.set(cellId, shield);
    console.log(`[CellularShield] Created shield for cell ${cellId} (${cellType})`);
    return shield;
}
/**
 * Get cellular shield for a cell
 */
function getCellularShield(cellId) {
    return cellularShields.get(cellId);
}
/**
 * Update cellular shield integrity
 */
function updateCellularShieldIntegrity(cellId, integrity) {
    const shield = cellularShields.get(cellId);
    if (!shield)
        return false;
    shield.integrity = Math.max(0, Math.min(1, integrity));
    shield.shieldStrength = shield.integrity; // Sync strength with integrity
    shield.lastUpdate = Date.now();
    cellularShields.set(cellId, shield);
    return true;
}
/**
 * Propagate shield signal via wormhole
 */
function propagateShieldViaWormhole(signalType, sourcePhase, payload, targetCells) {
    const now = Date.now();
    const signal = {
        id: nextWormholeSignalId(),
        signalType,
        sourcePhase,
        targetCells,
        payload,
        propagatedAt: now,
        propagationCount: 0,
    };
    // Propagate to all cellular shields
    const cellsToUpdate = targetCells || Array.from(cellularShields.keys());
    for (const cellId of cellsToUpdate) {
        const shield = cellularShields.get(cellId);
        if (shield && shield.wormholeConnected) {
            // Update cell based on signal type
            switch (signalType) {
                case "shield-update":
                    if (payload.integrity !== undefined) {
                        updateCellularShieldIntegrity(cellId, payload.integrity);
                    }
                    if (payload.frequency !== undefined) {
                        shield.frequency = payload.frequency;
                    }
                    break;
                case "threat-alert":
                    shield.threatCount += 1;
                    if (payload.blocked) {
                        shield.blockedCount += 1;
                    }
                    break;
                case "frequency-sync":
                    shield.frequency = payload.frequency || shield.frequency;
                    break;
                case "spike-command":
                    // Cell receives spike command
                    break;
            }
            shield.lastUpdate = now;
            cellularShields.set(cellId, shield);
            signal.propagationCount += 1;
        }
    }
    wormholeSignals.push(signal);
    if (wormholeSignals.length > 1000) {
        wormholeSignals.shift();
    }
    console.log(`[CellularShield] Propagated ${signalType} signal to ${signal.propagationCount} cells via wormhole`);
    return signal;
}
/**
 * List all cellular shields
 */
function listCellularShields() {
    return Array.from(cellularShields.values());
}
/**
 * Get cellular shield statistics
 */
function getCellularShieldStats() {
    const allShields = Array.from(cellularShields.values());
    const wormholeConnected = allShields.filter((s) => s.wormholeConnected).length;
    const avgIntegrity = allShields.length > 0
        ? allShields.reduce((sum, s) => sum + s.integrity, 0) / allShields.length
        : 1.0;
    const totalThreats = allShields.reduce((sum, s) => sum + s.threatCount, 0);
    const totalBlocked = allShields.reduce((sum, s) => sum + s.blockedCount, 0);
    return {
        totalCells: allShields.length,
        wormholeConnected,
        avgIntegrity,
        totalThreats,
        totalBlocked,
    };
}
/**
 * Get recent wormhole signals
 */
function getRecentWormholeSignals(limit = 50) {
    return wormholeSignals.slice(-limit).reverse();
}
