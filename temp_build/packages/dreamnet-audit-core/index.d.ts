/**
 * DreamNet Audit Core
 * Complete audit trail system
 */
import type { AuditLog, AuditAction, AuditQuery } from "./types";
export declare const DreamNetAuditCore: {
    /**
     * Record an audit log entry
     */
    recordAction(action: AuditAction, details: Record<string, any>, context?: {
        userId?: string;
        walletAddress?: string;
        clusterId?: string;
        resourceId?: string;
        resourceType?: string;
        ipAddress?: string;
        userAgent?: string;
        traceId?: string;
        success?: boolean;
        error?: string;
    }): AuditLog;
    /**
     * Query audit logs
     */
    queryLogs(query: AuditQuery): AuditLog[];
    /**
     * Get audit statistics
     */
    getStats(): import("./types").AuditStats;
    /**
     * Export audit logs (for compliance reports)
     */
    exportLogs(query?: AuditQuery): AuditLog[];
};
export * from "./types";
export default DreamNetAuditCore;
