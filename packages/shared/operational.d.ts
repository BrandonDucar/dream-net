/**
 * Operational Bridge Types
 * Biomimetic: Standard events for the DreamNet nervous system
 */
export type OperationalEventType = "health_check_failed" | "health_check_recovered" | "incident_created" | "incident_resolved" | "audit_event" | "rate_limit_exceeded" | "rate_limit_reset" | "circuit_breaker_tripped" | "circuit_breaker_reset" | "cost_threshold_exceeded" | "cost_budget_alert" | "auto_scaling_decision" | "auto_scaling_applied" | "scheduled_task_executed" | "scheduled_task_failed" | "kill_switch_enabled" | "kill_switch_disabled" | "cluster_enabled" | "cluster_disabled" | "agent_minted";
export interface OperationalEvent {
    type: OperationalEventType;
    clusterId?: string;
    severity: "low" | "medium" | "high" | "critical";
    message: string;
    metadata?: Record<string, any>;
    timestamp: number;
}
