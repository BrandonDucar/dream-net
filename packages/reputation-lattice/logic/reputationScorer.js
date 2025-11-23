import { ReputationStore } from "../store/reputationStore";
export function recomputeReputation(now) {
    const cfg = ReputationStore.getConfig();
    const allSignals = ReputationStore.getSignals();
    const byEntity = new Map();
    for (const s of allSignals) {
        const key = `${s.entityType}:${s.entityId}`;
        if (!byEntity.has(key))
            byEntity.set(key, []);
        byEntity.get(key).push(s);
    }
    for (const [key, entitySignals] of byEntity.entries()) {
        if (!entitySignals.length)
            continue;
        const [entityTypeStr, entityId] = key.split(":");
        const entityType = entityTypeStr;
        const { score, lastUpdatedAt } = scoreForEntity(entityType, entityId, entitySignals, cfg, now);
        const rep = {
            entityType,
            entityId,
            score,
            lastUpdatedAt,
            signalCount: entitySignals.length,
        };
        ReputationStore.upsertScore(rep);
    }
}
function scoreForEntity(entityType, entityId, signals, cfg, now) {
    const halfLife = cfg.decayHalfLifeMs || (1000 * 60 * 60 * 24);
    let weightedSum = 0;
    let weightTotal = 0;
    let lastUpdatedAt = 0;
    for (const s of signals) {
        const ageMs = now - s.createdAt;
        const decay = Math.pow(0.5, ageMs / halfLife);
        const effectiveWeight = s.weight * decay;
        weightedSum += s.value * effectiveWeight;
        weightTotal += effectiveWeight;
        if (s.createdAt > lastUpdatedAt) {
            lastUpdatedAt = s.createdAt;
        }
    }
    if (weightTotal <= 0) {
        return { score: 0.5, lastUpdatedAt: now };
    }
    // value in [-1,1] => score in [0,1]
    const raw = weightedSum / weightTotal;
    const normalized = (raw + 1) / 2;
    return {
        score: Math.max(0, Math.min(1, normalized)),
        lastUpdatedAt,
    };
}
