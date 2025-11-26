/**
 * Browser Mission Logger
 * Audit logging system for all browser actions
 */

import type { BrowserLogEntry, BrowserMission, BrowserAction, BrowserObservation } from "./types";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * Log storage directory
 */
const LOG_DIR = process.env.BROWSER_MISSION_LOGS_DIR || "logs/browser-missions";

/**
 * Ensure log directory exists
 */
async function ensureLogDir(): Promise<void> {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") {
      console.error(`[BrowserLogger] Failed to create log directory:`, error);
    }
  }
}

/**
 * Log a browser step
 */
export async function logBrowserStep(
  missionId: string,
  step: number,
  action: BrowserAction,
  observation: BrowserObservation,
  duration?: number
): Promise<void> {
  await ensureLogDir();

  const entry: BrowserLogEntry = {
    missionId,
    step,
    timestamp: new Date().toISOString(),
    action,
    observationSummary: observation.notes,
    url: observation.url,
    success: observation.success,
    error: observation.error,
    duration,
  };

  // Append to mission log file
  const logFile = join(LOG_DIR, `${missionId}.jsonl`);
  const logLine = JSON.stringify(entry) + "\n";

  try {
    await fs.appendFile(logFile, logLine, "utf-8");
  } catch (error: any) {
    console.error(`[BrowserLogger] Failed to write log entry:`, error);
  }
}

/**
 * Get all log entries for a mission
 */
export async function getMissionLogs(missionId: string): Promise<BrowserLogEntry[]> {
  const logFile = join(LOG_DIR, `${missionId}.jsonl`);
  
  try {
    const content = await fs.readFile(logFile, "utf-8");
    return content
      .split("\n")
      .filter(line => line.trim())
      .map(line => JSON.parse(line) as BrowserLogEntry);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return []; // Log file doesn't exist yet
    }
    console.error(`[BrowserLogger] Failed to read log file:`, error);
    return [];
  }
}

/**
 * Get mission summary from logs
 */
export async function getMissionSummary(mission: BrowserMission): Promise<{
  totalSteps: number;
  successfulSteps: number;
  failedSteps: number;
  actionsPerformed: string[];
  domainsAccessed: Set<string>;
  duration: number;
}> {
  const logs = await getMissionLogs(mission.missionId);
  
  const successfulSteps = logs.filter(l => l.success).length;
  const failedSteps = logs.filter(l => !l.success).length;
  const actionsPerformed = [...new Set(logs.map(l => l.action.type))];
  const domainsAccessed = new Set<string>();
  
  let totalDuration = 0;
  for (const log of logs) {
    if (log.url) {
      try {
        const urlObj = new URL(log.url);
        domainsAccessed.add(urlObj.hostname);
      } catch {
        // Invalid URL, skip
      }
    }
    if (log.duration) {
      totalDuration += log.duration;
    }
  }

  return {
    totalSteps: logs.length,
    successfulSteps,
    failedSteps,
    actionsPerformed,
    domainsAccessed,
    duration: totalDuration,
  };
}

/**
 * Export mission logs as JSON
 */
export async function exportMissionLogs(missionId: string): Promise<BrowserLogEntry[]> {
  return getMissionLogs(missionId);
}

/**
 * Replay a mission from logs
 */
export async function replayMission(missionId: string): Promise<BrowserLogEntry[]> {
  const logs = await getMissionLogs(missionId);
  console.log(`[BrowserLogger] Replaying mission ${missionId} with ${logs.length} steps`);
  
  for (const log of logs) {
    console.log(`  Step ${log.step}: ${log.action.type} - ${log.success ? "✓" : "✗"}`);
    if (log.error) {
      console.log(`    Error: ${log.error}`);
    }
  }
  
  return logs;
}

