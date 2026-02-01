/**
 * DreamNet Health Core Types
 * Health check system for all clusters
 */

export type HealthStatus = "healthy" | "degraded" | "down" | "unknown";

export interface HealthCheck {
  id: string;
  clusterId: string;
  name: string;
  endpoint?: string;
  type: "http" | "tcp" | "custom";
  intervalMs: number;
  timeoutMs: number;
  enabled: boolean;
  lastCheck?: number;
  lastStatus?: HealthStatus;
  lastError?: string;
  consecutiveFailures: number;
  failureThreshold: number;
}

export interface HealthResult {
  clusterId: string;
  status: HealthStatus;
  timestamp: number;
  latency?: number;
  checks: Array<{
    name: string;
    status: HealthStatus;
    latency?: number;
    error?: string;
  }>;
  dependencies?: Array<{
    name: string;
    status: HealthStatus;
    latency?: number;
  }>;
}

export interface ClusterHealth {
  clusterId: string;
  status: HealthStatus;
  lastCheck: number;
  uptime: number;
  checks: HealthCheck[];
  recentResults: HealthResult[];
}

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
