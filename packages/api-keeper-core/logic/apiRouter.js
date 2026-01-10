import { APIStore } from '../store/apiStore.js';
import { getBestKey } from './keyManager.js';
import { checkRailGuards } from './railGuards.js';
/**
 * Route an API request to the best provider/key based on cost, quality, availability
 */
export function routeRequest(request) {
    // Check rail guards first
    const guardCheck = checkRailGuards(request);
    if (!guardCheck.allowed) {
        throw new Error(`Request blocked by rail guard: ${guardCheck.reason}`);
    }
    // Find providers that match the category and features
    let candidates = APIStore.listActiveProviders()
        .filter((p) => p.category === request.category);
    // Filter by required features
    if (request.requiredFeatures && request.requiredFeatures.length > 0) {
        candidates = candidates.filter((p) => request.requiredFeatures.every((f) => p.features.includes(f)));
    }
    // Filter by preferred provider if specified
    if (request.preferredProvider) {
        const preferred = candidates.find((p) => p.id === request.preferredProvider);
        if (preferred) {
            candidates = [preferred];
        }
    }
    if (candidates.length === 0) {
        return null;
    }
    // Score each candidate
    const scored = candidates.map((provider) => {
        const key = getBestKey(provider.id);
        if (!key)
            return null;
        const score = scoreProvider(provider, key, request);
        return { provider, key, score };
    }).filter((s) => s !== null);
    if (scored.length === 0) {
        return null;
    }
    // Sort by score (higher is better)
    scored.sort((a, b) => b.score.total - a.score.total);
    const best = scored[0];
    const alternatives = scored.slice(1, 4).map((s) => ({
        providerId: s.provider.id,
        keyId: s.key.id,
        estimatedCost: s.score.estimatedCost,
        reason: s.score.reason,
    }));
    const decision = {
        providerId: best.provider.id,
        keyId: best.key.id,
        reason: best.score.reason,
        estimatedCost: best.score.estimatedCost,
        confidence: best.score.confidence,
        alternatives,
    };
    return decision;
}
/**
 * Score a provider/key combination for a request
 */
function scoreProvider(provider, key, request) {
    let score = 100;
    let estimatedCost = 0;
    const reasons = [];
    let confidence = 1.0;
    // Cost scoring (lower cost = higher score)
    if (provider.pricing.payPerUse?.pricePerRequest) {
        estimatedCost = provider.pricing.payPerUse.pricePerRequest;
        score += (1 - estimatedCost * 100) * 20; // Up to 20 points for low cost
        reasons.push(`Cost: $${estimatedCost.toFixed(4)}/request`);
    }
    else if (provider.pricing.paidTiers.length > 0) {
        const tier = provider.pricing.paidTiers[0];
        if (tier.pricePerRequest) {
            estimatedCost = tier.pricePerRequest;
            score += (1 - estimatedCost * 100) * 20;
            reasons.push(`Cost: $${estimatedCost.toFixed(4)}/request`);
        }
    }
    // Check max cost constraint
    if (request.maxCost && estimatedCost > request.maxCost) {
        score -= 1000; // Heavily penalize
        reasons.push(`Exceeds max cost ($${request.maxCost})`);
        confidence *= 0.5;
    }
    // Quality scoring (higher quality = higher score)
    score += provider.quality * 30; // Up to 30 points
    reasons.push(`Quality: ${(provider.quality * 100).toFixed(0)}%`);
    // Reliability scoring
    score += provider.reliability * 20; // Up to 20 points
    reasons.push(`Reliability: ${(provider.reliability * 100).toFixed(0)}%`);
    // Latency scoring (lower latency = higher score)
    if (provider.latency) {
        const latencyScore = Math.max(0, 30 - (provider.latency / 100)); // Up to 30 points
        score += latencyScore;
        reasons.push(`Latency: ${provider.latency}ms`);
    }
    // Key availability scoring
    if (key.quotaLimit && key.quotaUsed !== undefined) {
        const quotaRemaining = key.quotaLimit - key.quotaUsed;
        const quotaPercent = quotaRemaining / key.quotaLimit;
        score += quotaPercent * 10; // Up to 10 points for quota remaining
        reasons.push(`Quota: ${quotaRemaining}/${key.quotaLimit} remaining`);
        if (quotaRemaining < key.quotaLimit * 0.1) {
            confidence *= 0.7; // Lower confidence if quota almost exhausted
        }
    }
    // Usage balancing (prefer less-used keys)
    const usageScore = Math.max(0, 10 - (key.usageThisMonth / 100)); // Up to 10 points
    score += usageScore;
    return {
        total: Math.max(0, score),
        estimatedCost,
        reason: reasons.join(", "),
        confidence: Math.min(1, confidence),
    };
}
//# sourceMappingURL=apiRouter.js.map