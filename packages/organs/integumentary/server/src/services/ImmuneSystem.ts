/**
 * Immune Anomaly Response Service (Mission 93)
 * 
 * Monitors system health via Trust Metrics and automatically triggers defense mechanisms.
 * Defense Ladder: 
 * 1. Local Apoptosis (Component-level restart/refresh)
 * 2. Quarantine (Open circuit breakers for specific endpoints)
 * 3. Fever (Apply concurrency constraints to slow down throughput)
 */

import { getMetric, listMetrics } from '../trust/metrics.js';
import { withCircuitBreaker } from '../core/circuit-breaker.js';
import { HachimojiState } from '../types/hachimoji.js';

export interface AnomalyProfile {
    id: string;
    latencyBound: number;   // Max acceptable latency (ms)
    errorThreshold: number; // Max acceptable error rate (%)
    typicalFanOut: number;  // Expected number of downstream calls
}

class ImmuneSystem {
    private profiles: Map<string, AnomalyProfile> = new Map();
    private lastCheck: number = Date.now();
    private systemState: HachimojiState = HachimojiState.SILENCE;

    constructor() {
        // Default system profiles
        this.registerProfile({
            id: 'api-mesh',
            latencyBound: 500,
            errorThreshold: 5,
            typicalFanOut: 3
        });

        this.registerProfile({
            id: 'db-query',
            latencyBound: 200,
            errorThreshold: 1,
            typicalFanOut: 0
        });
    }

    registerProfile(profile: AnomalyProfile) {
        this.profiles.set(profile.id, profile);
    }

    /**
     * Periodically check for anomalies across all registered profiles
     */
    async checkHealth() {
        console.log('[ImmuneSystem] Performing anomaly scan...');
        const now = Date.now();
        let worstState = HachimojiState.VITAL;

        for (const [id, profile] of this.profiles.entries()) {
            try {
                const metric = await getMetric(`immune.pulse.${id}`);
                if (!metric) continue;

                const { avgLatency, errorRate } = metric;

                if (errorRate > profile.errorThreshold * 3) {
                    worstState = HachimojiState.NECROSIS;
                    await this.triggerDefense(id, HachimojiState.NECROSIS, errorRate);
                } else if (errorRate > profile.errorThreshold) {
                    worstState = Math.max(worstState, HachimojiState.ANOMALY);
                    await this.triggerDefense(id, HachimojiState.ANOMALY, errorRate);
                } else if (avgLatency > profile.latencyBound) {
                    worstState = Math.max(worstState, HachimojiState.HIBER);
                    await this.triggerDefense(id, HachimojiState.HIBER, avgLatency);
                }
            } catch (err) {
                console.error(`[ImmuneSystem] Failed check for ${id}:`, err);
            }
        }

        this.systemState = worstState;
        this.lastCheck = now;
    }

    private async triggerDefense(id: string, state: HachimojiState, value: number) {
        console.warn(`[ImmuneSystem] STATE CHANGE: ${id} -> ${HachimojiState[state]} | Value: ${value}`);

        switch (state) {
            case HachimojiState.NECROSIS:
                // Tier 2: Quarantine (Open Circuit Breaker)
                console.warn(`[ImmuneSystem] NECROSIS DETECTED: Quarantining service ${id}`);
                await withCircuitBreaker(id, async () => {
                    throw new Error(`Immune System Quarantine: Necrosis Detected`);
                }, { failureThreshold: 1 });
                break;

            case HachimojiState.ANOMALY:
                // Tier 1: Fever (Throttling)
                console.warn(`[ImmuneSystem] ANOMALY DETECTED: Applying fever to ${id}`);
                await this.applyFever('medium');
                break;

            case HachimojiState.HIBER:
                // Tier 0: Local Apoptosis (Restart signal)
                console.warn(`[ImmuneSystem] HIBER DETECTED: Triggering local apoptosis for ${id}`);
                break;
        }
    }

    /**
     * "Fever" Mode: Apply a global concurrency limit across the system
     */
    async applyFever(level: 'low' | 'medium' | 'high') {
        const limits = { low: 100, medium: 50, high: 10 };
        console.warn(`[ImmuneSystem] FEVER MODE ACTIVE: Level ${level} (Limit: ${limits[level]} parallel)`);
        // This would wire into the gateway middleware to throttle requests
    }
}

export const immuneSystem = new ImmuneSystem();

/**
 * Start the metabolic metabolic immune loop
 */
export function startImmuneLoop(intervalMs: number = 60000) {
    setInterval(() => {
        immuneSystem.checkHealth().catch(err => console.error('[ImmuneSystem] Loop error:', err));
    }, intervalMs);
}
