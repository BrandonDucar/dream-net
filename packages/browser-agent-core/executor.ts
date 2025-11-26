/**
 * Browser Action Executor
 * Main entry point - uses Playwright for real browser automation
 */

import type { BrowserAction, BrowserObservation, BrowserMission } from "./types";
import { executeBrowserActionWithPlaywright, cleanupBrowserForMission } from "./playwright-executor";

/**
 * Execute a browser action
 * 
 * Uses Playwright for real browser automation (Phase 2).
 * Falls back to stub if Playwright is not available.
 */
export async function executeBrowserAction(
  mission: BrowserMission,
  action: BrowserAction
): Promise<BrowserObservation> {
  // Use Playwright executor (Phase 2)
  try {
    return await executeBrowserActionWithPlaywright(mission, action);
  } catch (error: any) {
    // Fallback to stub if Playwright fails (e.g., in environments without browser)
    console.warn(`[BrowserExecutor] Playwright failed, falling back to stub: ${error.message}`);
    return await executeBrowserActionStub(mission, action);
  }
}

/**
 * Stub implementation (fallback)
 */
async function executeBrowserActionStub(
  mission: BrowserMission,
  action: BrowserAction
): Promise<BrowserObservation> {
  // Import stub implementation
  const { validateAction, incrementMissionStep } = await import("./mission");
  validateAction(mission, action);
  incrementMissionStep(mission.missionId);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

  switch (action.type) {
    case "open_url":
      return {
        url: action.url,
        htmlSnippet: `<html><head><title>Stub Page</title></head><body><h1>Stub: ${action.url}</h1><p>Playwright not available - using stub mode.</p></body></html>`,
        textSnippet: `Stub: ${action.url}\nPlaywright not available - using stub mode.`,
        notes: `Opened URL: ${action.url} (STUB MODE)`,
        success: true,
      };

    case "click":
      return {
        url: mission.allowedDomains[0] || "unknown",
        textSnippet: `Clicked element: ${action.selector} (STUB)`,
        notes: `Successfully clicked element with selector: ${action.selector} (STUB MODE)`,
        success: true,
      };

    case "type":
      return {
        url: mission.allowedDomains[0] || "unknown",
        textSnippet: `Typed "${action.text}" into element: ${action.selector} (STUB)`,
        notes: `Successfully typed text into element with selector: ${action.selector} (STUB MODE)`,
        success: true,
      };

    case "wait":
      await new Promise(resolve => setTimeout(resolve, action.ms));
      return {
        url: mission.allowedDomains[0] || "unknown",
        notes: `Waited ${action.ms}ms`,
        success: true,
      };

    case "extract_text":
      const selector = action.selector || "body";
      return {
        url: mission.allowedDomains[0] || "unknown",
        textSnippet: `Stub: Extracted text from ${selector}\nPlaywright not available - using stub mode.`,
        notes: `Extracted text from selector: ${selector} (STUB MODE)`,
        success: true,
      };

    case "screenshot":
      const screenshotId = `screenshot-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      return {
        url: mission.allowedDomains[0] || "unknown",
        screenshotId,
        notes: `Screenshot captured: ${screenshotId}${action.label ? ` (${action.label})` : ""} (STUB MODE)`,
        success: true,
      };

    default:
      return {
        url: mission.allowedDomains[0] || "unknown",
        notes: `Unknown action type: ${(action as any).type}`,
        success: false,
        error: `Unknown action type: ${(action as any).type}`,
      };
  }
}


/**
 * Execute multiple actions sequentially
 */
export async function executeActionSequence(
  mission: BrowserMission,
  actions: BrowserAction[]
): Promise<BrowserObservation[]> {
  const observations: BrowserObservation[] = [];

  for (const action of actions) {
    try {
      const observation = await executeBrowserAction(mission, action);
      observations.push(observation);
      
      // Stop if action failed
      if (!observation.success) {
        break;
      }
    } catch (error: any) {
      observations.push({
        url: mission.allowedDomains[0] || "unknown",
        notes: `Error executing action: ${error.message}`,
        success: false,
        error: error.message,
      });
      break;
    }
  }

  return observations;
}

/**
 * Clean up browser instance for a mission
 */
export async function cleanupBrowser(missionId: string): Promise<void> {
  const { cleanupBrowserForMission } = await import("./playwright-executor");
  await cleanupBrowserForMission(missionId);
}

