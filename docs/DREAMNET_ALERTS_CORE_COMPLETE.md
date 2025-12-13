# DreamNet Alerts Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-alerts-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Alerts Core provides **unified alerting system** for Slack, Discord, Email, and webhooks. It enables rule-based alerting with cooldowns, severity levels, and multi-channel delivery.

### Key Features

- **Multi-Channel Alerts**: Slack, Discord, Email, Webhook support
- **Rule-Based**: Define alert rules with conditions
- **Cooldown Management**: Prevent alert spam with cooldowns
- **Severity Levels**: Info, warning, error, critical
- **Default Rules**: Pre-configured rules for common scenarios
- **Alert History**: Track recent alerts and filter by severity

---

## API Reference

### Types

```typescript
export type AlertSeverity = "info" | "warning" | "error" | "critical";
export type AlertChannel = "console" | "slack" | "discord" | "email" | "webhook";

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: AlertSeverity;
  channels: AlertChannel[];
  enabled: boolean;
  cooldownMs?: number;
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
```

### Classes

#### `AlertsCore`

**Methods**:
- **`triggerAlert(ruleId, title, message, context?): Promise<Alert | null>`**
- **`registerRule(rule): void`**
- **`getRule(ruleId): AlertRule | undefined`**
- **`listRules(): AlertRule[]`**
- **`getRecentAlerts(limit?): Alert[]`**
- **`getAlertsBySeverity(severity): Alert[]`**

### Functions

- **`createAlertsCore(config): AlertsCore`**

---

**Status**: ✅ Implemented

