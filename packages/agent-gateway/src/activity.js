/**
 * Agent Activity Buffer
 * Tracks recent tool executions for DreamScope/Civic Panel
 */
const MAX_RECORDS = 200;
const activityBuffer = [];
function generateId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export function recordAgentActivity(record) {
    const fullRecord = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        ...record,
    };
    activityBuffer.push(fullRecord);
    if (activityBuffer.length > MAX_RECORDS) {
        activityBuffer.shift();
    }
}
export function getRecentAgentActivity(limit) {
    const records = [...activityBuffer];
    if (limit && limit > 0) {
        return records.slice(-limit);
    }
    return records;
}
export function getActivityStats() {
    const byTool = {};
    let ok = 0;
    let failed = 0;
    const byRiskLevel = {};
    for (const record of activityBuffer) {
        byTool[record.toolId] = (byTool[record.toolId] || 0) + 1;
        if (record.ok) {
            ok++;
        }
        else {
            failed++;
        }
        const risk = record.riskLevel || "unknown";
        byRiskLevel[risk] = (byRiskLevel[risk] || 0) + 1;
    }
    return {
        total: activityBuffer.length,
        byTool,
        byStatus: { ok, failed },
        byRiskLevel,
    };
}
