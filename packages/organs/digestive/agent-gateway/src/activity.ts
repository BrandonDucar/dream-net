/**
 * Agent Activity Buffer
 * Tracks recent tool executions for DreamScope/Civic Panel
 */

import type { ToolId } from './tools.js';

export interface AgentActivityRecord {
  id: string;
  timestamp: string;
  toolId: ToolId;
  intent: string;
  citizenId?: string;
  tierId?: string;
  ok: boolean;
  latencyMs?: number;
  riskLevel?: string;
  error?: string;
  portId?: string;
  conduitId?: string;
}

const MAX_RECORDS = 200;
const activityBuffer: AgentActivityRecord[] = [];

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function recordAgentActivity(record: Omit<AgentActivityRecord, "id" | "timestamp">): void {
  const fullRecord: AgentActivityRecord = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...record,
  };

  activityBuffer.push(fullRecord);
  if (activityBuffer.length > MAX_RECORDS) {
    activityBuffer.shift();
  }
}

export function getRecentAgentActivity(limit?: number): AgentActivityRecord[] {
  const records = [...activityBuffer];
  if (limit && limit > 0) {
    return records.slice(-limit);
  }
  return records;
}

export function getActivityStats(): {
  total: number;
  byTool: Record<string, number>;
  byStatus: { ok: number; failed: number };
  byRiskLevel: Record<string, number>;
} {
  const byTool: Record<string, number> = {};
  let ok = 0;
  let failed = 0;
  const byRiskLevel: Record<string, number> = {};

  for (const record of activityBuffer) {
    byTool[record.toolId] = (byTool[record.toolId] || 0) + 1;
    if (record.ok) {
      ok++;
    } else {
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

