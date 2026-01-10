/**
 * DreamNet Audit Core
 * Complete audit trail system
 */

import { auditStore } from './store/auditStore.js';
import type { AuditLog, AuditAction, AuditQuery } from './types.js';

export const DreamNetAuditCore = {
  /**
   * Record an audit log entry
   */
  recordAction(
    action: AuditAction,
    details: Record<string, any>,
    context?: {
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
    }
  ): AuditLog {
    const log: AuditLog = {
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
      .catch(() => {});
    
    return log;
  },

  /**
   * Query audit logs
   */
  queryLogs(query: AuditQuery): AuditLog[] {
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
  exportLogs(query?: AuditQuery): AuditLog[] {
    return auditStore.exportLogs(query);
  },
};

export * from './types.js';
export default DreamNetAuditCore;

