/**
 * Spider Web Thread Bridge
 * Biomimetic: Converts operational events into Spider Web threads (nervous system)
 */

import { SpiderWebCore } from "../spider-web/index.js";
import { type SignalThread, type Fly, type FlyType, type FlyPriority, type ThreadPriority } from "../spider-web/index.js";
import { type OperationalEvent, type OperationalEventType } from '../types.js';

/**
 * Convert operational event to Spider Web Fly
 */
export function operationalEventToFly(event: OperationalEvent): Fly {
  const flyType: FlyType = event.severity === "critical" ? "alert" : "metric";
  const priority: FlyPriority =
    event.severity === "critical" ? "high" :
      event.severity === "high" ? "medium" :
        "low";

  return SpiderWebCore.createFly(
    flyType,
    `operational:${event.type}`,
    {
      eventType: event.type,
      clusterId: event.clusterId,
      severity: event.severity,
      message: event.message,
      metadata: event.metadata,
      timestamp: event.timestamp,
    },
    priority,
    event.severity === "critical" // Sticky for critical events
  );
}

/**
 * Convert operational event directly to Spider Web Thread
 */
export function operationalEventToThread(event: OperationalEvent): SignalThread {
  const threadPriority: ThreadPriority =
    event.severity === "critical" ? "critical" :
      event.severity === "high" ? "high" :
        event.severity === "medium" ? "medium" :
          "low";

  const threadKind = getThreadKindForEvent(event.type);

  const thread: SignalThread = {
    id: `thread:operational:${event.type}:${Date.now()}`,
    kind: threadKind,
    status: "pending",
    priority: threadPriority,
    createdAt: event.timestamp,
    updatedAt: event.timestamp,
    source: {
      kind: "operational" as any,
      id: `event:${event.type}`,
    },
    targets: [{
      kind: (event.clusterId ? "cluster" : "system") as any,
      id: event.clusterId || "dreamnet",
    }],
    payload: {
      eventType: event.type,
      clusterId: event.clusterId,
      severity: event.severity,
      message: event.message,
      metadata: event.metadata,
    },
    executable: getExecutableForEvent(event.type),
    executionPlan: getExecutionPlanForEvent(event),
  };

  return thread;
}

/**
 * Get thread kind for event type
 */
function getThreadKindForEvent(eventType: OperationalEventType): SignalThread["kind"] {
  switch (eventType) {
    case "health_check_failed":
    case "health_check_recovered":
      return "health";
    case "incident_created":
    case "incident_resolved":
      return "incident";
    case "audit_event":
      return "governance";
    case "rate_limit_exceeded":
    case "rate_limit_reset":
    case "circuit_breaker_tripped":
    case "circuit_breaker_reset":
      return "throttle";
    case "cost_threshold_exceeded":
    case "cost_budget_alert":
      return "economic";
    case "auto_scaling_decision":
    case "auto_scaling_applied":
      return "scale";
    case "scheduled_task_executed":
    case "scheduled_task_failed":
      return "automation";
    case "kill_switch_enabled":
    case "kill_switch_disabled":
    case "cluster_enabled":
    case "cluster_disabled":
    case "agent_minted":
      return "control";
    default:
      return "signal";
  }
}

/**
 * Determine if event type should create executable thread
 */
function getExecutableForEvent(eventType: OperationalEventType): boolean {
  return [
    "health_check_failed",
    "incident_created",
    "rate_limit_exceeded",
    "circuit_breaker_tripped",
    "cost_threshold_exceeded",
    "scheduled_task_failed",
    "auto_scaling_applied",
  ].includes(eventType);
}

/**
 * Generate execution plan for event
 */
function getExecutionPlanForEvent(event: OperationalEvent): SignalThread["executionPlan"] {
  switch (event.type) {
    case "health_check_failed":
      return {
        steps: [
          {
            id: "step:1",
            order: 1,
            action: "notify",
            target: { kind: "system", id: "shield-core" },
            params: { message: event.message, clusterId: event.clusterId },
          },
          {
            id: "step:2",
            order: 2,
            action: "recover",
            target: { kind: "cluster", id: event.clusterId || "unknown" },
            params: { auto: true },
          },
        ],
      };

    case "incident_created":
      return {
        steps: [
          {
            id: "step:1",
            order: 1,
            action: "alert",
            target: { kind: "system", id: "alerts-core" },
            params: { severity: event.severity, message: event.message },
          },
        ],
      };

    case "cost_threshold_exceeded":
    case "cost_budget_alert":
      return {
        steps: [
          {
            id: "step:1",
            order: 1,
            action: "throttle",
            target: { kind: "cluster", id: event.clusterId || "unknown" },
            params: { reduceRateLimit: true },
          },
        ],
      };

    case "scheduled_task_failed":
      return {
        steps: [
          {
            id: "step:1",
            order: 1,
            action: "retry",
            target: { kind: "system", id: "scheduler-core" },
            params: { taskId: event.metadata?.taskId },
          },
        ],
      };

    case "auto_scaling_applied":
      return {
        steps: [
          {
            id: "step:1",
            order: 1,
            action: "notify",
            target: { kind: "system", id: "metrics-core" },
            params: { message: `Scaling applied: ${event.message}`, clusterId: event.clusterId },
          },
        ],
      };

    case "kill_switch_enabled":
      return {
        steps: [
          {
            id: "step:1",
            order: 1,
            action: "alert",
            target: { kind: "system", id: "alerts-core" },
            params: { severity: "critical", message: "Global kill-switch enabled" },
          },
        ],
      };

    default:
      return undefined;
  }
}

/**
 * Bridge operational event to Spider Web
 */
/**
 * Bridge operational event to Spider Web AND route to Voice (SMS)
 */
export function bridgeToSpiderWeb(event: OperationalEvent): SignalThread {
  // Create thread from event
  const thread = operationalEventToThread(event);

  // Add thread to Spider Web
  SpiderWebCore.addThread(thread);

  // Also create fly for pattern learning
  const fly = operationalEventToFly(event);
  SpiderWebCore.catchFly(fly);

  // Auto-record in Dream Snail (if available) - async import
  import("@dreamnet/dreamnet-snail-core/logic/autoRecord")
    .then(({ autoRecordOperationalEvent }) => {
      const identityId = event.metadata?.identityId || "system";
      autoRecordOperationalEvent(event, identityId);
    })
    .catch(() => {
      // Dream Snail not available, skip silently
    });

  // Route to Voice (Twilio SMS) - Phase 2 - One Mouth
  import("@dreamnet/dreamnet-voice-twilio")
    .then(({ DreamNetVoiceTwilio }) => {
      DreamNetVoiceTwilio.routeEvent(event).catch((err: any) => {
        console.warn("[SpiderWebBridge] Failed to route event to Voice:", err?.message);
      });
    })
    .catch(() => {
      // Voice not available, skip silently
    });

  return thread;
}

