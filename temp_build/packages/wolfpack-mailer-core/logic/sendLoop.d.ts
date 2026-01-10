/**
 * Process the send queue once with safety limits:
 * - Respects daily email limit (default: 50/day, well under Gmail's 500/day)
 * - Limits emails per cycle (default: 10 per cycle)
 * - Adds small delay between sends to avoid rate limits
 *
 * Environment variables:
 * - WOLFMAIL_MAX_PER_DAY: Max emails per day (default: 50)
 * - WOLFMAIL_MAX_PER_CYCLE: Max emails per cycle (default: 10)
 */
export declare function processSendQueueOnce(): Promise<void>;
