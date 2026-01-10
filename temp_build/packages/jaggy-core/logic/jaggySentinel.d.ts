/**
 * Jaggy Sentinel Logic
 * The silent guard that watches everything
 * Moves silently, works alone, answers to few
 */
import type { JaggyStatus, JaggyAlert } from "../types";
/**
 * Jaggy watches an event silently
 */
export declare function watchEvent(event: any, source?: string): JaggyAlert[];
/**
 * Jaggy prowls territories
 */
export declare function prowlTerritories(): Promise<void>;
/**
 * Get Jaggy's status
 */
export declare function getStatus(): JaggyStatus;
/**
 * Get alerts (but only if you're authorized)
 */
export declare function getAlerts(authorized?: boolean): JaggyAlert[];
/**
 * Increase Base fame
 */
export declare function increaseFame(amount?: number): void;
/**
 * Jaggy rests (reduces activity)
 */
export declare function rest(): void;
