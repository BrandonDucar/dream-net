"use strict";
/**
 * Alert Notification System
 * Sends notifications when critical alerts are detected
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAlertNotifier = registerAlertNotifier;
exports.notifyAlert = notifyAlert;
exports.clearNotifiers = clearNotifiers;
let notificationCallbacks = [];
/**
 * Register a notification callback
 */
function registerAlertNotifier(callback) {
    notificationCallbacks.push(callback);
}
/**
 * Notify all registered callbacks about an alert
 */
function notifyAlert(alert) {
    // Only notify for critical and warning alerts
    if (alert.severity === "critical" || alert.severity === "warning") {
        notificationCallbacks.forEach((callback) => {
            try {
                callback(alert);
            }
            catch (error) {
                console.error("[AlertNotifier] Callback failed:", error);
            }
        });
    }
}
/**
 * Clear all notification callbacks
 */
function clearNotifiers() {
    notificationCallbacks = [];
}
