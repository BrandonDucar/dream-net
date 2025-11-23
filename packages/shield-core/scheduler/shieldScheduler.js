import { ShieldStore } from "../store/shieldStore";
import { ensureShieldPhases, rotateShieldFrequencies } from "../logic/shieldRotator";
import { ensureDefaultModulators } from "../logic/shieldModulator";
import { ensureDefaultEmitters } from "../logic/shieldEmitter";
import { simulateThreatDetection, analyzeThreat } from "../logic/threatDetector";
import { fireSpikeAtThreat } from "../logic/offensiveSpike";
import { propagateShieldViaWormhole } from "../logic/cellularShield";
import { learnFromThreats } from "../logic/shieldLearner";
import { initializeCrossChainShield, syncCrossChainShields } from "../logic/crossChainShield";
/**
 * Run one shield cycle:
 * - Rotate frequencies
 * - Detect threats
 * - Block threats
 * - Fire spikes if needed
 */
export function runShieldCycle(ctx) {
    const now = Date.now();
    console.log("[Shield:Scheduler] Running shield cycle...");
    // 1. Ensure all shield phases exist
    const layers = ensureShieldPhases();
    console.log(`[Shield:Scheduler] ${layers.length} shield layer(s) active`);
    // 2. Ensure modulators and emitters
    ensureDefaultModulators();
    ensureDefaultEmitters();
    // 3. Rotate shield frequencies
    rotateShieldFrequencies();
    // 4. Detect threats (simulated for now, will be real in production)
    const detectedThreats = simulateThreatDetection();
    if (detectedThreats.length > 0) {
        console.log(`[Shield:Scheduler] Detected ${detectedThreats.length} threat(s)`);
    }
    // 5. Analyze and block threats
    for (const threat of detectedThreats) {
        const analysis = analyzeThreat(threat);
        if (analysis.shouldBlock) {
            ShieldStore.blockThreat(threat.id);
            console.log(`[Shield:Scheduler] Blocked threat: ${threat.id} (${threat.type})`);
            // Fire spike if recommended
            if (analysis.recommendedSpike) {
                const spike = fireSpikeAtThreat(threat, analysis.recommendedSpike);
                if (spike) {
                    threat.spikeFired = true;
                    threat.spikeResult = spike.result;
                    ShieldStore.detectThreat(threat); // Update threat
                }
            }
        }
    }
    // 6. Update shield integrity based on threats
    const recentThreats = ShieldStore.listRecentThreats(100);
    const breachCount = recentThreats.filter((t) => !t.blocked).length;
    if (breachCount > 0) {
        // Reduce integrity slightly for each unblocked threat
        const layers = ShieldStore.listLayers();
        for (const layer of layers) {
            const integrityReduction = Math.min(breachCount * 0.01, 0.1); // Max 10% reduction
            const newIntegrity = Math.max(0, layer.integrity - integrityReduction);
            ShieldStore.updateLayer(layer.phase, {
                integrity: newIntegrity,
                breachCount: layer.breachCount + breachCount,
                lastBreach: now,
            });
        }
    }
    // 7. Ensure cellular shield layer exists
    let cellularLayer = ShieldStore.getLayer("cellular");
    if (!cellularLayer) {
        cellularLayer = ShieldStore.createLayer("cellular");
        console.log(`[Shield:Scheduler] Created cellular shield layer`);
    }
    // 8. Propagate shield updates via wormhole to cells
    if (ctx.eventWormholes && cellularLayer) {
        propagateShieldViaWormhole("shield-update", "cellular", {
            integrity: cellularLayer.integrity,
            frequency: cellularLayer.frequency.frequency,
        });
    }
    // 9. Learn from threats
    const threatPatterns = learnFromThreats();
    if (threatPatterns.length > 0) {
        console.log(`[Shield:Scheduler] Learned ${threatPatterns.length} threat pattern(s)`);
    }
    // 10. Initialize cross-chain shields
    if (!ShieldStore.getLayer("omega-base")) {
        initializeCrossChainShield("base", "8453");
        initializeCrossChainShield("ethereum", "1");
        initializeCrossChainShield("optimism", "10");
        console.log(`[Shield:Scheduler] Initialized cross-chain shields`);
    }
    // 11. Sync cross-chain shields
    syncCrossChainShields();
    ShieldStore.setLastRunAt(now);
    console.log("[Shield:Scheduler] Shield cycle complete.");
    return ShieldStore.status();
}
