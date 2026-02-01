/**
 * Message Formatter
 * Formats different event types into human-readable SMS messages
 */
import type { MessageTemplate } from '../types.js';
/**
 * Format Wolf Pack win message
 */
export declare function formatWolfPackWin(event: any): string;
/**
 * Format Shield Core threat blocked message
 */
export declare function formatShieldThreat(event: any): string;
/**
 * Format health check failure message
 */
export declare function formatHealthFailure(event: any): string;
/**
 * Format kill-switch message
 */
export declare function formatKillSwitch(event: any): string;
/**
 * Format incident message
 */
export declare function formatIncident(event: any): string;
/**
 * Format cost alert message
 */
export declare function formatCostAlert(event: any): string;
/**
 * Format auto-scaling message
 */
export declare function formatAutoScale(event: any): string;
/**
 * Default formatter for unknown events
 */
export declare function formatDefault(event: any): string;
/**
 * Message templates registry
 */
export declare const messageTemplates: Record<string, MessageTemplate>;
/**
 * Format event into SMS message
 */
export declare function formatEventToSMS(event: any): string;
//# sourceMappingURL=messageFormatter.d.ts.map