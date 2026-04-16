/**
 * Audit Trail Service
 * 
 * Simple in-memory audit trail for tracking system events
 * In production, this should be replaced with a persistent store
 */

interface AuditEntry {
  id: string;
  path: string;
  action: string;
  outcome: string;
  timestamp: number;
  duration?: number;
  userId?: string;
  metadata?: string;
}

class AuditTrailService {
  private entries: AuditEntry[] = [];
  private readonly MAX_ENTRIES = 10000;

  async writeAudit(
    path: string,
    action: string,
    outcome: string,
    timestamp: number,
    userId?: string,
    metadata?: string
  ): Promise<void> {
    const entry: AuditEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      path,
      action,
      outcome,
      timestamp,
      userId,
      metadata,
    };

    this.entries.push(entry);

    // Keep only the most recent entries
    if (this.entries.length > this.MAX_ENTRIES) {
      this.entries.shift();
    }
  }

  async getAuditStats(): Promise<{
    total_entries: number;
    last_24h: number;
  }> {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;

    const recentEntries = this.entries.filter(
      (entry) => entry.timestamp >= last24h
    );

    return {
      total_entries: this.entries.length,
      last_24h: recentEntries.length,
    };
  }

  getEntries(limit?: number): AuditEntry[] {
    const entries = [...this.entries].reverse(); // Most recent first
    return limit ? entries.slice(0, limit) : entries;
  }
}

export const auditTrail = new AuditTrailService();


