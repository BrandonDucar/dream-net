/**
 * Example: Automated Grant Application
 * Demonstrates how WebOpsAgent can automate grant application workflows
 */

import { BrowserAgentCore } from "../index";
import type { BrowserAction } from "../types";

/**
 * Example: Apply to AWS Activate grant
 * This demonstrates automating a grant application workflow
 */
export async function automateGrantApplication() {
  const browserCore = new BrowserAgentCore();

  // Create mission for grant application
  const mission = browserCore.createMission(
    "WebOpsAgent",
    ["aws.amazon.com", "activate.aws.amazon.com"],
    "Apply to AWS Activate grant program",
    "limited_write",
    50, // Allow more steps for complex forms
    2 // Expires in 2 hours
  );

  console.log(`🚀 Starting grant application mission: ${mission.missionId}`);

  try {
    // Step 1: Navigate to grant portal
    const step1 = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Navigate to AWS Activate grant application page",
        action: { type: "open_url", url: "https://activate.aws.amazon.com/apply" },
      },
      "WebOpsAgent"
    );
    console.log(`✅ Step 1: ${step1.notes}`);

    // Step 2: Wait for page to load
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Wait for page to fully load",
        action: { type: "wait", ms: 2000 },
      },
      "WebOpsAgent"
    );

    // Step 3: Extract form fields to understand structure
    const step3 = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Extract form structure to understand what fields need to be filled",
        action: { type: "extract_text", selector: "form" },
      },
      "WebOpsAgent"
    );
    console.log(`📋 Form structure: ${step3.observation.textSnippet?.substring(0, 200)}...`);

    // Step 4: Fill in company information
    // Note: In real implementation, these would come from a data source
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Fill in company name",
        action: { type: "type", selector: "#company-name", text: "DreamNet" },
      },
      "WebOpsAgent"
    );

    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Fill in company description",
        action: {
          type: "type",
          selector: "#company-description",
          text: "DreamNet is a biomimetic multi-agent AI platform that enables decentralized innovation and collaboration.",
        },
      },
      "WebOpsAgent"
    );

    // Step 5: Upload required documents
    // Note: File upload would require additional action type in real implementation
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Take screenshot before submission",
        action: { type: "screenshot", label: "grant-application-form" },
      },
      "WebOpsAgent"
    );

    // Step 6: Submit application
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Click submit button",
        action: { type: "click", selector: "button[type='submit']" },
      },
      "WebOpsAgent"
    );

    // Step 7: Wait for confirmation
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Wait for submission confirmation",
        action: { type: "wait", ms: 3000 },
      },
      "WebOpsAgent"
    );

    // Step 8: Capture confirmation page
    const step8 = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Extract confirmation message",
        action: { type: "extract_text", selector: ".confirmation-message" },
      },
      "WebOpsAgent"
    );
    console.log(`✅ Confirmation: ${step8.observation.textSnippet}`);

    // Get mission summary
    const summary = await browserCore.getMissionSummary(mission);
    console.log(`\n📊 Mission Summary:`);
    console.log(`   Total steps: ${summary.totalSteps}`);
    console.log(`   Successful: ${summary.successfulSteps}`);
    console.log(`   Failed: ${summary.failedSteps}`);
    console.log(`   Duration: ${summary.duration}ms`);

    // End mission
    await browserCore.endMission(mission.missionId, "success");
    console.log(`\n✅ Grant application mission completed successfully!`);

    return { success: true, missionId: mission.missionId };
  } catch (error: any) {
    console.error(`❌ Grant application failed:`, error);
    await browserCore.endMission(mission.missionId, "failed");
    return { success: false, error: error.message };
  }
}

