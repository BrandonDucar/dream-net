/**
 * Browser Agent Core
 * Safe, governed browser capability for DreamNet agents
 */

export type {
  BrowserAction,
  BrowserObservation,
  BrowserMission,
  BrowserLogEntry,
  CredentialProfile,
  BrowserToolInput,
  BrowserToolOutput,
  BrowserMissionSummary,
} from "./types";

export {
  startMission,
  getMission,
  endMission,
  listActiveMissions,
  isUrlAllowed,
  validateAction,
  isAgentAuthorized,
  cleanupExpiredMissions,
} from "./mission";

export {
  executeBrowserAction,
  executeActionSequence,
  cleanupBrowser,
} from "./executor";

export {
  executeBrowserActionWithPlaywright,
  executeActionSequenceWithPlaywright,
  cleanupBrowserForMission,
  getScreenshotPath,
  getScreenshotUrl,
} from "./playwright-executor";

export {
  logBrowserStep,
  getMissionLogs,
  getMissionSummary,
  exportMissionLogs,
  replayMission,
} from "./logger";

export {
  browserLogin,
  getCredentialProfile,
  listCredentialProfiles,
} from "./credentials";

export {
  browserMissionStep,
  createMission,
  loginWithProfile,
} from "./tool";

export {
  registerBrowserAgents,
  initBrowserAgentIntegration,
} from "./integration/agent-registry";

export {
  reportMissionToDreamKeeper,
  reportMissionStart,
  reportMissionFailure,
} from "./integration/dreamkeeper";

export {
  createFormFillSequence,
  createNavigationSequence,
  createWaitSequence,
  createScreenshotSequence,
  createClickSequence,
  createExtractSequence,
  combineActionSequences,
  addWaitsBetweenActions,
} from "./utils/action-helpers";

// Main Browser Agent Core class
import type { BrowserMission, BrowserToolInput, BrowserToolOutput } from "./types";
import { startMission, getMission, endMission, listActiveMissions, isAgentAuthorized } from "./mission";
import { browserMissionStep as executeStep, createMission as createNewMission } from "./tool";
import { getMissionSummary, replayMission } from "./logger";

export class BrowserAgentCore {
  /**
   * Create a new browser mission
   */
  createMission(
    agentId: string,
    allowedDomains: string[],
    description: string,
    mode: "read_only" | "limited_write" = "read_only",
    maxSteps: number = 50,
    expiresInHours: number = 24
  ): BrowserMission {
    return createNewMission(agentId, allowedDomains, description, mode, maxSteps, expiresInHours);
  }

  /**
   * Execute a browser mission step
   */
  async executeStep(input: BrowserToolInput, agentId: string): Promise<BrowserToolOutput> {
    return executeStep(input, agentId);
  }

  /**
   * Get mission by ID
   */
  getMission(missionId: string): BrowserMission | undefined {
    return getMission(missionId);
  }

  /**
   * End a mission
   */
  async endMission(missionId: string, status: "success" | "failed" | "aborted"): Promise<BrowserMission | undefined> {
    return endMission(missionId, status);
  }

  /**
   * List active missions
   */
  listActiveMissions(): BrowserMission[] {
    return listActiveMissions();
  }

  /**
   * Check if agent is authorized
   */
  isAgentAuthorized(agentId: string): boolean {
    return isAgentAuthorized(agentId);
  }

  /**
   * Get mission summary
   */
  async getMissionSummary(mission: BrowserMission) {
    const summary = await getMissionSummary(mission);
    
    // Report to DreamKeeper
    const { reportMissionToDreamKeeper } = await import("./integration/dreamkeeper");
    await reportMissionToDreamKeeper(mission, {
      missionId: mission.missionId,
      agentId: mission.agentId,
      description: mission.description,
      status: mission.status,
      totalSteps: summary.totalSteps,
      successfulSteps: summary.successfulSteps,
      failedSteps: summary.failedSteps,
      domainsAccessed: Array.from(summary.domainsAccessed),
      actionsPerformed: summary.actionsPerformed,
      startedAt: mission.createdAt,
      completedAt: mission.status !== "active" ? new Date().toISOString() : undefined,
      duration: summary.duration,
    });
    
    return summary;
  }

  /**
   * Replay a mission from logs
   */
  async replayMission(missionId: string) {
    return replayMission(missionId);
  }
}

export default BrowserAgentCore;

