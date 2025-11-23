/**
 * Rate Limiter for Email Sending
 *
 * Prevents hitting Gmail's 500 emails/day limit and other rate limits.
 */
let dailyCounter = null;
/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayString() {
    return new Date().toISOString().split("T")[0];
}
/**
 * Get the maximum number of emails allowed per day.
 * Default: 50 (well under Gmail's 500/day limit for safety)
 */
export function getMaxEmailsPerDay() {
    const envMax = process.env.WOLFMAIL_MAX_PER_DAY;
    if (envMax) {
        const parsed = Number(envMax);
        if (!isNaN(parsed) && parsed > 0) {
            return Math.min(parsed, 500); // Cap at 500 (Gmail's hard limit)
        }
    }
    return 50; // Safe default: 50/day = 10% of Gmail limit
}
/**
 * Get the maximum number of emails to send per cycle.
 * Default: 10
 */
export function getMaxEmailsPerCycle() {
    const envMax = process.env.WOLFMAIL_MAX_PER_CYCLE;
    if (envMax) {
        const parsed = Number(envMax);
        if (!isNaN(parsed) && parsed > 0) {
            return parsed;
        }
    }
    return 10; // Safe default: 10 per cycle
}
/**
 * Get today's email count
 */
export function getTodayEmailCount() {
    const today = getTodayString();
    // Reset counter if it's a new day
    if (!dailyCounter || dailyCounter.date !== today) {
        dailyCounter = { date: today, count: 0 };
    }
    return dailyCounter.count;
}
/**
 * Increment today's email count
 */
export function incrementTodayCount() {
    const today = getTodayString();
    if (!dailyCounter || dailyCounter.date !== today) {
        dailyCounter = { date: today, count: 0 };
    }
    dailyCounter.count += 1;
}
/**
 * Check if we can send more emails today
 */
export function canSendMoreToday() {
    const todayCount = getTodayEmailCount();
    const maxPerDay = getMaxEmailsPerDay();
    return todayCount < maxPerDay;
}
/**
 * Get remaining emails allowed today
 */
export function getRemainingToday() {
    const todayCount = getTodayEmailCount();
    const maxPerDay = getMaxEmailsPerDay();
    return Math.max(0, maxPerDay - todayCount);
}
/**
 * Reset the daily counter (useful for testing)
 */
export function resetDailyCounter() {
    dailyCounter = null;
}
