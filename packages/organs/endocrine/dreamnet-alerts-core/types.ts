/**
 * DreamNet Alerts Core Types
 * Alerting system for Slack, Discord, Email, and webhooks
 */

export type AlertSeverity = "info" | "warning" | "error" | "critical";

export type AlertChannel = "slack" | "discord" | "email" | "webhook" | "console";

export interface AlertRule {
  id: string;
  name: string;
  condition: string; // e.g., "rate_limit_exceeded", "kill_switch_enabled", "circuit_breaker_tripped"
  severity: AlertSeverity;
  channels: AlertChannel[];
  enabled: boolean;
  cooldownMs?: number; // Prevent spam
  lastTriggeredAt?: number;
}

export interface Alert {
  id: string;
  ruleId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  clusterId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  channels: AlertChannel[];
  sent: boolean;
  sentAt?: number;
}

export interface AlertConfig {
  slack?: {
    webhookUrl: string;
    enabled: boolean;
  };
  discord?: {
    webhookUrl: string;
    enabled: boolean;
  };
  email?: {
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
    enabled: boolean;
  };
  webhooks?: Array<{
    url: string;
    secret?: string;
    enabled: boolean;
  }>;
}

export interface AlertContext {
  clusterId?: string;
  traceId?: string;
  idempotencyKey?: string;
  metadata?: Record<string, any>;
}

