/**
 * Alert Notification System
 * Sends notifications when critical alerts are detected
 */
let notificationCallbacks = [];
/**
 * Register a notification callback
 */
export function registerAlertNotifier(callback) {
    notificationCallbacks.push(callback);
}
/**
 * Notify all registered callbacks about an alert
 */
export function notifyAlert(alert) {
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
export function clearNotifiers() {
    notificationCallbacks = [];
}
//# sourceMappingURL=alertNotifier.js.map