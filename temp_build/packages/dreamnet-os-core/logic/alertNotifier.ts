/**
 * Alert Notification System
 * Sends notifications when critical alerts are detected
 */

import type { HeartbeatAlert } from "./heartbeatAlerts";

let notificationCallbacks: Array<(alert: HeartbeatAlert) => void> = [];

/**
 * Register a notification callback
 */
export function registerAlertNotifier(callback: (alert: HeartbeatAlert) => void) {
  notificationCallbacks.push(callback);
}

/**
 * Notify all registered callbacks about an alert
 */
export function notifyAlert(alert: HeartbeatAlert) {
  // Only notify for critical and warning alerts
  if (alert.severity === "critical" || alert.severity === "warning") {
    notificationCallbacks.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        console.error("[AlertNotifier] Callback failed:", error);
      }
    });
  }
}

/**
 * Clear all notification callbacks
 */
export function clearNotifiers() {
  notificationCallbacks = [];
}

