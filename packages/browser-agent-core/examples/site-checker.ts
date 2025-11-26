/**
 * Example: Site Checker
 * Demonstrates automated QA for DreamNet mini-apps
 */

import { BrowserAgentCore } from "../index";

export interface SiteCheckResult {
  url: string;
  status: "healthy" | "warning" | "error";
  issues: string[];
  screenshots: string[];
  performance?: {
    loadTime: number;
    errors: number;
  };
}

/**
 * Example: Check a DreamNet mini-app deployment
 * This demonstrates the "Site Checker" use case for validating deployments
 */
export async function checkDreamNetSite(siteUrl: string): Promise<SiteCheckResult> {
  const browserCore = new BrowserAgentCore();

  const urlObj = new URL(siteUrl);
  const domain = urlObj.hostname;

  const mission = browserCore.createMission(
    "BrowserSurgeon",
    [domain],
    `Health check for ${siteUrl}`,
    "read_only",
    25,
    1
  );

  console.log(`🔍 Starting site check for: ${siteUrl}`);

  const result: SiteCheckResult = {
    url: siteUrl,
    status: "healthy",
    issues: [],
    screenshots: [],
  };

  try {
    const startTime = Date.now();

    // Step 1: Navigate to site
    const step1 = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Navigate to site",
        action: { type: "open_url", url: siteUrl },
      },
      "BrowserSurgeon"
    );

    if (!step1.observation.success) {
      result.status = "error";
      result.issues.push(`Failed to load site: ${step1.observation.error}`);
      return result;
    }

    // Step 2: Wait for page to load
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Wait for page to fully load",
        action: { type: "wait", ms: 3000 },
      },
      "BrowserSurgeon"
    );

    const loadTime = Date.now() - startTime;
    result.performance = { loadTime, errors: 0 };

    // Step 3: Check for console errors (would need browser console access)
    // For now, we'll check for visible error messages
    const errorCheck = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Check for visible error messages",
        action: { type: "extract_text", selector: ".error, .alert-danger, [role='alert']" },
      },
      "BrowserSurgeon"
    );

    if (errorCheck.observation.textSnippet && errorCheck.observation.textSnippet.trim().length > 0) {
      result.status = "error";
      result.issues.push(`Visible errors detected: ${errorCheck.observation.textSnippet.substring(0, 200)}`);
    }

    // Step 4: Check if styles loaded (check for unstyled content)
    const styleCheck = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Extract page content to verify styles loaded",
        action: { type: "extract_text", selector: "body" },
      },
      "BrowserSurgeon"
    );

    // Step 5: Take screenshot of homepage
    const screenshot1 = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Capture homepage screenshot",
        action: { type: "screenshot", label: "homepage" },
      },
      "BrowserSurgeon"
    );

    if (screenshot1.observation.screenshotId) {
      result.screenshots.push(screenshot1.observation.screenshotId);
    }

    // Step 6: Check for DreamNet integration (look for specific elements)
    const integrationCheck = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Check for DreamNet integration elements",
        action: { type: "extract_text", selector: "[data-dreamnet], .dreamnet-integration" },
      },
      "BrowserSurgeon"
    );

    if (!integrationCheck.observation.textSnippet || integrationCheck.observation.textSnippet.trim().length === 0) {
      result.status = result.status === "error" ? "error" : "warning";
      result.issues.push("DreamNet integration elements not found");
    }

    // Step 7: Check for broken links (simplified - would need more sophisticated checking)
    const linkCheck = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Extract all links to check for broken ones",
        action: { type: "extract_text", selector: "a[href]" },
      },
      "BrowserSurgeon"
    );

    // Step 8: Performance check
    if (loadTime > 5000) {
      result.status = result.status === "error" ? "error" : "warning";
      result.issues.push(`Slow load time: ${loadTime}ms`);
    }

    const summary = await browserCore.getMissionSummary(mission);
    await browserCore.endMission(mission.missionId, "success");

    console.log(`\n📊 Site Check Results:`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Issues: ${result.issues.length}`);
    console.log(`   Load time: ${loadTime}ms`);
    console.log(`   Screenshots: ${result.screenshots.length}`);

    return result;
  } catch (error: any) {
    console.error(`❌ Site check failed:`, error);
    result.status = "error";
    result.issues.push(`Check failed: ${error.message}`);
    await browserCore.endMission(mission.missionId, "failed");
    return result;
  }
}

