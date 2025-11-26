/**
 * Health → Shield Bridge Integration
 * Wires health check failures to Shield Core threat detection
 */

import { bridgeHealthFailureToShield } from "@dreamnet/dreamnet-shield-health-bridge";
import type { HealthResult } from "../types";

/**
 * Bridge health check result to Shield Core if it indicates failure
 */
export function bridgeHealthResultToShield(result: HealthResult): void {
  // Only bridge failures (down or degraded)
  if (result.status === "down" || result.status === "degraded") {
    bridgeHealthFailureToShield({
      clusterId: result.clusterId,
      status: result.status,
      latency: result.latency,
      error: result.checks.find(c => c.error)?.error,
      timestamp: result.timestamp,
      consecutiveFailures: 0, // Would be tracked by health store
    });
  }
}

