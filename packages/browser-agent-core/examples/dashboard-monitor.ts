/**
 * Example: Dashboard Monitoring
 * Demonstrates how WebOpsAgent can monitor DreamNet dashboards
 */

import { BrowserAgentCore } from "../index";

/**
 * Example: Monitor DreamNet admin dashboard
 * This demonstrates automated dashboard monitoring for DevOps
 */
export async function monitorDashboard() {
  const browserCore = new BrowserAgentCore();

  // Create mission for dashboard monitoring
  const mission = browserCore.createMission(
    "WebOpsAgent",
    ["dreamnet.ink", "admin.dreamnet.ink", "dashboard.dreamnet.ink"],
    "Monitor DreamNet admin dashboard for system health",
    "read_only", // Read-only for monitoring
    20,
    1 // Expires in 1 hour
  );

  console.log(`📊 Starting dashboard monitoring mission: ${mission.missionId}`);

  try {
    // Step 1: Navigate to dashboard
    const step1 = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Navigate to admin dashboard",
        action: { type: "open_url", url: "https://admin.dreamnet.ink/dashboard" },
      },
      "WebOpsAgent"
    );

    // Step 2: Wait for dashboard to load
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Wait for dashboard to fully load",
        action: { type: "wait", ms: 3000 },
      },
      "WebOpsAgent"
    );

    // Step 3: Extract system health metrics
    const metrics = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Extract system health metrics from dashboard",
        action: { type: "extract_text", selector: ".health-metrics" },
      },
      "WebOpsAgent"
    );
    console.log(`📈 Health Metrics: ${metrics.observation.textSnippet}`);

    // Step 4: Take screenshot for record
    const screenshot = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Capture dashboard screenshot",
        action: { type: "screenshot", label: "dashboard-health-check" },
      },
      "WebOpsAgent"
    );
    console.log(`📸 Screenshot: ${screenshot.observation.screenshotId}`);

    // Step 5: Check for alerts or warnings
    const alerts = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Check for system alerts or warnings",
        action: { type: "extract_text", selector: ".alerts" },
      },
      "WebOpsAgent"
    );

    if (alerts.observation.textSnippet && alerts.observation.textSnippet.trim().length > 0) {
      console.log(`⚠️  Alerts detected: ${alerts.observation.textSnippet}`);
      // In real implementation, this would trigger notifications
    } else {
      console.log(`✅ No alerts detected - system healthy`);
    }

    // Get mission summary
    const summary = await browserCore.getMissionSummary(mission);
    console.log(`\n📊 Monitoring Summary:`);
    console.log(`   Steps: ${summary.totalSteps}`);
    console.log(`   Successful: ${summary.successfulSteps}`);

    await browserCore.endMission(mission.missionId, "success");
    return { success: true, metrics: metrics.observation.textSnippet };
  } catch (error: any) {
    console.error(`❌ Dashboard monitoring failed:`, error);
    await browserCore.endMission(mission.missionId, "failed");
    return { success: false, error: error.message };
  }
}

