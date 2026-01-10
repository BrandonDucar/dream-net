/**
 * Message Formatter
 * Formats different event types into human-readable SMS messages
 */

import type { MessageTemplate } from '../types.js';

/**
 * Format Wolf Pack win message
 */
export function formatWolfPackWin(event: any): string {
  const target = event.metadata?.target || "unknown";
  const leadScore = event.metadata?.leadScore || "N/A";
  return `🐺 Wolf Pack HUNT: Found hot lead "${target}" (Score: ${leadScore}). DreamNet is hunting!`;
}

/**
 * Format Shield Core threat blocked message
 */
export function formatShieldThreat(event: any): string {
  const threatType = event.metadata?.threatType || "unknown";
  const severity = event.severity || "medium";
  const emoji = severity === "critical" ? "🚨" : severity === "high" ? "⚠️" : "🛡️";
  return `${emoji} Shield blocked ${severity} threat: ${threatType}. DreamNet defended.`;
}

/**
 * Format health check failure message
 */
export function formatHealthFailure(event: any): string {
  const cluster = event.clusterId || "unknown";
  const status = event.metadata?.status || "down";
  return `🏥 Health Alert: ${cluster} is ${status}. DreamNet monitoring.`;
}

/**
 * Format kill-switch message
 */
export function formatKillSwitch(event: any): string {
  const enabled = event.type === "kill_switch_enabled";
  const reason = event.metadata?.reason || "Manual";
  return enabled 
    ? `🚨 KILL-SWITCH ENABLED: ${reason}. DreamNet paused.`
    : `✅ Kill-switch disabled. DreamNet resuming.`;
}

/**
 * Format incident message
 */
export function formatIncident(event: any): string {
  const title = event.metadata?.title || event.message || "Incident";
  const severity = event.severity || "medium";
  const emoji = severity === "critical" ? "🚨" : severity === "high" ? "⚠️" : "📋";
  return `${emoji} Incident: ${title} (${severity}). DreamNet tracking.`;
}

/**
 * Format cost alert message
 */
export function formatCostAlert(event: any): string {
  const cluster = event.clusterId || "unknown";
  const cost = event.metadata?.cost || "N/A";
  const threshold = event.metadata?.threshold || "N/A";
  return `💰 Cost Alert: ${cluster} hit $${cost} (threshold: $${threshold}). DreamNet monitoring costs.`;
}

/**
 * Format auto-scaling message
 */
export function formatAutoScale(event: any): string {
  const cluster = event.clusterId || "unknown";
  const action = event.metadata?.action || "scaled";
  const newLimit = event.metadata?.newLimit || "N/A";
  return `⚡ Auto-Scale: ${cluster} ${action} to ${newLimit} req/min. DreamNet adapting.`;
}

/**
 * Default formatter for unknown events
 */
export function formatDefault(event: any): string {
  const type = event.type || "event";
  const message = event.message || "DreamNet event";
  return `📡 ${type}: ${message}`;
}

/**
 * Message templates registry
 */
export const messageTemplates: Record<string, MessageTemplate> = {
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
export function formatEventToSMS(event: any): string {
  // Try to find matching template
  const template = messageTemplates[event.type] || 
                   Object.values(messageTemplates).find(t => event.type?.includes(t.eventType));

  if (template && template.enabled) {
    return template.template(event);
  }

  // Fallback to default
  return formatDefault(event);
}

