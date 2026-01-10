"use strict";
/**
 * Spider Web Thread Bridge
 * Biomimetic: Converts operational events into Spider Web threads (nervous system)
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationalEventToFly = operationalEventToFly;
exports.operationalEventToThread = operationalEventToThread;
exports.bridgeToSpiderWeb = bridgeToSpiderWeb;
const spider_web_core_1 = require("../../spider-web-core");
/**
 * Convert operational event to Spider Web Fly
 */
function operationalEventToFly(event) {
    const flyType = event.severity === "critical" ? "alert" : "metric";
    const priority = event.severity === "critical" ? "high" :
        event.severity === "high" ? "medium" :
            "low";
    return spider_web_core_1.SpiderWebCore.createFly(flyType, `operational:${event.type}`, {
        eventType: event.type,
        clusterId: event.clusterId,
        severity: event.severity,
        message: event.message,
        metadata: event.metadata,
        timestamp: event.timestamp,
    }, priority, event.severity === "critical" // Sticky for critical events
    );
}
/**
 * Convert operational event directly to Spider Web Thread
 */
function operationalEventToThread(event) {
    const threadPriority = event.severity === "critical" ? "critical" :
        event.severity === "high" ? "high" :
            event.severity === "medium" ? "medium" :
                "low";
    const threadKind = getThreadKindForEvent(event.type);
    const thread = {
        id: `thread:operational:${event.type}:${Date.now()}`,
        kind: threadKind,
        status: "pending",
        priority: threadPriority,
        createdAt: event.timestamp,
        updatedAt: event.timestamp,
        source: {
            kind: "operational",
            id: `event:${event.type}`,
        },
        targets: [{
                kind: (event.clusterId ? "cluster" : "system"),
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
function getThreadKindForEvent(eventType) {
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
            return "control";
        default:
            return "signal";
    }
}
/**
 * Determine if event type should create executable thread
 */
function getExecutableForEvent(eventType) {
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
function getExecutionPlanForEvent(event) {
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
function bridgeToSpiderWeb(event) {
    // Create thread from event
    const thread = operationalEventToThread(event);
    // Add thread to Spider Web
    spider_web_core_1.SpiderWebCore.addThread(thread);
    // Also create fly for pattern learning
    const fly = operationalEventToFly(event);
    spider_web_core_1.SpiderWebCore.catchFly(fly);
    // Auto-record in Dream Snail (if available) - async import
    Promise.resolve().then(() => __importStar(require("@dreamnet/dreamnet-snail-core/logic/autoRecord"))).then(({ autoRecordOperationalEvent }) => {
        const identityId = event.metadata?.identityId || "system";
        autoRecordOperationalEvent(event, identityId);
    })
        .catch(() => {
        // Dream Snail not available, skip silently
    });
    // Route to Voice (Twilio SMS) - Phase 2 - One Mouth
    Promise.resolve().then(() => __importStar(require("@dreamnet/dreamnet-voice-twilio"))).then(({ DreamNetVoiceTwilio }) => {
        DreamNetVoiceTwilio.routeEvent(event).catch((err) => {
            console.warn("[SpiderWebBridge] Failed to route event to Voice:", err.message);
        });
    })
        .catch(() => {
        // Voice not available, skip silently
    });
    return thread;
}
