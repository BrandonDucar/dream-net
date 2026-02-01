/**
 * DreamNet Alerts Core
 * Unified alerting system for Slack, Discord, Email, and webhooks
 */

import { AlertSender } from './logic/alertSender.js';
import type { Alert, AlertRule, AlertConfig, AlertSeverity, AlertContext } from './types.js';

class AlertsCore {
  private sender: AlertSender;
  private rules: Map<string, AlertRule> = new Map();
  private alerts: Alert[] = [];

  constructor(config: AlertConfig) {
    this.sender = new AlertSender(config);
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    const defaultRules: AlertRule[] = [
      {
        id: "rule:kill-switch-enabled",
        name: "Global Kill-Switch Enabled",
        condition: "kill_switch_enabled",
        severity: "critical",
        channels: ["console", "slack", "discord"],
        enabled: true,
        cooldownMs: 5 * 60 * 1000, // 5 minutes
      },
      {
        id: "rule:rate-limit-exceeded",
        name: "Rate Limit Exceeded",
        condition: "rate_limit_exceeded",
        severity: "warning",
        channels: ["console", "slack"],
        enabled: true,
        cooldownMs: 60 * 1000, // 1 minute
      },
      {
        id: "rule:circuit-breaker-tripped",
        name: "Circuit Breaker Tripped",
        condition: "circuit_breaker_tripped",
        severity: "error",
        channels: ["console", "slack", "discord"],
        enabled: true,
        cooldownMs: 10 * 60 * 1000, // 10 minutes
      },
      {
        id: "rule:billable-action-failed",
        name: "Billable Action Failed",
        condition: "billable_action_failed",
        severity: "error",
        channels: ["console", "email"],
        enabled: true,
        cooldownMs: 5 * 60 * 1000, // 5 minutes
      },
    ];

    for (const rule of defaultRules) {
      this.rules.set(rule.id, rule);
    }
  }

  async triggerAlert(
    ruleId: string,
    title: string,
    message: string,
    context?: AlertContext
  ): Promise<Alert | null> {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) {
      return null;
    }

    // Check cooldown
    if (rule.cooldownMs && rule.lastTriggeredAt) {
      const timeSinceLastTrigger = Date.now() - rule.lastTriggeredAt;
      if (timeSinceLastTrigger < rule.cooldownMs) {
        return null; // Still in cooldown
      }
    }

    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      ruleId,
      severity: rule.severity,
      title,
      message,
      clusterId: context?.clusterId,
      metadata: context?.metadata,
      timestamp: Date.now(),
      channels: rule.channels,
      sent: false,
    };

    // Send alert
    const results = await this.sender.sendAlert(alert);
    alert.sent = results.some((r) => r.success);
    alert.sentAt = Date.now();

    // Update rule
    rule.lastTriggeredAt = Date.now();
    this.rules.set(ruleId, rule);

    // Store alert
    this.alerts.push(alert);
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000); // Keep last 1000
    }

    return alert;
  }

  registerRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  getRule(ruleId: string): AlertRule | undefined {
    return this.rules.get(ruleId);
  }

  listRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  getRecentAlerts(limit: number = 50): Alert[] {
    return this.alerts.slice(-limit).reverse();
  }

  getAlertsBySeverity(severity: AlertSeverity): Alert[] {
    return this.alerts.filter((a) => a.severity === severity);
  }
}

// Export singleton instance (will be initialized with config)
export function createAlertsCore(config: AlertConfig): AlertsCore {
  return new AlertsCore(config);
}

export * from './types.js';
export default AlertsCore;

