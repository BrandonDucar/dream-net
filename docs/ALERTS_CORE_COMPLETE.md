# DreamNet Alerts Core - Complete Documentation

**Package**: `@dreamnet/dreamnet-alerts-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

DreamNet Alerts Core provides a **unified alerting system** for DreamNet operations. It supports multiple channels (Slack, Discord, Email, Webhooks, Console) and includes cooldown protection to prevent alert spam.

### Key Features

- **Multi-Channel Support**: Slack, Discord, Email, Webhooks, Console
- **Rule-Based**: Define alert rules with conditions and severity
- **Cooldown Protection**: Prevents alert spam with configurable cooldowns
- **Default Rules**: Pre-configured rules for common events (kill-switch, rate limits, circuit breakers)
- **Alert History**: Stores recent alerts for review

---

## Architecture

### How It Works

```
Alert Trigger → Rule Matching → Cooldown Check → Multi-Channel Send → Alert Storage
```

1. **Alert Trigger**: System calls `triggerAlert()` with rule ID and message
2. **Rule Matching**: System finds matching rule and checks if enabled
3. **Cooldown Check**: Verifies cooldown period has passed since last trigger
4. **Multi-Channel Send**: Sends alert to all configured channels (Slack, Discord, Email, Webhooks)
5. **Alert Storage**: Stores alert in history (last 1000 alerts)

### Why This Design

- **Unified Interface**: Single API for all alerting needs
- **Channel Abstraction**: Supports multiple channels without code changes
- **Spam Prevention**: Cooldown prevents alert flooding
- **Configurable**: Rules can be customized per use case
- **Observable**: Alert history enables debugging and review

---

## API Reference

### Types

```typescript
export type AlertSeverity = "info" | "warning" | "error" | "critical";

export type AlertChannel = "slack" | "discord" | "email" | "webhook" | "console";

export interface AlertRule {
  id: string;
  name: string;
  condition: string; // e.g., "kill_switch_enabled", "rate_limit_exceeded"
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
```

### Default Rules

- **kill-switch-enabled**: Critical alert when global kill-switch is enabled
- **rate-limit-exceeded**: Warning when rate limits are exceeded
- **circuit-breaker-tripped**: Error alert when circuit breaker trips
- **billable-action-failed**: Error alert when billable actions fail

### Functions

#### `createAlertsCore(config: AlertConfig): AlertsCore`

Create an alerts core instance with configuration.

**Example**:
```typescript
import { createAlertsCore } from "@dreamnet/dreamnet-alerts-core";

const alertsCore = createAlertsCore({
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL!,
    enabled: true,
  },
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL!,
    enabled: true,
  },
  email: {
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    },
    from: "alerts@dreamnet.ink",
    enabled: true,
  },
});
```

#### `triggerAlert(ruleId: string, title: string, message: string, context?: AlertContext): Promise<Alert | null>`

Trigger an alert.

**Example**:
```typescript
const alert = await alertsCore.triggerAlert(
  "rule:kill-switch-enabled",
  "Global Kill-Switch Enabled",
  "The global kill-switch has been enabled by user admin-123",
  {
    clusterId: "api",
    metadata: { userId: "admin-123" },
  }
);
```

#### `registerRule(rule: AlertRule): void`

Register a custom alert rule.

**Example**:
```typescript
alertsCore.registerRule({
  id: "custom-error",
  name: "Custom Error Alert",
  condition: "custom_error",
  severity: "error",
  channels: ["slack", "email"],
  enabled: true,
  cooldownMs: 60000, // 1 minute
});
```

#### `getRule(ruleId: string): AlertRule | undefined`

Get an alert rule.

#### `listRules(): AlertRule[]`

List all alert rules.

#### `getRecentAlerts(limit?: number): Alert[]`

Get recent alerts (default: 50).

#### `getAlertsBySeverity(severity: AlertSeverity): Alert[]`

Get alerts by severity.

---

## Integration Points

### Consumes

- **Alert Config**: Channel configuration (Slack, Discord, Email, Webhooks)

### Produces

- **Alerts**: Sent to configured channels

### Integration Pattern

```typescript
// Trigger alert from other systems
import { createAlertsCore } from "@dreamnet/dreamnet-alerts-core";

const alertsCore = createAlertsCore(config);

// When kill-switch enabled
await alertsCore.triggerAlert(
  "rule:kill-switch-enabled",
  "Kill-Switch Enabled",
  "Global kill-switch enabled",
  { clusterId: "api" }
);
```

---

## Usage Examples

### Basic Setup

```typescript
import { createAlertsCore } from "@dreamnet/dreamnet-alerts-core";

const alertsCore = createAlertsCore({
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL!,
    enabled: true,
  },
  console: {
    enabled: true, // Always enabled
  },
});
```

### Trigger Alert

```typescript
// Trigger default rule
await alertsCore.triggerAlert(
  "rule:rate-limit-exceeded",
  "Rate Limit Exceeded",
  "API cluster exceeded rate limit: 10000 req/min",
  {
    clusterId: "api",
    metadata: { currentLimit: 10000 },
  }
);
```

### Custom Rule

```typescript
// Register custom rule
alertsCore.registerRule({
  id: "high-error-rate",
  name: "High Error Rate",
  condition: "high_error_rate",
  severity: "error",
  channels: ["slack", "email"],
  enabled: true,
  cooldownMs: 300000, // 5 minutes
});

// Trigger custom rule
await alertsCore.triggerAlert(
  "high-error-rate",
  "High Error Rate Detected",
  "Error rate exceeded 5%: 5.2%",
  {
    clusterId: "api",
    metadata: { errorRate: 0.052 },
  }
);
```

---

## Best Practices

1. **Cooldown Periods**: Set appropriate cooldowns to prevent spam (1-10 minutes)
2. **Severity Levels**: Use appropriate severity (info, warning, error, critical)
3. **Channel Selection**: Use multiple channels for critical alerts
4. **Alert History**: Review `getRecentAlerts()` regularly
5. **Testing**: Test alerts with `console` channel first

---

## Security Considerations

- **Webhook Secrets**: Use secrets for webhook authentication
- **Email Credentials**: Store SMTP credentials securely
- **Alert Content**: Don't include sensitive data in alerts
- **Rate Limiting**: Cooldowns prevent alert flooding attacks

---

## Related Systems

- **DreamNet Control Core**: Triggers alerts for kill-switch, rate limits
- **DreamNet Audit Core**: Alerts logged to audit trail
- **Spider Web Core**: Can trigger alerts from Spider Web events

---

**Status**: ✅ Complete  
**Next**: Continue with Audit Core documentation
