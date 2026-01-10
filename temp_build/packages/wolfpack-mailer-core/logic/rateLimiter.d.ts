/**
 * Rate Limiter for Email Sending
 *
 * Prevents hitting Gmail's 500 emails/day limit and other rate limits.
 */
/**
 * Get the maximum number of emails allowed per day.
 * Default: 50 (well under Gmail's 500/day limit for safety)
 */
export declare function getMaxEmailsPerDay(): number;
/**
 * Get the maximum number of emails to send per cycle.
 * Default: 10
 */
export declare function getMaxEmailsPerCycle(): number;
/**
 * Get today's email count
 */
export declare function getTodayEmailCount(): number;
/**
 * Increment today's email count
 */
export declare function incrementTodayCount(): void;
/**
 * Check if we can send more emails today
 */
export declare function canSendMoreToday(): boolean;
/**
 * Get remaining emails allowed today
 */
export declare function getRemainingToday(): number;
/**
 * Reset the daily counter (useful for testing)
 */
export declare function resetDailyCounter(): void;
