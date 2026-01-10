/**
 * Audit Store
 * Stores audit logs (in-memory for now, should use database in production)
 */
import type { AuditLog, AuditQuery, AuditStats } from "../types";
declare class AuditStore {
    private logs;
    private maxLogs;
    recordLog(log: AuditLog): void;
    queryLogs(query: AuditQuery): AuditLog[];
    getStats(): AuditStats;
    exportLogs(query?: AuditQuery): AuditLog[];
}
export declare const auditStore: AuditStore;
export {};
