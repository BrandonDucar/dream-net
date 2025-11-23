/**
 * Control Store - In-memory state for kill-switch and rate limits
 * In production, this should use Redis/KV store
 */
import { TIERS } from "../tierConfig";
class ControlStore {
    killSwitchState = {
        globalKillSwitch: false,
        clusterStates: {},
        lastUpdatedAt: Date.now(),
    };
    rateLimits = new Map();
    requestCounts = new Map();
    circuitBreakers = new Map();
    // Tier-based rate limiting
    tierRequestCounts = new Map();
    tierConcurrencyCounts = new Map();
    // Initialize default rate limits
    constructor() {
        this.initializeDefaultRateLimits();
    }
    initializeDefaultRateLimits() {
        const defaultLimits = [
            {
                clusterId: "wolf-pack",
                requestsPerMinute: 60,
                requestsPerHour: 1000,
                requestsPerDay: 10000,
                enabled: true,
            },
            {
                clusterId: "orca-pack",
                requestsPerMinute: 30,
                requestsPerHour: 500,
                requestsPerDay: 5000,
                enabled: true,
            },
            {
                clusterId: "whale-pack",
                requestsPerMinute: 30,
                requestsPerHour: 500,
                requestsPerDay: 5000,
                enabled: true,
            },
            {
                clusterId: "octopus-executor",
                requestsPerMinute: 120,
                requestsPerHour: 5000,
                requestsPerDay: 50000,
                enabled: true,
            },
            {
                clusterId: "spider-web",
                requestsPerMinute: 100,
                requestsPerHour: 2000,
                requestsPerDay: 20000,
                enabled: true,
            },
            {
                clusterId: "jaggy-core",
                requestsPerMinute: 20,
                requestsPerHour: 200,
                requestsPerDay: 2000,
                enabled: true,
            },
            {
                clusterId: "webhook-nervous",
                requestsPerMinute: 200,
                requestsPerHour: 5000,
                requestsPerDay: 50000,
                enabled: true,
            },
            {
                clusterId: "shield-core",
                requestsPerMinute: 1000,
                requestsPerHour: 50000,
                requestsPerDay: 500000,
                enabled: true,
            },
            {
                clusterId: "api-keeper",
                requestsPerMinute: 100,
                requestsPerHour: 2000,
                requestsPerDay: 20000,
                enabled: true,
            },
            {
                clusterId: "ai-seo",
                requestsPerMinute: 50,
                requestsPerHour: 1000,
                requestsPerDay: 10000,
                enabled: true,
            },
            {
                clusterId: "dream-state",
                requestsPerMinute: 60,
                requestsPerHour: 1000,
                requestsPerDay: 10000,
                enabled: true,
            },
            {
                clusterId: "star-bridge",
                requestsPerMinute: 30,
                requestsPerHour: 500,
                requestsPerDay: 5000,
                enabled: true,
            },
        ];
        for (const limit of defaultLimits) {
            this.rateLimits.set(limit.clusterId, limit);
            this.requestCounts.set(limit.clusterId, []);
        }
    }
    // Kill-switch methods
    getKillSwitchState() {
        return { ...this.killSwitchState };
    }
    setGlobalKillSwitch(enabled, reason, disabledBy) {
        this.killSwitchState.globalKillSwitch = enabled;
        this.killSwitchState.lastUpdatedAt = Date.now();
        if (enabled) {
            console.log(`🚨 [Control] Global kill-switch ENABLED - Reason: ${reason || "Manual"}`);
        }
        else {
            console.log(`✅ [Control] Global kill-switch DISABLED - Reason: ${reason || "Manual"}`);
        }
    }
    setClusterState(clusterId, enabled, reason, disabledBy) {
        if (!this.killSwitchState.clusterStates[clusterId]) {
            this.killSwitchState.clusterStates[clusterId] = { enabled: true };
        }
        this.killSwitchState.clusterStates[clusterId].enabled = enabled;
        this.killSwitchState.clusterStates[clusterId].reason = reason;
        this.killSwitchState.clusterStates[clusterId].disabledBy = disabledBy;
        if (!enabled) {
            this.killSwitchState.clusterStates[clusterId].disabledAt = Date.now();
        }
        else {
            delete this.killSwitchState.clusterStates[clusterId].disabledAt;
        }
        this.killSwitchState.lastUpdatedAt = Date.now();
        console.log(`🎛️  [Control] Cluster ${clusterId}: ${enabled ? "ENABLED" : "DISABLED"} - ${reason || "Manual"}`);
    }
    isClusterEnabled(clusterId) {
        // Check global kill-switch first
        if (this.killSwitchState.globalKillSwitch) {
            return false;
        }
        // Check cluster-specific state
        const clusterState = this.killSwitchState.clusterStates[clusterId];
        if (clusterState && clusterState.enabled === false) {
            return false;
        }
        return true;
    }
    // Rate limiting methods
    getRateLimit(clusterId) {
        return this.rateLimits.get(clusterId);
    }
    setRateLimit(limit) {
        this.rateLimits.set(limit.clusterId, limit);
        if (!this.requestCounts.has(limit.clusterId)) {
            this.requestCounts.set(limit.clusterId, []);
        }
    }
    recordRequest(clusterId) {
        const counts = this.requestCounts.get(clusterId) || [];
        counts.push({ timestamp: Date.now() });
        // Keep only last 24 hours of requests
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const filtered = counts.filter(r => r.timestamp > oneDayAgo);
        this.requestCounts.set(clusterId, filtered);
    }
    checkRateLimit(clusterId) {
        const limit = this.rateLimits.get(clusterId);
        if (!limit || !limit.enabled) {
            return { allowed: true };
        }
        const counts = this.requestCounts.get(clusterId) || [];
        const now = Date.now();
        // Check per-minute limit
        const oneMinuteAgo = now - 60 * 1000;
        const requestsLastMinute = counts.filter(r => r.timestamp > oneMinuteAgo).length;
        if (requestsLastMinute >= limit.requestsPerMinute) {
            return {
                allowed: false,
                reason: `Rate limit exceeded: ${requestsLastMinute}/${limit.requestsPerMinute} requests per minute`,
                remaining: limit.requestsPerMinute - requestsLastMinute,
            };
        }
        // Check per-hour limit
        const oneHourAgo = now - 60 * 60 * 1000;
        const requestsLastHour = counts.filter(r => r.timestamp > oneHourAgo).length;
        if (requestsLastHour >= limit.requestsPerHour) {
            return {
                allowed: false,
                reason: `Rate limit exceeded: ${requestsLastHour}/${limit.requestsPerHour} requests per hour`,
                remaining: limit.requestsPerHour - requestsLastHour,
            };
        }
        // Check per-day limit
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const requestsLastDay = counts.filter(r => r.timestamp > oneDayAgo).length;
        if (requestsLastDay >= limit.requestsPerDay) {
            return {
                allowed: false,
                reason: `Rate limit exceeded: ${requestsLastDay}/${limit.requestsPerDay} requests per day`,
                remaining: limit.requestsPerDay - requestsLastDay,
            };
        }
        return { allowed: true, remaining: limit.requestsPerMinute - requestsLastMinute };
    }
    // Circuit breaker methods
    tripCircuitBreaker(clusterId, autoResetAfter) {
        const breaker = this.circuitBreakers.get(clusterId) || { tripped: false, tripCount: 0 };
        breaker.tripped = true;
        breaker.tripCount += 1;
        breaker.lastTripAt = Date.now();
        breaker.autoResetAfter = autoResetAfter;
        this.circuitBreakers.set(clusterId, breaker);
        console.log(`⚡ [Control] Circuit breaker TRIPPED for ${clusterId} (trip #${breaker.tripCount})`);
    }
    resetCircuitBreaker(clusterId) {
        const breaker = this.circuitBreakers.get(clusterId);
        if (breaker) {
            breaker.tripped = false;
            this.circuitBreakers.set(clusterId, breaker);
            console.log(`✅ [Control] Circuit breaker RESET for ${clusterId}`);
        }
    }
    isCircuitBreakerTripped(clusterId) {
        const breaker = this.circuitBreakers.get(clusterId);
        if (!breaker || !breaker.tripped) {
            return false;
        }
        // Auto-reset if time has passed
        if (breaker.autoResetAfter && breaker.lastTripAt) {
            const timeSinceTrip = Date.now() - breaker.lastTripAt;
            if (timeSinceTrip >= breaker.autoResetAfter) {
                this.resetCircuitBreaker(clusterId);
                return false;
            }
        }
        return true;
    }
    // Tier-based rate limiting methods
    recordTierRequest(tierId) {
        const counts = this.tierRequestCounts.get(tierId) || [];
        counts.push({ timestamp: Date.now() });
        // Keep only last 24 hours of requests
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const filtered = counts.filter(r => r.timestamp > oneDayAgo);
        this.tierRequestCounts.set(tierId, filtered);
    }
    /**
     * Check tier rate limit with effective limit (min of cluster and tier limits)
     *
     * @param tierId - Tier ID
     * @param tierConfig - Tier configuration
     * @param clusterLimitPerMinute - Cluster rate limit per minute
     * @returns Rate limit check result
     */
    checkTierRateLimit(tierId, tierConfig, clusterLimitPerMinute) {
        const counts = this.tierRequestCounts.get(tierId) || [];
        const now = Date.now();
        // Effective limit = min(cluster limit, tier limit)
        const effectiveLimitPerMinute = Math.min(clusterLimitPerMinute, tierConfig.maxRequestsPerMinute);
        // Check per-minute limit
        const oneMinuteAgo = now - 60 * 1000;
        const requestsLastMinute = counts.filter(r => r.timestamp > oneMinuteAgo).length;
        if (requestsLastMinute >= effectiveLimitPerMinute) {
            return {
                allowed: false,
                reason: `Rate limit exceeded: ${requestsLastMinute}/${effectiveLimitPerMinute} requests per minute (tier: ${tierId}, cluster: ${clusterLimitPerMinute})`,
                remaining: effectiveLimitPerMinute - requestsLastMinute,
            };
        }
        // Check per-hour limit if configured
        if (tierConfig.maxRequestsPerHour !== undefined) {
            const oneHourAgo = now - 60 * 60 * 1000;
            const requestsLastHour = counts.filter(r => r.timestamp > oneHourAgo).length;
            if (requestsLastHour >= tierConfig.maxRequestsPerHour) {
                return {
                    allowed: false,
                    reason: `Tier rate limit exceeded: ${requestsLastHour}/${tierConfig.maxRequestsPerHour} requests per hour`,
                    remaining: tierConfig.maxRequestsPerHour - requestsLastHour,
                };
            }
        }
        // Check concurrency limit if configured
        if (tierConfig.maxConcurrentRequests !== undefined) {
            const currentConcurrency = this.tierConcurrencyCounts.get(tierId) || 0;
            if (currentConcurrency >= tierConfig.maxConcurrentRequests) {
                return {
                    allowed: false,
                    reason: `Tier concurrency limit exceeded: ${currentConcurrency}/${tierConfig.maxConcurrentRequests} concurrent requests`,
                    remaining: tierConfig.maxConcurrentRequests - currentConcurrency,
                };
            }
        }
        return { allowed: true, remaining: effectiveLimitPerMinute - requestsLastMinute };
    }
    incrementTierConcurrency(tierId) {
        const current = this.tierConcurrencyCounts.get(tierId) || 0;
        this.tierConcurrencyCounts.set(tierId, current + 1);
    }
    decrementTierConcurrency(tierId) {
        const current = this.tierConcurrencyCounts.get(tierId) || 0;
        this.tierConcurrencyCounts.set(tierId, Math.max(0, current - 1));
    }
    // Get full config
    getConfig() {
        const clusterStates = {};
        for (const clusterId of this.rateLimits.keys()) {
            clusterStates[clusterId] = {
                enabled: this.isClusterEnabled(clusterId),
                ...this.killSwitchState.clusterStates[clusterId],
            };
        }
        const circuitBreakers = {};
        for (const [clusterId, breaker] of this.circuitBreakers.entries()) {
            circuitBreakers[clusterId] = { ...breaker };
        }
        return {
            killSwitch: this.getKillSwitchState(),
            rateLimits: Array.from(this.rateLimits.values()),
            circuitBreakers,
            tierConfigs: TIERS,
        };
    }
}
export const controlStore = new ControlStore();
