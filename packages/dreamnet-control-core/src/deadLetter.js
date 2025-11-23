/**
 * Dead-Letter Buffer
 * Quarantine for high-risk conduit failures and timeouts
 */
const MAX_RECORDS = 500;
const deadLetterBuffer = [];
function generateId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
/**
 * Add a record to the dead-letter buffer
 */
export function addDeadLetterRecord(params) {
    const record = {
        id: generateId(),
        ...params,
        timestamp: new Date().toISOString(),
    };
    deadLetterBuffer.push(record);
    if (deadLetterBuffer.length > MAX_RECORDS) {
        deadLetterBuffer.shift();
    }
    return record;
}
/**
 * Get all dead-letter records
 */
export function getDeadLetterRecords(limit) {
    const records = [...deadLetterBuffer];
    if (limit && limit > 0) {
        return records.slice(-limit);
    }
    return records;
}
/**
 * Get dead-letter records by conduit
 */
export function getDeadLetterRecordsByConduit(conduitId) {
    return deadLetterBuffer.filter((r) => r.conduitId === conduitId);
}
/**
 * Get dead-letter stats
 */
export function getDeadLetterStats() {
    const byConduit = {};
    const byErrorType = {};
    for (const record of deadLetterBuffer) {
        byConduit[record.conduitId] = (byConduit[record.conduitId] || 0) + 1;
        byErrorType[record.errorType] = (byErrorType[record.errorType] || 0) + 1;
    }
    return {
        total: deadLetterBuffer.length,
        byConduit,
        byErrorType,
        recentFailures: deadLetterBuffer.slice(-50), // Last 50 failures
    };
}
