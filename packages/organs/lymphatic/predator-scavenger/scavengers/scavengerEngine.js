export function runScavengerEngine(decaySignals, ctx) {
    const actions = [];
    const now = Date.now();
    decaySignals.forEach((sig) => {
        const reclaimed = sig.severity < 0.4;
        const recycled = true; // everything gets recycled in v1
        actions.push({
            sourceId: sig.id,
            reclaimed,
            recycled,
            meta: {
                reason: "baseline scavenger sweep",
                timestamp: now,
            },
        });
        if (ctx.slugTime?.addSample) {
            ctx.slugTime.addSample({
                id: `psl-recycle-${sig.id}`,
                key: sig.targetId,
                kind: "generic",
                value: sig.severity,
                source: "ScavengerEngine",
                createdAt: now,
            });
        }
    });
    return actions;
}
//# sourceMappingURL=scavengerEngine.js.map