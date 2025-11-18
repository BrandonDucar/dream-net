/**
 * Dream Snail ↔ Spider Web Bridge
 * Biomimetic: Privacy layer (Snail) → Nervous system (Spider Web)
 */

import { bridgeToSpiderWeb } from "@dreamnet/dreamnet-operational-bridge";
import type { SnailTrail, SnailInsight } from "../types";

/**
 * Bridge Snail trail events to Spider Web threads
 */
export function bridgeSnailTrailToSpiderWeb(trail: SnailTrail): void {
  // Convert privacy alerts to Spider Web threads
  if (trail.metadata.privacyLevel === "encrypted" || trail.metadata.privacyLevel === "zero-knowledge") {
    bridgeToSpiderWeb({
      type: "audit_event", // Privacy events are audit events
      clusterId: trail.metadata.clusterId,
      severity: trail.metadata.privacyLevel === "zero-knowledge" ? "low" : "medium",
      message: `Privacy trail recorded: ${trail.eventType} (${trail.metadata.privacyLevel})`,
      metadata: {
        trailId: trail.id,
        identityId: trail.identityId,
        eventType: trail.eventType,
        privacyLevel: trail.metadata.privacyLevel,
      },
      timestamp: new Date(trail.timestamp).getTime(),
    });
  }
}

/**
 * Bridge Snail insights to Spider Web threads
 */
export function bridgeSnailInsightToSpiderWeb(insight: SnailInsight): void {
  if (insight.severity === "high" || insight.severity === "critical") {
    bridgeToSpiderWeb({
      type: "audit_event",
      severity: insight.severity,
      message: `Privacy insight: ${insight.title}`,
      metadata: {
        insightId: insight.id,
        identityId: insight.identityId,
        insightType: insight.insightType,
        relatedTrails: insight.relatedTrails,
      },
      timestamp: new Date(insight.timestamp).getTime(),
    });
  }
}

