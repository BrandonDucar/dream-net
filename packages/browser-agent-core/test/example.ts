#!/usr/bin/env tsx
/**
 * Browser Agent Core Example
 * Demonstrates mission creation, action execution, and logging
 * 
 * This example uses the STUB executor (no real browser required)
 * For real browser automation, see examples/ directory
 */

import { BrowserAgentCore } from "../index";
import type { BrowserAction } from "../types";

async function runExample() {
  console.log(`
🌐 Browser Agent Core Example
==============================

This example demonstrates:
1. Creating a browser mission
2. Executing actions within the mission
3. Logging and audit trail
4. Mission summary and replay
  `);

  const browserCore = new BrowserAgentCore();

  // Create a mission
  console.log("\n1. Creating browser mission...");
  const mission = browserCore.createMission(
    "WebOpsAgent",
    ["dreamnet.ink", "admin.dreamnet.ink"],
    "Example mission: Check DreamNet admin dashboard status",
    "read_only",
    10, // max steps
    1 // expires in 1 hour
  );

  console.log(`   Mission ID: ${mission.missionId}`);
  console.log(`   Allowed domains: ${mission.allowedDomains.join(", ")}`);
  console.log(`   Mode: ${mission.mode}`);
  console.log(`   Max steps: ${mission.maxSteps}`);

  // Execute actions
  console.log("\n2. Executing browser actions...");

  const actions: BrowserAction[] = [
    { type: "open_url", url: "https://dreamnet.ink/admin" },
    { type: "wait", ms: 1000 },
    { type: "extract_text", selector: "body" },
    { type: "screenshot", label: "admin-dashboard" },
  ];

  const observations = [];
  for (const action of actions) {
    try {
      console.log(`   Executing: ${action.type}...`);
      const result = await browserCore.executeStep(
        {
          mission: mission.missionId,
          goal: `Perform ${action.type} action`,
          action,
        },
        "WebOpsAgent"
      );
      observations.push(result.observation);
      console.log(`   ✓ Success: ${result.notes}`);
    } catch (error: any) {
      console.error(`   ✗ Error: ${error.message}`);
      break;
    }
  }

  // Get mission summary
  console.log("\n3. Getting mission summary...");
  const summary = await browserCore.getMissionSummary(mission);
  console.log(`   Total steps: ${summary.totalSteps}`);
  console.log(`   Successful: ${summary.successfulSteps}`);
  console.log(`   Failed: ${summary.failedSteps}`);
  console.log(`   Actions: ${summary.actionsPerformed.join(", ")}`);
  console.log(`   Domains: ${Array.from(summary.domainsAccessed).join(", ")}`);
  console.log(`   Duration: ${summary.duration}ms`);

  // End mission
  console.log("\n4. Ending mission...");
  browserCore.endMission(mission.missionId, "success");
  console.log("   ✓ Mission completed");

  // Replay mission
  console.log("\n5. Replaying mission from logs...");
  await browserCore.replayMission(mission.missionId);

  console.log("\n✅ Example complete!");
  console.log(`\nLog file: logs/browser-missions/${mission.missionId}.jsonl`);
}

// Run example
runExample().catch(console.error);

