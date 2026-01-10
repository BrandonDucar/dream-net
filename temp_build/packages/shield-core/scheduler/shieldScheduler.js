"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runShieldCycle = runShieldCycle;
const shieldStore_1 = require("../store/shieldStore");
const shieldRotator_1 = require("../logic/shieldRotator");
const shieldModulator_1 = require("../logic/shieldModulator");
const shieldEmitter_1 = require("../logic/shieldEmitter");
const threatDetector_1 = require("../logic/threatDetector");
const offensiveSpike_1 = require("../logic/offensiveSpike");
const cellularShield_1 = require("../logic/cellularShield");
const shieldLearner_1 = require("../logic/shieldLearner");
const crossChainShield_1 = require("../logic/crossChainShield");
/**
 * Run one shield cycle:
 * - Rotate frequencies
 * - Detect threats
 * - Block threats
 * - Fire spikes if needed
 */
function runShieldCycle(ctx) {
    const now = Date.now();
    console.log("[Shield:Scheduler] Running shield cycle...");
    // 1. Ensure all shield phases exist
    const layers = (0, shieldRotator_1.ensureShieldPhases)();
    console.log(`[Shield:Scheduler] ${layers.length} shield layer(s) active`);
    // 2. Ensure modulators and emitters
    (0, shieldModulator_1.ensureDefaultModulators)();
    (0, shieldEmitter_1.ensureDefaultEmitters)();
    // 3. Rotate shield frequencies
    (0, shieldRotator_1.rotateShieldFrequencies)();
    // 4. Detect threats (simulated for now, will be real in production)
    const detectedThreats = (0, threatDetector_1.simulateThreatDetection)();
    if (detectedThreats.length > 0) {
        console.log(`[Shield:Scheduler] Detected ${detectedThreats.length} threat(s)`);
    }
    // 5. Analyze and block threats
    for (const threat of detectedThreats) {
        const analysis = (0, threatDetector_1.analyzeThreat)(threat);
        if (analysis.shouldBlock) {
            shieldStore_1.ShieldStore.blockThreat(threat.id);
            console.log(`[Shield:Scheduler] Blocked threat: ${threat.id} (${threat.type})`);
            // Fire spike if recommended
            if (analysis.recommendedSpike) {
                const spike = (0, offensiveSpike_1.fireSpikeAtThreat)(threat, analysis.recommendedSpike);
                if (spike) {
                    threat.spikeFired = true;
                    threat.spikeResult = spike.result;
                    shieldStore_1.ShieldStore.detectThreat(threat); // Update threat
                }
            }
        }
    }
    // 6. Update shield integrity based on threats
    const recentThreats = shieldStore_1.ShieldStore.listRecentThreats(100);
    const breachCount = recentThreats.filter((t) => !t.blocked).length;
    if (breachCount > 0) {
        // Reduce integrity slightly for each unblocked threat
        const layers = shieldStore_1.ShieldStore.listLayers();
        for (const layer of layers) {
            const integrityReduction = Math.min(breachCount * 0.01, 0.1); // Max 10% reduction
            const newIntegrity = Math.max(0, layer.integrity - integrityReduction);
            shieldStore_1.ShieldStore.updateLayer(layer.phase, {
                integrity: newIntegrity,
                breachCount: layer.breachCount + breachCount,
                lastBreach: now,
            });
        }
    }
    // 7. Ensure cellular shield layer exists
    let cellularLayer = shieldStore_1.ShieldStore.getLayer("cellular");
    if (!cellularLayer) {
        cellularLayer = shieldStore_1.ShieldStore.createLayer("cellular");
        console.log(`[Shield:Scheduler] Created cellular shield layer`);
    }
    // 8. Propagate shield updates via wormhole to cells
    if (ctx.eventWormholes && cellularLayer) {
        (0, cellularShield_1.propagateShieldViaWormhole)("shield-update", "cellular", {
            integrity: cellularLayer.integrity,
            frequency: cellularLayer.frequency.frequency,
        });
    }
    // 9. Learn from threats
    const threatPatterns = (0, shieldLearner_1.learnFromThreats)();
    if (threatPatterns.length > 0) {
        console.log(`[Shield:Scheduler] Learned ${threatPatterns.length} threat pattern(s)`);
    }
    // 10. Initialize cross-chain shields
    if (!shieldStore_1.ShieldStore.getLayer("omega-base")) {
        (0, crossChainShield_1.initializeCrossChainShield)("base", "8453");
        (0, crossChainShield_1.initializeCrossChainShield)("ethereum", "1");
        (0, crossChainShield_1.initializeCrossChainShield)("optimism", "10");
        console.log(`[Shield:Scheduler] Initialized cross-chain shields`);
    }
    // 11. Sync cross-chain shields
    (0, crossChainShield_1.syncCrossChainShields)();
    shieldStore_1.ShieldStore.setLastRunAt(now);
    console.log("[Shield:Scheduler] Shield cycle complete.");
    return shieldStore_1.ShieldStore.status();
}
