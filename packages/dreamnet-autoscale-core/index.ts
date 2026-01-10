/**
 * DreamNet Auto-Scale Core
 * Adaptive rate limiting and auto-scaling
 */

import { ScalingEngine } from './logic/scalingEngine.js';
import type { ScalingRule, ScalingMetrics, ScalingDecision } from './types.js';
import { DreamNetMetricsCore } from "@dreamnet/dreamnet-metrics-core";
import { bridgeToSpiderWeb } from "@dreamnet/dreamnet-operational-bridge";

const engine = new ScalingEngine();
const rules: Map<string, ScalingRule> = new Map();
const scalingIntervals = new Map<string, NodeJS.Timeout>();

export const DreamNetAutoScaleCore = {
  /**
   * Register a scaling rule
   */
  registerRule(rule: ScalingRule): void {
    rules.set(rule.id, rule);
    
    if (rule.enabled) {
      this.startScaling(rule.id);
    }
  },

  /**
   * Start automatic scaling for a rule
   */
  startScaling(ruleId: string): void {
    const rule = rules.get(ruleId);
    if (!rule || !rule.enabled) {
      return;
    }

    // Clear existing interval
    const existing = scalingIntervals.get(ruleId);
    if (existing) {
      clearInterval(existing);
    }

    // Run initial evaluation
    this.evaluateScaling(ruleId);

    // Schedule periodic evaluation (every minute)
    const interval = setInterval(() => {
      this.evaluateScaling(ruleId);
    }, 60000);

    scalingIntervals.set(ruleId, interval);
  },

  /**
   * Stop automatic scaling for a rule
   */
  stopScaling(ruleId: string): void {
    const interval = scalingIntervals.get(ruleId);
    if (interval) {
      clearInterval(interval);
      scalingIntervals.delete(ruleId);
    }
  },

  /**
   * Evaluate scaling for a rule
   */
  async evaluateScaling(ruleId: string): Promise<ScalingDecision | null> {
    const rule = rules.get(ruleId);
    if (!rule) {
      return null;
    }

    // Get current metrics
    const clusterMetrics = DreamNetMetricsCore.getClusterMetrics(rule.clusterId);
    
    const metrics: ScalingMetrics = {
      clusterId: rule.clusterId,
      requestsPerSecond: clusterMetrics.requestsPerSecond,
      errorRate: clusterMetrics.errorsPerSecond / Math.max(clusterMetrics.requestsPerSecond, 1),
      averageLatency: clusterMetrics.averageLatency,
      p95Latency: clusterMetrics.p95Latency,
      costPerRequest: 0.001, // Would come from cost core
      currentRateLimit: 100, // Would come from control core
      timestamp: Date.now(),
    };

    const decision = engine.evaluateRule(rule, metrics);
    
    if (decision && decision.action !== "no_change") {
      await engine.applyScaling(decision);
      rule.lastAdjustment = Date.now();
      rules.set(ruleId, rule);

      // Bridge scaling decision to Spider Web
      bridgeToSpiderWeb({
        type: "auto_scaling_decision",
        clusterId: rule.clusterId,
        severity: decision.action === "scale_up" ? "low" : "medium",
        message: `Auto-scaling ${decision.action}: ${decision.currentLimit} → ${decision.newLimit}`,
        metadata: {
          ruleId: rule.id,
          reason: decision.reason,
          currentLimit: decision.currentLimit,
          newLimit: decision.newLimit,
        },
        timestamp: Date.now(),
      });

      // Bridge scaling applied to Spider Web
      bridgeToSpiderWeb({
        type: "auto_scaling_applied",
        clusterId: rule.clusterId,
        severity: "low",
        message: `Scaling applied: ${decision.newLimit} requests/min`,
        metadata: {
          ruleId: rule.id,
          newLimit: decision.newLimit,
        },
        timestamp: Date.now(),
      });
    }

    return decision;
  },

  /**
   * Get all scaling rules
   */
  getAllRules(): ScalingRule[] {
    return Array.from(rules.values());
  },

  /**
   * Get rule by ID
   */
  getRule(ruleId: string): ScalingRule | undefined {
    return rules.get(ruleId);
  },
};

export * from './types.js';
export default DreamNetAutoScaleCore;

