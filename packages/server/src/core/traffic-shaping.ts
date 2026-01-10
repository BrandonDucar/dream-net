/**
 * Traffic Shaping Core Logic
 * Handles rollout calculations and metrics recording
 */

interface RolloutConfig {
    percentage: number; // 0-100
    allowList: string[]; // User IDs or IPs
    denyList: string[];
}

// In-memory store for rollout configs (would be in DB/Redis in production)
const rollouts = new Map<string, RolloutConfig>();

// Default config: 100% rollout (enabled)
const DEFAULT_CONFIG: RolloutConfig = {
    percentage: 100,
    allowList: [],
    denyList: []
};

export function shouldRouteToNewVersion(featureName: string, userId: string = 'anonymous'): boolean {
    const config = rollouts.get(featureName) || DEFAULT_CONFIG;

    // Check allow/deny lists
    if (config.denyList.includes(userId)) {
        return false;
    }
    if (config.allowList.includes(userId)) {
        return true;
    }

    // Check percentage rollout (deterministic hash)
    const hash = simpleHash(`${featureName}:${userId}`);
    const normalizedHash = Math.abs(hash) % 100;

    return normalizedHash < config.percentage;
}

export function recordRequestMetrics(featureName: string, success: boolean, latencyMs: number) {
    // In a real system, this would aggregate metrics to Prometheus/Datadog
    // For now, we'll just log significant events or errors
    if (!success) {
        console.warn(`[TrafficShaping] ${featureName} request failed (${latencyMs}ms)`);
    }

    // TODO: Integrate with metrics middleware store if needed
}

export const updateRollout = (featureName: string, config: Partial<RolloutConfig>) => {
    const current = rollouts.get(featureName) || DEFAULT_CONFIG;
    rollouts.set(featureName, { ...current, ...config });
};

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return hash;
}
