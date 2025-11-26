/**
 * Browser Mission Contract
 * Manages mission lifecycle, validation, and allowlist enforcement
 */

import type { BrowserMission, BrowserAction } from "./types";

/**
 * Active missions registry
 */
const activeMissions = new Map<string, BrowserMission>();

/**
 * Check if URL is allowed by mission
 */
export function isUrlAllowed(mission: BrowserMission, url: string): boolean {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Check if domain matches any allowed domain
    for (const allowedDomain of mission.allowedDomains) {
      // Support exact match or subdomain match
      if (domain === allowedDomain || domain.endsWith(`.${allowedDomain}`)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    // Invalid URL
    return false;
  }
}

/**
 * Validate action against mission constraints
 */
export function validateAction(mission: BrowserMission, action: BrowserAction): void {
  // Check if mission is expired
  const now = new Date();
  const expiresAt = new Date(mission.expiresAt);
  if (now > expiresAt) {
    throw new Error(`Mission ${mission.missionId} has expired`);
  }

  // Check if mission has exceeded max steps
  if (mission.currentStep >= mission.maxSteps) {
    throw new Error(`Mission ${mission.missionId} has exceeded max steps (${mission.maxSteps})`);
  }

  // Check if mission is still active
  if (mission.status !== "active") {
    throw new Error(`Mission ${mission.missionId} is not active (status: ${mission.status})`);
  }

  // Validate URL for open_url actions
  if (action.type === "open_url") {
    if (!isUrlAllowed(mission, action.url)) {
      throw new Error(`URL ${action.url} is not in allowed domains: ${mission.allowedDomains.join(", ")}`);
    }
  }

  // Validate write actions in read_only mode
  if (mission.mode === "read_only") {
    const writeActions: BrowserAction["type"][] = ["click", "type"];
    if (writeActions.includes(action.type)) {
      throw new Error(`Action ${action.type} is not allowed in read_only mode`);
    }
  }
}

/**
 * Start a new mission
 */
export function startMission(mission: BrowserMission): BrowserMission {
  // Validate mission
  if (!mission.missionId || !mission.allowedDomains || mission.allowedDomains.length === 0) {
    throw new Error("Invalid mission: missionId and allowedDomains are required");
  }

  // Check if mission already exists
  if (activeMissions.has(mission.missionId)) {
    throw new Error(`Mission ${mission.missionId} already exists`);
  }

  // Set initial state
  mission.status = "active";
  mission.currentStep = 0;
  mission.createdAt = mission.createdAt || new Date().toISOString();

  // Store mission
  activeMissions.set(mission.missionId, mission);

  console.log(`[BrowserMission] Started mission ${mission.missionId} by agent ${mission.agentId}`);
  console.log(`  Description: ${mission.description}`);
  console.log(`  Allowed domains: ${mission.allowedDomains.join(", ")}`);
  console.log(`  Mode: ${mission.mode}`);
  console.log(`  Max steps: ${mission.maxSteps}`);
  console.log(`  Expires at: ${mission.expiresAt}`);

  return mission;
}

/**
 * Get active mission
 */
export function getMission(missionId: string): BrowserMission | undefined {
  return activeMissions.get(missionId);
}

/**
 * Update mission step count
 */
export function incrementMissionStep(missionId: string): void {
  const mission = activeMissions.get(missionId);
  if (mission) {
    mission.currentStep += 1;
  }
}

/**
 * End a mission
 */
export async function endMission(missionId: string, status: "success" | "failed" | "aborted"): Promise<BrowserMission | undefined> {
  const mission = activeMissions.get(missionId);
  if (!mission) {
    throw new Error(`Mission ${missionId} not found`);
  }

  mission.status = status;
  activeMissions.delete(missionId);

  // Clean up browser instance
  try {
    const { cleanupBrowserForMission } = await import("./playwright-executor");
    await cleanupBrowserForMission(missionId);
  } catch (error: any) {
    console.warn(`[BrowserMission] Failed to cleanup browser for mission ${missionId}:`, error.message);
  }

  console.log(`[BrowserMission] Ended mission ${missionId} with status: ${status}`);
  console.log(`  Total steps: ${mission.currentStep}`);

  return mission;
}

/**
 * List all active missions
 */
export function listActiveMissions(): BrowserMission[] {
  return Array.from(activeMissions.values()).filter(m => m.status === "active");
}

/**
 * Clean up expired missions
 */
export function cleanupExpiredMissions(): number {
  const now = new Date();
  let cleaned = 0;

  for (const [missionId, mission] of activeMissions.entries()) {
    const expiresAt = new Date(mission.expiresAt);
    if (now > expiresAt) {
      endMission(missionId, "aborted");
      cleaned += 1;
    }
  }

  if (cleaned > 0) {
    console.log(`[BrowserMission] Cleaned up ${cleaned} expired mission(s)`);
  }

  return cleaned;
}

/**
 * Check if agent is authorized to use browser capability
 */
export function isAgentAuthorized(agentId: string): boolean {
  // Only specialized agents can use browser capability
  const authorizedAgents = [
    "WebOpsAgent",
    "BrowserSurgeon",
    "MetalsAgent",
    "CryptoAgent",
    "StockAgent",
  ];
  return authorizedAgents.includes(agentId);
}

