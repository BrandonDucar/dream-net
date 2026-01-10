/**
 * Heartbeat Alert System
 * Detects degradation, failures, and trends before they become critical
 */
import type { DreamNetOSSnapshot } from '../types.js';
export interface HeartbeatAlert {
    id: string;
    type: "degradation" | "failure" | "recovery" | "trend";
    severity: "info" | "warning" | "critical";
    subsystem?: string;
    message: string;
    timestamp: number;
    details?: Record<string, any>;
    resolved?: boolean;
    resolvedAt?: number;
}
export interface HealthTrend {
    subsystem: string;
    trend: "improving" | "stable" | "degrading" | "critical";
    changeRate: number;
    predictedFailure?: number;
}
/**
 * Analyze heartbeat snapshot for alerts
 */
export declare function analyzeHeartbeat(currentSnapshot: DreamNetOSSnapshot, previousSnapshot?: DreamNetOSSnapshot): HeartbeatAlert[];
/**
 * Detect health trends
 */
export declare function detectTrends(): HealthTrend[];
/**
 * Get active alerts
 */
export declare function getActiveAlerts(): HeartbeatAlert[];
/**
 * Get recent alerts
 */
export declare function getRecentAlerts(limit?: number): HeartbeatAlert[];
/**
 * Resolve alert
 */
export declare function resolveAlert(alertId: string): boolean;
/**
 * Get health history
 */
export declare function getHealthHistory(limit?: number): Array<{
    timestamp: number;
    snapshot: DreamNetOSSnapshot;
}>;
/**
 * Get health statistics
 */
export declare function getHealthStats(): {
    uptime: number;
    averageHealth: {
        infra: number;
        economy: number;
        social: number;
        pipeline: number;
    };
    totalAlerts: number;
    criticalAlerts: number;
    resolvedAlerts: number;
};
//# sourceMappingURL=heartbeatAlerts.d.ts.map