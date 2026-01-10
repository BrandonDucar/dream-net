"use strict";
/**
 * Message Formatter
 * Formats different event types into human-readable SMS messages
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTemplates = void 0;
exports.formatWolfPackWin = formatWolfPackWin;
exports.formatShieldThreat = formatShieldThreat;
exports.formatHealthFailure = formatHealthFailure;
exports.formatKillSwitch = formatKillSwitch;
exports.formatIncident = formatIncident;
exports.formatCostAlert = formatCostAlert;
exports.formatAutoScale = formatAutoScale;
exports.formatDefault = formatDefault;
exports.formatEventToSMS = formatEventToSMS;
/**
 * Format Wolf Pack win message
 */
function formatWolfPackWin(event) {
    const target = event.metadata?.target || "unknown";
    const leadScore = event.metadata?.leadScore || "N/A";
    return `🐺 Wolf Pack HUNT: Found hot lead "${target}" (Score: ${leadScore}). DreamNet is hunting!`;
}
/**
 * Format Shield Core threat blocked message
 */
function formatShieldThreat(event) {
    const threatType = event.metadata?.threatType || "unknown";
    const severity = event.severity || "medium";
    const emoji = severity === "critical" ? "🚨" : severity === "high" ? "⚠️" : "🛡️";
    return `${emoji} Shield blocked ${severity} threat: ${threatType}. DreamNet defended.`;
}
/**
 * Format health check failure message
 */
function formatHealthFailure(event) {
    const cluster = event.clusterId || "unknown";
    const status = event.metadata?.status || "down";
    return `🏥 Health Alert: ${cluster} is ${status}. DreamNet monitoring.`;
}
/**
 * Format kill-switch message
 */
function formatKillSwitch(event) {
    const enabled = event.type === "kill_switch_enabled";
    const reason = event.metadata?.reason || "Manual";
    return enabled
        ? `🚨 KILL-SWITCH ENABLED: ${reason}. DreamNet paused.`
        : `✅ Kill-switch disabled. DreamNet resuming.`;
}
/**
 * Format incident message
 */
function formatIncident(event) {
    const title = event.metadata?.title || event.message || "Incident";
    const severity = event.severity || "medium";
    const emoji = severity === "critical" ? "🚨" : severity === "high" ? "⚠️" : "📋";
    return `${emoji} Incident: ${title} (${severity}). DreamNet tracking.`;
}
/**
 * Format cost alert message
 */
function formatCostAlert(event) {
    const cluster = event.clusterId || "unknown";
    const cost = event.metadata?.cost || "N/A";
    const threshold = event.metadata?.threshold || "N/A";
    return `💰 Cost Alert: ${cluster} hit $${cost} (threshold: $${threshold}). DreamNet monitoring costs.`;
}
/**
 * Format auto-scaling message
 */
function formatAutoScale(event) {
    const cluster = event.clusterId || "unknown";
    const action = event.metadata?.action || "scaled";
    const newLimit = event.metadata?.newLimit || "N/A";
    return `⚡ Auto-Scale: ${cluster} ${action} to ${newLimit} req/min. DreamNet adapting.`;
}
/**
 * Default formatter for unknown events
 */
function formatDefault(event) {
    const type = event.type || "event";
    const message = event.message || "DreamNet event";
    return `📡 ${type}: ${message}`;
}
/**
 * Message templates registry
 */
exports.messageTemplates = {
    "wolf-pack-win": {
        eventType: "wolf-pack-win",
        template: formatWolfPackWin,
        priority: "high",
        enabled: true,
    },
    "shield-threat": {
        eventType: "shield-threat",
        template: formatShieldThreat,
        priority: "critical",
        enabled: true,
    },
    "health-check-failed": {
        eventType: "health_check_failed",
        template: formatHealthFailure,
        priority: "high",
        enabled: true,
    },
    "kill-switch": {
        eventType: "kill_switch_enabled",
        template: formatKillSwitch,
        priority: "critical",
        enabled: true,
    },
    "incident": {
        eventType: "incident_created",
        template: formatIncident,
        priority: "high",
        enabled: true,
    },
    "cost-alert": {
        eventType: "cost_threshold_exceeded",
        template: formatCostAlert,
        priority: "medium",
        enabled: true,
    },
    "auto-scale": {
        eventType: "auto_scaling_applied",
        template: formatAutoScale,
        priority: "low",
        enabled: true,
    },
};
/**
 * Format event into SMS message
 */
function formatEventToSMS(event) {
    // Try to find matching template
    const template = exports.messageTemplates[event.type] ||
        Object.values(exports.messageTemplates).find(t => event.type?.includes(t.eventType));
    if (template && template.enabled) {
        return template.template(event);
    }
    // Fallback to default
    return formatDefault(event);
}
