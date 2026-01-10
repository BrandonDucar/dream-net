import { FieldStore } from '../store/fieldStore.js';
function point(kind, id) {
    return { kind, id };
}
export function updateFieldsFromReputation(ctx, now) {
    if (!ctx.reputationLattice?.status)
        return;
    const repStatus = ctx.reputationLattice.status();
    const scores = repStatus.scoresSample ?? [];
    scores.forEach((s) => {
        if (!s.entityType || !s.entityId)
            return;
        const p = point(mapRepTypeToFieldKind(s.entityType), `${s.entityType}:${s.entityId}`);
        const trustValue = typeof s.score === "number" ? s.score : 0.5;
        const riskValue = 1 - trustValue;
        FieldStore.upsertSample("trust", p, trustValue, now);
        FieldStore.upsertSample("risk", p, riskValue, now);
    });
}
export function updateFieldsFromStarBridge(ctx, now) {
    if (!ctx.starBridge?.status)
        return;
    const sbStatus = ctx.starBridge.status();
    const metrics = sbStatus.chainMetrics ?? [];
    metrics.forEach((m) => {
        if (!m.chain)
            return;
        const p = point("chain", `chain:${m.chain}`);
        const liquidity = typeof m.liquidityPressure === "number"
            ? m.liquidityPressure
            : 0.5;
        const reliability = typeof m.reliability === "number"
            ? m.reliability
            : 0.5;
        FieldStore.upsertSample("liquidity", p, liquidity, now);
        FieldStore.upsertSample("trust", p, reliability, now);
        FieldStore.upsertSample("risk", p, 1 - reliability, now);
    });
}
export function updateFieldsFromQAL(ctx, now) {
    if (!ctx.quantumAnticipation?.status)
        return;
    // If QAL exposes last predictions, we could build fields per predicted hotspot.
    // For now we create a generic "load" bump.
    const p = point("generic", "system:global");
    FieldStore.upsertSample("load", p, 0.5, now);
}
export function updateFieldsFromDreamCortex(ctx, now) {
    if (!ctx.dreamCortex?.listDreams || !ctx.dreamCortex?.status)
        return;
    const dreams = ctx.dreamCortex.listDreams();
    dreams.forEach((d) => {
        const p = point("dream", `dream:${d.id}`);
        let base = 0.5;
        switch (d.priority) {
            case "low":
                base -= 0.1;
                break;
            case "high":
                base += 0.1;
                break;
            case "critical":
                base += 0.2;
                break;
        }
        if (d.status === "completed")
            base -= 0.3;
        if (d.status === "blocked" || d.status === "infected")
            base += 0.2;
        const priorityValue = Math.max(0, Math.min(1, base));
        FieldStore.upsertSample("dreamPriority", p, priorityValue, now);
    });
}
export function updateFieldsFromWolfPackAndPSL(ctx, now) {
    // WolfPack active targets => local risk spikes
    if (ctx.wolfPack?.status) {
        const wolfStatus = ctx.wolfPack.status();
        const activeTargets = wolfStatus.activeTargets ?? [];
        activeTargets.forEach((id) => {
            const p = point("service", `service:${id}`);
            FieldStore.upsertSample("risk", p, 0.8, now);
        });
    }
    // Predator-Scavenger Loop decay signals => risk/priority hints
    if (ctx.predatorScavenger?.status) {
        const pslStatus = ctx.predatorScavenger.status();
        const decaySignals = pslStatus.decaySignals ?? [];
        decaySignals.forEach((sig) => {
            const p = point(mapDecayTargetToKind(sig.targetType), `${sig.targetType}:${sig.targetId}`);
            const sev = typeof sig.severity === "number" ? sig.severity : 0.5;
            FieldStore.upsertSample("risk", p, sev, now);
        });
    }
}
function mapRepTypeToFieldKind(entityType) {
    switch (entityType) {
        case "dream":
            return "dream";
        case "agent":
        case "service":
        case "route":
        case "wormhole":
            return "service";
        case "wallet":
            return "wallet";
        default:
            return "generic";
    }
}
function mapDecayTargetToKind(targetType) {
    switch (targetType) {
        case "route":
        case "service":
            return "service";
        case "agent":
            return "agent";
        case "config":
            return "generic";
        case "dream":
            return "dream";
        default:
            return "generic";
    }
}
//# sourceMappingURL=fieldUpdaters.js.map