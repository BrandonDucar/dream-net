/**
 * Browser Mission Step Tool
 * Agent-facing tool interface for browser operations
 */

import type {
  BrowserToolInput,
  BrowserToolOutput,
  BrowserMission,
  BrowserAction,
  BrowserObservation,
} from "./types";
import { getMission, isAgentAuthorized, startMission } from "./mission";
import { executeBrowserAction } from "./executor";
import { logBrowserStep } from "./logger";
import { browserLogin } from "./credentials";
import { reportMissionStart } from "./integration/dreamkeeper";

/**
 * Execute a browser mission step
 * 
 * This is the main tool interface that agents call.
 * It validates the mission, executes the action, logs everything,
 * and returns an observation.
 */
export async function browserMissionStep(
  input: BrowserToolInput,
  agentId: string
): Promise<BrowserToolOutput> {
  const startTime = Date.now();

  // Check agent authorization
  if (!isAgentAuthorized(agentId)) {
    throw new Error(`Agent ${agentId} is not authorized to use browser capability. Only WebOpsAgent and BrowserSurgeon can use this tool.`);
  }

  // Get or validate mission
  let mission: BrowserMission;
  if (typeof input.mission === "string") {
    // missionId provided, fetch mission
    const fetched = getMission(input.mission);
    if (!fetched) {
      throw new Error(`Mission ${input.mission} not found or not active`);
    }
    mission = fetched;
  } else {
    // Mission object provided, use it
    mission = input.mission;
  }

  // Verify agent owns this mission
  if (mission.agentId !== agentId) {
    throw new Error(`Agent ${agentId} does not own mission ${mission.missionId}`);
  }

  // Determine action to execute
  let action: BrowserAction;
  if (input.action) {
    // Specific action provided
    action = input.action;
  } else {
    // Infer action from goal (simplified - in production, agent would plan this)
    // For now, if goal mentions a URL, open it; otherwise extract text
    if (input.goal.toLowerCase().includes("open") || input.goal.toLowerCase().includes("navigate")) {
      // Try to extract URL from goal (simplified)
      const urlMatch = input.goal.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        action = { type: "open_url", url: urlMatch[0] };
      } else {
        throw new Error("Cannot infer action from goal. Please provide explicit action.");
      }
    } else {
      // Default to extracting text
      action = { type: "extract_text" };
    }
  }

  // Execute action
  let observation: BrowserObservation;
  try {
    observation = await executeBrowserAction(mission, action);
    const duration = Date.now() - startTime;

    // Log the step
    await logBrowserStep(
      mission.missionId,
      mission.currentStep,
      action,
      observation,
      duration
    );

    // Generate notes
    const notes = observation.notes || `Executed ${action.type}: ${observation.success ? "success" : "failed"}`;

    return {
      observation,
      notes,
      missionStatus: mission.status,
      remainingSteps: Math.max(0, mission.maxSteps - mission.currentStep),
    };
  } catch (error: any) {
    // Action failed validation or execution
    observation = {
      url: mission.allowedDomains[0] || "unknown",
      notes: `Action failed: ${error.message}`,
      success: false,
      error: error.message,
    };

    const duration = Date.now() - startTime;
    await logBrowserStep(
      mission.missionId,
      mission.currentStep,
      action,
      observation,
      duration
    );

    throw error;
  }
}

/**
 * Create a new mission and return it
 */
export function createMission(
  agentId: string,
  allowedDomains: string[],
  description: string,
  mode: "read_only" | "limited_write" = "read_only",
  maxSteps: number = 50,
  expiresInHours: number = 24
): BrowserMission {
  // Check agent authorization
  if (!isAgentAuthorized(agentId)) {
    throw new Error(`Agent ${agentId} is not authorized to create browser missions`);
  }

  const missionId = `mission-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

  const mission: BrowserMission = {
    missionId,
    allowedDomains,
    mode,
    maxSteps,
    expiresAt,
    description,
    agentId,
    createdAt: new Date().toISOString(),
    status: "active",
    currentStep: 0,
  };

  // Start the mission
  const startedMission = startMission(mission);
  
  // Report to DreamKeeper
  reportMissionStart(startedMission).catch(err => {
    console.warn(`[BrowserAgentCore] Failed to report mission start:`, err);
  });
  
  return startedMission;
}

/**
 * Login using credential profile (helper for agents)
 */
export async function loginWithProfile(profile: string): Promise<{ success: boolean; message: string }> {
  return browserLogin(profile as any);
}

