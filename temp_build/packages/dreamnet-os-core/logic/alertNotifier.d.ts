/**
 * Alert Notification System
 * Sends notifications when critical alerts are detected
 */
import type { HeartbeatAlert } from "./heartbeatAlerts";
/**
 * Register a notification callback
 */
export declare function registerAlertNotifier(callback: (alert: HeartbeatAlert) => void): void;
/**
 * Notify all registered callbacks about an alert
 */
export declare function notifyAlert(alert: HeartbeatAlert): void;
/**
 * Clear all notification callbacks
 */
export declare function clearNotifiers(): void;
