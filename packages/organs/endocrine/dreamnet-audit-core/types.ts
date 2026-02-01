/**
 * DreamNet Audit Core Types
 * Complete audit trail system
 */

export type AuditAction =
  | "kill_switch_enabled"
  | "kill_switch_disabled"
  | "rate_limit_changed"
  | "rate_limit_added"
  | "rate_limit_removed"
  | "circuit_breaker_tripped"
  | "circuit_breaker_reset"
  | "cluster_enabled"
  | "cluster_disabled"
  | "billable_action_charged"
  | "billable_action_failed"
  | "health_check_failed"
  | "alert_sent"
  | "config_changed"
  | "user_action";

export interface AuditLog {
  id: string;
  timestamp: number;
  userId?: string;
  walletAddress?: string;
  action: AuditAction;
  clusterId?: string;
  resourceId?: string;
  resourceType?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  traceId?: string;
  success: boolean;
  error?: string;
}

export interface AuditQuery {
  userId?: string;
  walletAddress?: string;
  action?: AuditAction;
  clusterId?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
  offset?: number;
}

export interface AuditStats {
  totalLogs: number;
  actionsByType: Record<AuditAction, number>;
  actionsByCluster: Record<string, number>;
  actionsByUser: Record<string, number>;
  recentActivity: AuditLog[];
}

