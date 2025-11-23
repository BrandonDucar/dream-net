export function runPredatorEngine(decaySignals, ctx) {
    const actions = [];
    decaySignals.forEach((sig) => {
        const quarantined = sig.severity > 0.6;
        const flagged = sig.severity > 0.3;
        actions.push({
            signalId: sig.id,
            targetId: sig.targetId,
            quarantined,
            flagged,
            meta: {
                note: "mark-only mode",
                severity: sig.severity,
            },
        });
        if (ctx.neuralMesh?.remember) {
            ctx.neuralMesh.remember({
                source: "PredatorEngine",
                signal: sig,
                action: quarantined ? "quarantine" : flagged ? "flag" : "observe",
                timestamp: Date.now(),
            });
        }
    });
    return actions;
}
