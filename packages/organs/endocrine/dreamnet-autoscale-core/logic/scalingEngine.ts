/**
 * Scaling Engine
 * Makes intelligent scaling decisions
 */

import type { ScalingRule, ScalingMetrics, ScalingDecision } from '../types.js';
import { DreamNetMetricsCore } from "@dreamnet/dreamnet-metrics-core";
import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";

export class ScalingEngine {
  evaluateRule(rule: ScalingRule, metrics: ScalingMetrics): ScalingDecision | null {
    if (!rule.enabled) {
      return null;
    }

    // Check cooldown
    if (rule.lastAdjustment) {
      const timeSinceLastAdjustment = Date.now() - rule.lastAdjustment;
      if (timeSinceLastAdjustment < rule.cooldownMs) {
        return null; // Still in cooldown
      }
    }

    const currentLimit = metrics.currentRateLimit;
    let action: "scale_up" | "scale_down" | "no_change" = "no_change";
    let reason = "";
    let newLimit = currentLimit;

    // Check scale-up conditions
    if (
      (rule.scaleUpThreshold.requestsPerSecond &&
        metrics.requestsPerSecond >= rule.scaleUpThreshold.requestsPerSecond) ||
      (rule.scaleUpThreshold.errorRate &&
        metrics.errorRate <= rule.scaleUpThreshold.errorRate) ||
      (rule.scaleUpThreshold.latency &&
        metrics.averageLatency <= rule.scaleUpThreshold.latency)
    ) {
      if (currentLimit < rule.maxRateLimit) {
        action = "scale_up";
        newLimit = Math.min(
          currentLimit + rule.adjustmentStep,
          rule.maxRateLimit
        );
        reason = "Metrics indicate need for higher capacity";
      }
    }

    // Check scale-down conditions
    if (
      (rule.scaleDownThreshold.requestsPerSecond &&
        metrics.requestsPerSecond <= rule.scaleDownThreshold.requestsPerSecond) ||
      (rule.scaleDownThreshold.errorRate &&
        metrics.errorRate >= rule.scaleDownThreshold.errorRate) ||
      (rule.scaleDownThreshold.latency &&
        metrics.averageLatency >= rule.scaleDownThreshold.latency)
    ) {
      if (currentLimit > rule.minRateLimit) {
        action = "scale_down";
        newLimit = Math.max(
          currentLimit - rule.adjustmentStep,
          rule.minRateLimit
        );
        reason = "Metrics indicate capacity can be reduced";
      }
    }

    // Check cost threshold
    if (rule.costThreshold) {
      const hourlyCost = metrics.costPerRequest * metrics.requestsPerSecond * 3600;
      if (hourlyCost > rule.costThreshold && currentLimit > rule.minRateLimit) {
        action = "scale_down";
        newLimit = Math.max(
          currentLimit - rule.adjustmentStep,
          rule.minRateLimit
        );
        reason = `Cost threshold exceeded (${hourlyCost.toFixed(2)}/hour)`;
      }
    }

    if (action === "no_change") {
      return null;
    }

    return {
      clusterId: rule.clusterId,
      action,
      currentLimit,
      newLimit,
      reason,
      metrics,
    };
  }

  async applyScaling(decision: ScalingDecision): Promise<void> {
    // Update rate limit in control core
    const rateLimit = DreamNetControlCore.getRateLimit(decision.clusterId as any);
    if (rateLimit) {
      DreamNetControlCore.setRateLimit({
        ...rateLimit,
        requestsPerMinute: decision.newLimit,
      });
    }
  }
}

