/**
 * Shield Core Risk Profile
 * Tracks risk per caller (API key/wallet/citizen) for adaptive decisions
 */
const profiles = new Map();
export function getRiskProfile(callerId) {
    return profiles.get(callerId);
}
function toLevel(score) {
    if (score < 0.3)
        return "low";
    if (score < 0.6)
        return "medium";
    if (score < 0.8)
        return "high";
    return "critical";
}
export function updateRiskProfile(params) {
    const now = new Date().toISOString();
    let existing = profiles.get(params.callerId);
    if (!existing) {
        existing = {
            callerId: params.callerId,
            tierId: params.tierId,
            lastUpdatedAt: now,
            score: 0.2,
            level: "low",
            recentFailures: 0,
            recentHighRiskUses: 0,
        };
    }
    let score = existing.score + params.baseDelta;
    if (params.isFailure)
        score += 0.15;
    if (params.isHighRiskTool)
        score += 0.1;
    score = Math.min(1, Math.max(0, score));
    const level = toLevel(score);
    const recentFailures = params.isFailure
        ? existing.recentFailures + 1
        : Math.max(0, existing.recentFailures - 0.1);
    const recentHighRiskUses = params.isHighRiskTool
        ? existing.recentHighRiskUses + 1
        : Math.max(0, existing.recentHighRiskUses - 0.1);
    const updated = {
        ...existing,
        tierId: params.tierId,
        lastUpdatedAt: now,
        score,
        level,
        recentFailures,
        recentHighRiskUses,
        lastToolId: params.toolId ?? existing.lastToolId,
        lastPortId: params.portId ?? existing.lastPortId,
    };
    profiles.set(params.callerId, updated);
    return updated;
}
export function listRiskProfiles() {
    return Array.from(profiles.values());
}
export function getRiskProfilesByLevel(level) {
    return listRiskProfiles().filter((p) => p.level === level);
}
//# sourceMappingURL=risk.js.map