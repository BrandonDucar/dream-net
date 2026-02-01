/**
 * Shield ↔ Health Bridge Types
 * Biomimetic: Defense organ (Shield) + Health organ working together
 */

export interface HealthFailureEvent {
  clusterId: string;
  status: "degraded" | "down";
  latency?: number;
  error?: string;
  timestamp: number;
}

export interface ShieldThreatEvent {
  threatId: string;
  threatType: string;
  severity: "low" | "medium" | "high" | "critical";
  clusterId?: string;
  timestamp: number;
}

export interface RecoveryAction {
  action: "restart" | "throttle" | "isolate" | "notify" | "learn";
  clusterId: string;
  reason: string;
  timestamp: number;
}

