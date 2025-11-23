/**
 * DreamNet Audit Core
 * Complete audit trail system
 */
import { auditStore } from "./store/auditStore";
export const DreamNetAuditCore = {
    /**
     * Record an audit log entry
     */
    recordAction(action, details, context) {
        const log = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            timestamp: Date.now(),
            action,
            details,
            success: context?.success !== false,
            ...context,
        };
        auditStore.recordLog(log);
        // Auto-record in Dream Snail
        const identityId = context?.userId || context?.walletAddress || "system";
        import("@dreamnet/dreamnet-snail-core/logic/autoRecord")
            .then(({ autoRecordAuditEvent }) => {
            autoRecordAuditEvent(action, identityId, { ...details, ...context });
        })
            .catch(() => { });
        return log;
    },
    /**
     * Query audit logs
     */
    queryLogs(query) {
        return auditStore.queryLogs(query);
    },
    /**
     * Get audit statistics
     */
    getStats() {
        return auditStore.getStats();
    },
    /**
     * Export audit logs (for compliance reports)
     */
    exportLogs(query) {
        return auditStore.exportLogs(query);
    },
};
export * from "./types";
export default DreamNetAuditCore;
