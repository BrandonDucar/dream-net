/**
 * Auto-Record Operational Events in Dream Snail
 * Biomimetic: All events leave a trail
 */

import { DreamSnailCore } from '../index.js';
import type { OperationalEvent } from "@dreamnet/shared";

/**
 * Auto-record operational events in Dream Snail
 */
export function autoRecordOperationalEvent(
  event: OperationalEvent,
  identityId: string
): void {
  // Record event in Dream Snail trail
  DreamSnailCore.recordTrail(
    identityId,
    `operational:${event.type}`,
    {
      clusterId: event.clusterId,
      severity: event.severity,
      message: event.message,
      metadata: event.metadata,
    },
    {
      source: "operational-bridge",
      system: "dreamnet",
      clusterId: event.clusterId,
      privacyLevel: event.severity === "critical" ? "private" : "public",
    }
  );
}

/**
 * Auto-record audit events in Dream Snail
 */
export function autoRecordAuditEvent(
  action: string,
  identityId: string,
  metadata?: Record<string, any>
): void {
  DreamSnailCore.recordTrail(
    identityId,
    `audit:${action}`,
    metadata || {},
    {
      source: "audit-core",
      system: "dreamnet",
      privacyLevel: "private", // Audit events are private by default
    }
  );
}

/**
 * Auto-record passport actions in Dream Snail
 */
export function autoRecordPassportAction(
  action: "issued" | "upgraded" | "revoked",
  identityId: string,
  tier?: string
): void {
  DreamSnailCore.recordTrail(
    identityId,
    `passport:${action}`,
    { tier },
    {
      source: "dream-state",
      system: "dreamnet",
      privacyLevel: "public", // Passport actions are public
    }
  );
}

