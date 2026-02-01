/**
 * Audit Store
 * Stores audit logs (in-memory for now, should use database in production)
 */

import type { AuditLog, AuditQuery, AuditStats } from '../types.js';

class AuditStore {
  private logs: AuditLog[] = [];
  private maxLogs = 100000; // Keep last 100k logs

  recordLog(log: AuditLog): void {
    this.logs.push(log);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  queryLogs(query: AuditQuery): AuditLog[] {
    let filtered = [...this.logs];

    if (query.userId) {
      filtered = filtered.filter((log) => log.userId === query.userId);
    }

    if (query.walletAddress) {
      filtered = filtered.filter((log) => log.walletAddress === query.walletAddress);
    }

    if (query.action) {
      filtered = filtered.filter((log) => log.action === query.action);
    }

    if (query.clusterId) {
      filtered = filtered.filter((log) => log.clusterId === query.clusterId);
    }

    if (query.startTime) {
      filtered = filtered.filter((log) => log.timestamp >= query.startTime!);
    }

    if (query.endTime) {
      filtered = filtered.filter((log) => log.timestamp <= query.endTime!);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    return filtered.slice(offset, offset + limit);
  }

  getStats(): AuditStats {
    const actionsByType: Record<string, number> = {};
    const actionsByCluster: Record<string, number> = {};
    const actionsByUser: Record<string, number> = {};

    for (const log of this.logs) {
      actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
      
      if (log.clusterId) {
        actionsByCluster[log.clusterId] = (actionsByCluster[log.clusterId] || 0) + 1;
      }
      
      const userKey = log.userId || log.walletAddress || "anonymous";
      actionsByUser[userKey] = (actionsByUser[userKey] || 0) + 1;
    }

    return {
      totalLogs: this.logs.length,
      actionsByType: actionsByType as any,
      actionsByCluster,
      actionsByUser,
      recentActivity: this.logs.slice(-50).reverse(),
    };
  }

  exportLogs(query?: AuditQuery): AuditLog[] {
    if (query) {
      return this.queryLogs(query);
    }
    return [...this.logs];
  }
}

export const auditStore = new AuditStore();

