/**
 * Browser Automation Helpers for Spike Agents
 * Helper functions for agents to use browser automation for verification and troubleshooting
 */

import { startMission, browserMissionStep } from "@dreamnet/browser-agent-core";
import type { BrowserAction, BrowserToolInput } from "@dreamnet/browser-agent-core";

/**
 * Check API dashboard for status
 */
export async function checkAPIDashboard(
  url: string,
  agentId: string,
  allowedDomains: string[]
): Promise<{ success: boolean; status: string; screenshotId?: string }> {
  try {
    // Create a read-only mission
    const mission = createMission(
      agentId,
      allowedDomains,
      `Check API dashboard status: ${url}`,
      "read_only",
      10, // max steps
      1 // expires in 1 hour
    );

    // Navigate to dashboard
    const navInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: `Navigate to ${url} and check status`,
      action: { type: "open_url", url },
    };
    const navResult = await browserMissionStep(navInput, agentId);

    if (!navResult.observation.success) {
      return { success: false, status: "navigation_failed" };
    }

    // Extract text to find status
    const extractInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: "Extract status information from page",
      action: { type: "extract_text" },
    };
    const extractResult = await browserMissionStep(extractInput, agentId);

    // Take screenshot for reference
    const screenshotInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: "Capture screenshot of dashboard",
      action: { type: "screenshot", label: "api-dashboard-status" },
    };
    const screenshotResult = await browserMissionStep(screenshotInput, agentId);

    const statusText = extractResult.observation.textSnippet || "";
    const status = statusText.toLowerCase().includes("down") || statusText.toLowerCase().includes("error")
      ? "down"
      : statusText.toLowerCase().includes("degraded") || statusText.toLowerCase().includes("warning")
      ? "degraded"
      : "healthy";

    return {
      success: true,
      status,
      screenshotId: screenshotResult.observation.screenshotId,
    };
  } catch (error: any) {
    console.error(`[BrowserHelpers] Error checking API dashboard:`, error.message);
    return { success: false, status: "error" };
  }
}

/**
 * Verify price on external website
 */
export async function verifyPriceOnWebsite(
  symbol: string,
  expectedPrice: number,
  url: string,
  priceSelector: string,
  agentId: string,
  allowedDomains: string[]
): Promise<{ match: boolean; actualPrice?: number; screenshotId?: string }> {
  try {
    // Create a read-only mission
    const mission = createMission(
      agentId,
      allowedDomains,
      `Verify ${symbol} price on website`,
      "read_only",
      10,
      1
    );

    // Navigate to website
    const navInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: `Navigate to ${url}`,
      action: { type: "open_url", url },
    };
    await browserMissionStep(navInput, agentId);

    // Extract price from selector
    const extractInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: `Extract ${symbol} price from ${priceSelector}`,
      action: { type: "extract_text", selector: priceSelector },
    };
    const extractResult = await browserMissionStep(extractInput, agentId);

    // Parse price from text
    const priceText = extractResult.observation.textSnippet || "";
    const priceMatch = priceText.match(/[\d,]+\.?\d*/);
    const actualPrice = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, "")) : null;

    // Take screenshot
    const screenshotInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: "Capture screenshot of price",
      action: { type: "screenshot", label: `price-verification-${symbol}` },
    };
    const screenshotResult = await browserMissionStep(screenshotInput, agentId);

    if (actualPrice === null) {
      return { match: false, screenshotId: screenshotResult.observation.screenshotId };
    }

    // Allow 1% variance for price matching
    const variance = Math.abs(actualPrice - expectedPrice) / expectedPrice;
    const match = variance < 0.01;

    return {
      match,
      actualPrice,
      screenshotId: screenshotResult.observation.screenshotId,
    };
  } catch (error: any) {
    console.error(`[BrowserHelpers] Error verifying price:`, error.message);
    return { match: false };
  }
}

/**
 * Check API status page
 */
export async function checkAPIStatusPage(
  statusPageUrl: string,
  agentId: string,
  allowedDomains: string[]
): Promise<{ success: boolean; isDown: boolean; message?: string }> {
  try {
    const mission = createMission(
      agentId,
      allowedDomains,
      `Check API status page: ${statusPageUrl}`,
      "read_only",
      5,
      1
    );

    const navInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: `Navigate to status page`,
      action: { type: "open_url", url: statusPageUrl },
    };
    await browserMissionStep(navInput, agentId);

    const extractInput: BrowserToolInput = {
      mission: mission.missionId,
      goal: "Extract status information",
      action: { type: "extract_text" },
    };
    const extractResult = await browserMissionStep(extractInput, agentId);

    const statusText = extractResult.observation.textSnippet?.toLowerCase() || "";
    const isDown = statusText.includes("down") || statusText.includes("outage") || statusText.includes("error");

    return {
      success: true,
      isDown,
      message: extractResult.observation.textSnippet?.substring(0, 200),
    };
  } catch (error: any) {
    console.error(`[BrowserHelpers] Error checking status page:`, error.message);
    return { success: false, isDown: false };
  }
}

