/**
 * Heartbeat Alert System
 * Detects degradation, failures, and trends before they become critical
 */

import type { DreamNetOSSnapshot, SubsystemSummary } from "../types";

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
  changeRate: number; // Percentage change per hour
  predictedFailure?: number; // Timestamp when failure predicted
}

let alertHistory: HeartbeatAlert[] = [];
let healthHistory: Array<{ timestamp: number; snapshot: DreamNetOSSnapshot }> = [];
const MAX_HISTORY = 1000; // Keep last 1000 heartbeats

/**
 * Analyze heartbeat snapshot for alerts
 */
export function analyzeHeartbeat(
  currentSnapshot: DreamNetOSSnapshot,
  previousSnapshot?: DreamNetOSSnapshot
): HeartbeatAlert[] {
  const alerts: HeartbeatAlert[] = [];
  const now = Date.now();

  // Store in history
  healthHistory.push({ timestamp: now, snapshot: currentSnapshot });
  if (healthHistory.length > MAX_HISTORY) {
    healthHistory.shift();
  }

  // Check for subsystem failures
  for (const subsystem of currentSnapshot.subsystems) {
    if (subsystem.status === "error") {
      alerts.push({
        id: `alert:${subsystem.name}:${now}`,
        type: "failure",
        severity: "critical",
        subsystem: subsystem.name,
        message: `${subsystem.name} has failed`,
        timestamp: now,
        details: { status: subsystem.status, details: subsystem.details },
      });
    } else if (subsystem.status === "warn") {
      alerts.push({
        id: `alert:${subsystem.name}:${now}`,
        type: "degradation",
        severity: "warning",
        subsystem: subsystem.name,
        message: `${subsystem.name} is degraded`,
        timestamp: now,
        details: { status: subsystem.status, details: subsystem.details },
      });
    }
  }

  // Check for health score degradation
  if (previousSnapshot) {
    const healthChanges = {
      infra: currentSnapshot.globalHealth.infraHealth - previousSnapshot.globalHealth.infraHealth,
      economy: currentSnapshot.globalHealth.economyHealth - previousSnapshot.globalHealth.economyHealth,
      social: currentSnapshot.globalHealth.socialHealth - previousSnapshot.globalHealth.socialHealth,
      pipeline: currentSnapshot.globalHealth.dreamPipelineHealth - previousSnapshot.globalHealth.dreamPipelineHealth,
    };

    // Critical degradation (>20% drop)
    if (healthChanges.infra < -0.2) {
      alerts.push({
        id: `alert:infra:critical:${now}`,
        type: "degradation",
        severity: "critical",
        message: `Infrastructure health dropped ${(healthChanges.infra * 100).toFixed(1)}%`,
        timestamp: now,
        details: { previous: previousSnapshot.globalHealth.infraHealth, current: currentSnapshot.globalHealth.infraHealth },
      });
    }

    if (healthChanges.economy < -0.2) {
      alerts.push({
        id: `alert:economy:critical:${now}`,
        type: "degradation",
        severity: "critical",
        message: `Economy health dropped ${(healthChanges.economy * 100).toFixed(1)}%`,
        timestamp: now,
        details: { previous: previousSnapshot.globalHealth.economyHealth, current: currentSnapshot.globalHealth.economyHealth },
      });
    }

    // Recovery detection
    const recoveredSubsystems = previousSnapshot.subsystems.filter((prev) => {
      const current = currentSnapshot.subsystems.find((s) => s.name === prev.name);
      return prev.status === "error" && current?.status === "ok";
    });

    for (const recovered of recoveredSubsystems) {
      alerts.push({
        id: `alert:recovery:${recovered.name}:${now}`,
        type: "recovery",
        severity: "info",
        subsystem: recovered.name,
        message: `${recovered.name} has recovered`,
        timestamp: now,
        resolved: true,
        resolvedAt: now,
      });
    }
  }

  // Check for low health scores
  if (currentSnapshot.globalHealth.infraHealth < 0.5) {
    alerts.push({
      id: `alert:infra:low:${now}`,
      type: "degradation",
      severity: "warning",
      message: `Infrastructure health is critically low (${(currentSnapshot.globalHealth.infraHealth * 100).toFixed(0)}%)`,
      timestamp: now,
    });
  }

  // Store alerts
  alertHistory.push(...alerts);
  if (alertHistory.length > MAX_HISTORY) {
    alertHistory = alertHistory.slice(-MAX_HISTORY);
  }

  return alerts;
}

/**
 * Detect health trends
 */
export function detectTrends(): HealthTrend[] {
  const trends: HealthTrend[] = [];
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  // Get recent history (last hour)
  const recentHistory = healthHistory.filter((h) => h.timestamp >= oneHourAgo);

  if (recentHistory.length < 2) return trends;

  // Track subsystem trends
  const subsystemNames = new Set<string>();
  recentHistory.forEach((h) => {
    h.snapshot.subsystems.forEach((s) => subsystemNames.add(s.name));
  });

  for (const subsystemName of subsystemNames) {
    const subsystemHistory = recentHistory.map((h) => {
      const sub = h.snapshot.subsystems.find((s) => s.name === subsystemName);
      return {
        timestamp: h.timestamp,
        status: sub?.status || "unknown",
        isOk: sub?.status === "ok" ? 1 : 0,
      };
    });

    // Calculate trend
    const firstOk = subsystemHistory[0].isOk;
    const lastOk = subsystemHistory[subsystemHistory.length - 1].isOk;
    const changeRate = ((lastOk - firstOk) / subsystemHistory.length) * 100;

    let trend: HealthTrend["trend"] = "stable";
    if (changeRate < -10) trend = "degrading";
    else if (changeRate < -30) trend = "critical";
    else if (changeRate > 10) trend = "improving";

    // Predict failure if degrading rapidly
    let predictedFailure: number | undefined;
    if (trend === "critical" && changeRate < -20) {
      // Linear extrapolation: predict when health will hit 0
      const hoursUntilFailure = Math.abs(100 / changeRate);
      predictedFailure = now + hoursUntilFailure * 60 * 60 * 1000;
    }

    trends.push({
      subsystem: subsystemName,
      trend,
      changeRate,
      predictedFailure,
    });
  }

  return trends;
}

/**
 * Get active alerts
 */
export function getActiveAlerts(): HeartbeatAlert[] {
  return alertHistory.filter((a) => !a.resolved);
}

/**
 * Get recent alerts
 */
export function getRecentAlerts(limit = 50): HeartbeatAlert[] {
  return alertHistory.slice(-limit).reverse();
}

/**
 * Resolve alert
 */
export function resolveAlert(alertId: string): boolean {
  const alert = alertHistory.find((a) => a.id === alertId);
  if (alert) {
    alert.resolved = true;
    alert.resolvedAt = Date.now();
    return true;
  }
  return false;
}

/**
 * Get health history
 */
export function getHealthHistory(limit = 100): Array<{ timestamp: number; snapshot: DreamNetOSSnapshot }> {
  return healthHistory.slice(-limit);
}

/**
 * Get health statistics
 */
export function getHealthStats() {
  if (healthHistory.length === 0) {
    return {
      uptime: 0,
      averageHealth: { infra: 0, economy: 0, social: 0, pipeline: 0 },
      totalAlerts: 0,
      criticalAlerts: 0,
      resolvedAlerts: 0,
    };
  }

  const firstHeartbeat = healthHistory[0].timestamp;
  const uptime = Date.now() - firstHeartbeat;

  const avgHealth = healthHistory.reduce(
    (acc, h) => {
      acc.infra += h.snapshot.globalHealth.infraHealth;
      acc.economy += h.snapshot.globalHealth.economyHealth;
      acc.social += h.snapshot.globalHealth.socialHealth;
      acc.pipeline += h.snapshot.globalHealth.dreamPipelineHealth;
      return acc;
    },
    { infra: 0, economy: 0, social: 0, pipeline: 0 }
  );

  const count = healthHistory.length;
  return {
    uptime,
    averageHealth: {
      infra: avgHealth.infra / count,
      economy: avgHealth.economy / count,
      social: avgHealth.social / count,
      pipeline: avgHealth.pipeline / count,
    },
    totalAlerts: alertHistory.length,
    criticalAlerts: alertHistory.filter((a) => a.severity === "critical" && !a.resolved).length,
    resolvedAlerts: alertHistory.filter((a) => a.resolved).length,
  };
}

