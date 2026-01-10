"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStarBridgeCycle = runStarBridgeCycle;
exports.starBridgeStatus = starBridgeStatus;
const breathEngine_1 = require("../engine/breathEngine");
let lastRunAt = null;
function runStarBridgeCycle(ctx) {
    const metrics = (0, breathEngine_1.collectChainMetrics)();
    const breaths = (0, breathEngine_1.computeBreathSnapshots)(metrics);
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
function starBridgeStatus() {
    return {
        lastRunAt,
        chainMetrics: (0, breathEngine_1.getCachedChainMetrics)(),
        lastBreaths: (0, breathEngine_1.getLastBreaths)(),
    };
}
