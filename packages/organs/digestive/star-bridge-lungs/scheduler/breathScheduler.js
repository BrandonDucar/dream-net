import { collectChainMetrics, computeBreathSnapshots, getCachedChainMetrics, getLastBreaths, } from '../engine/breathEngine.js';
let lastRunAt = null;
export async function runStarBridgeCycle(ctx) {
    const metrics = collectChainMetrics();
    const breaths = await computeBreathSnapshots(metrics);
    lastRunAt = Date.now();
    // Optional: push into Neural Mesh / Slug-Time / QAL
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "StarBridgeLungs",
            chainMetrics: metrics,
            breaths,
            timestamp: lastRunAt,
        });
    }
    if (ctx.slugTimeMemory?.addSample) {
        metrics.forEach((m) => {
            ctx.slugTimeMemory.addSample({
                id: `routing-health-${m.chain}-${lastRunAt}`,
                key: m.chain,
                kind: "routing-health",
                value: m.reliability,
                source: "StarBridgeLungs",
                createdAt: lastRunAt,
            });
        });
    }
    // Optional: inform slime router about "preferred paths"
    if (ctx.slimeRouter?.setPreferredChains && breaths.length) {
        const preferredPairs = breaths
            .filter((b) => b.recommended && b.direction === "exhale")
            .map((b) => ({ from: b.fromChain, to: b.toChain, score: b.pressureScore }));
        ctx.slimeRouter.setPreferredChains(preferredPairs);
    }
    return starBridgeStatus();
}
export function starBridgeStatus() {
    return {
        lastRunAt,
        chainMetrics: getCachedChainMetrics(),
        lastBreaths: getLastBreaths(),
    };
}
//# sourceMappingURL=breathScheduler.js.map