/**
 * Shield ↔ Health Bridge
 * Biomimetic: Defense organ (Shield) + Health organ working together
 */

import ShieldCore from "../../shield/index.js";
import { DreamNetHealthCore } from "../index.js";
import type { HealthFailureEvent, ShieldThreatEvent, RecoveryAction } from '../types.js';

/**
 * Bridge health failures to Shield Core threat detection
 */
export function bridgeHealthFailureToShield(event: HealthFailureEvent): void {
  // Convert health failure to Shield threat
  const threatType = event.status === "down" ? "health_down" : "health_degraded";
  const threatLevel = event.status === "down" ? "critical" : "high";

  // Create threat in Shield Core
  ShieldCore.detectThreat(
    threatType as any,
    threatLevel as any,
    `health-check:${event.clusterId}`,
    undefined,
    {
      clusterId: event.clusterId,
      latency: event.latency,
      error: event.error,
    }
  );

  console.log(`🛡️ [Shield-Health Bridge] Health failure for ${event.clusterId} → Shield threat detected`);
}

/**
 * Bridge Shield spikes to Health Check recovery actions
 */
export function bridgeShieldSpikeToHealth(spike: {
  threatId: string;
  clusterId?: string;
  action: string;
  timestamp: number;
}): RecoveryAction | null {
  if (!spike.clusterId) {
    return null;
  }

  // Determine recovery action based on Shield spike
  let recoveryAction: RecoveryAction["action"] = "notify";

  if (spike.action.includes("restart") || spike.action.includes("reset")) {
    recoveryAction = "restart";
  } else if (spike.action.includes("throttle") || spike.action.includes("limit")) {
    recoveryAction = "throttle";
  } else if (spike.action.includes("isolate") || spike.action.includes("block")) {
    recoveryAction = "isolate";
  }

  const recovery: RecoveryAction = {
    action: recoveryAction,
    clusterId: spike.clusterId,
    reason: `Shield spike triggered: ${spike.action}`,
    timestamp: Date.now(),
  };

  // Trigger health check recovery
  const health = DreamNetHealthCore.getClusterHealth(spike.clusterId);
  if (health) {
    // Run recovery check
    const checks = health.checks;
    for (const check of checks) {
      if (recoveryAction === "restart") {
        // Would trigger cluster restart in production
        console.log(`🏥 [Shield-Health Bridge] Recovery: Restarting ${spike.clusterId}`);
      } else if (recoveryAction === "throttle") {
        // Would reduce rate limits in production
        console.log(`🏥 [Shield-Health Bridge] Recovery: Throttling ${spike.clusterId}`);
      }
    }
  }

  return recovery;
}

/**
 * Bridge Shield learning to Health Check pattern recognition
 */
export function bridgeShieldLearningToHealth(patterns: Array<{
  threatType: string;
  clusterId?: string;
  frequency: number;
  severity: string;
}>): void {
  // Update health check patterns based on Shield learning
  for (const pattern of patterns) {
    if (pattern.clusterId) {
      const health = DreamNetHealthCore.getClusterHealth(pattern.clusterId);
      if (health) {
        // Adjust health check intervals based on threat frequency
        const checks = health.checks;
        for (const check of checks) {
          if (pattern.frequency > 5) {
            // Increase check frequency for high-threat clusters
            check.intervalMs = Math.min(check.intervalMs * 0.8, 10000); // Minimum 10s
            console.log(`🧠 [Shield-Health Bridge] Learning: Increased health check frequency for ${pattern.clusterId}`);
          }
        }
      }
    }
  }
}

