/**
 * DreamKeeper Integration
 * Reports browser missions to DreamNet's governance system
 */

import type { BrowserMission, BrowserMissionSummary } from "../types";

/**
 * Report a browser mission to DreamKeeper
 * This integrates with DreamNet's governance system for audit and monitoring
 */
export async function reportMissionToDreamKeeper(
  mission: BrowserMission,
  summary: BrowserMissionSummary
): Promise<void> {
  try {
    // In a full implementation, this would integrate with DreamKeeper's API
    // For now, we'll emit events that DreamKeeper can listen to
    
    // Check if DreamKeeper/Instant Mesh is available
    const instantMesh = (global as any).instantMesh;
    if (instantMesh && instantMesh.emit) {
      instantMesh.emit({
        source: "browser-agent-core",
        type: "browser.mission.completed",
        payload: {
          missionId: mission.missionId,
          agentId: mission.agentId,
          status: mission.status,
          summary: {
            totalSteps: summary.totalSteps,
            successfulSteps: summary.successfulSteps,
            failedSteps: summary.failedSteps,
            domainsAccessed: Array.from(summary.domainsAccessed),
            actionsPerformed: summary.actionsPerformed,
            duration: summary.duration,
          },
          description: mission.description,
          startedAt: summary.startedAt,
          completedAt: summary.completedAt,
        },
      });
      console.log(`📊 [BrowserAgentCore] Reported mission ${mission.missionId} to DreamKeeper`);
    } else {
      // Fallback: log to console if DreamKeeper not available
      console.log(`📊 [BrowserAgentCore] Mission ${mission.missionId} completed:`);
      console.log(`   Agent: ${mission.agentId}`);
      console.log(`   Status: ${mission.status}`);
      console.log(`   Steps: ${summary.totalSteps} (${summary.successfulSteps} successful, ${summary.failedSteps} failed)`);
      console.log(`   Duration: ${summary.duration}ms`);
      console.log(`   Domains: ${Array.from(summary.domainsAccessed).join(", ")}`);
    }
  } catch (error: any) {
    console.warn(`[BrowserAgentCore] Failed to report mission to DreamKeeper:`, error.message);
  }
}

/**
 * Report mission start to DreamKeeper
 */
export async function reportMissionStart(mission: BrowserMission): Promise<void> {
  try {
    const instantMesh = (global as any).instantMesh;
    if (instantMesh && instantMesh.emit) {
      instantMesh.emit({
        source: "browser-agent-core",
        type: "browser.mission.started",
        payload: {
          missionId: mission.missionId,
          agentId: mission.agentId,
          description: mission.description,
          allowedDomains: mission.allowedDomains,
          mode: mission.mode,
          maxSteps: mission.maxSteps,
          expiresAt: mission.expiresAt,
        },
      });
    }
  } catch (error: any) {
    console.warn(`[BrowserAgentCore] Failed to report mission start:`, error.message);
  }
}

/**
 * Report mission failure to DreamKeeper
 */
export async function reportMissionFailure(
  mission: BrowserMission,
  error: Error
): Promise<void> {
  try {
    const instantMesh = (global as any).instantMesh;
    if (instantMesh && instantMesh.emit) {
      instantMesh.emit({
        source: "browser-agent-core",
        type: "browser.mission.failed",
        payload: {
          missionId: mission.missionId,
          agentId: mission.agentId,
          error: error.message,
          description: mission.description,
        },
      });
    }
  } catch (err: any) {
    console.warn(`[BrowserAgentCore] Failed to report mission failure:`, err.message);
  }
}

