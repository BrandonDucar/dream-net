/**
 * Dead-Letter Buffer
 * Quarantine for high-risk conduit failures and timeouts
 */

import type { ConduitId } from "./conduits";
import type { PortId } from "../../port-governor/src/types";
import type { ClusterId } from "../clusters";
import type { ToolId } from "../../agent-gateway/src/tools";

export interface DeadLetterRecord {
  id: string;
  conduitId: ConduitId;
  traceId: string;
  toolId: ToolId;
  portId: PortId;
  clusterId: ClusterId;
  error: string;
  errorType: "TIMEOUT" | "FAILURE" | "ERROR";
  timestamp: string;
  citizenId?: string;
  tierId?: string;
}

const MAX_RECORDS = 500;
const deadLetterBuffer: DeadLetterRecord[] = [];

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Add a record to the dead-letter buffer
 */
export function addDeadLetterRecord(params: {
  conduitId: ConduitId;
  traceId: string;
  toolId: ToolId;
  portId: PortId;
  clusterId: ClusterId;
  error: string;
  errorType: "TIMEOUT" | "FAILURE" | "ERROR";
  citizenId?: string;
  tierId?: string;
}): DeadLetterRecord {
  const record: DeadLetterRecord = {
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
export function getDeadLetterRecords(limit?: number): DeadLetterRecord[] {
  const records = [...deadLetterBuffer];
  if (limit && limit > 0) {
    return records.slice(-limit);
  }
  return records;
}

/**
 * Get dead-letter records by conduit
 */
export function getDeadLetterRecordsByConduit(conduitId: ConduitId): DeadLetterRecord[] {
  return deadLetterBuffer.filter((r) => r.conduitId === conduitId);
}

/**
 * Get dead-letter stats
 */
export function getDeadLetterStats(): {
  total: number;
  byConduit: Record<string, number>;
  byErrorType: Record<string, number>;
  recentFailures: DeadLetterRecord[];
} {
  const byConduit: Record<string, number> = {};
  const byErrorType: Record<string, number> = {};

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

