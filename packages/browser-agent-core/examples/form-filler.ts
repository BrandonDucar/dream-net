/**
 * Example: Form Filler Agent
 * Demonstrates how agents can fill forms for users
 */

import { BrowserAgentCore } from "../index";

export interface FormData {
  name?: string;
  email?: string;
  company?: string;
  description?: string;
  website?: string;
  [key: string]: string | undefined;
}

/**
 * Example: Fill out an affiliate program application form
 * This demonstrates the "Form Filler Agent" use case for creators
 */
export async function fillAffiliateForm(formUrl: string, formData: FormData) {
  const browserCore = new BrowserAgentCore();

  // Extract domain from URL for allowlist
  const urlObj = new URL(formUrl);
  const domain = urlObj.hostname;

  // Create mission
  const mission = browserCore.createMission(
    "WebOpsAgent",
    [domain],
    `Fill affiliate program application form`,
    "limited_write",
    30,
    1
  );

  console.log(`📝 Starting form filling mission: ${mission.missionId}`);

  try {
    // Step 1: Navigate to form
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Navigate to form page",
        action: { type: "open_url", url: formUrl },
      },
      "WebOpsAgent"
    );

    // Step 2: Wait for form to load
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Wait for form to load",
        action: { type: "wait", ms: 2000 },
      },
      "WebOpsAgent"
    );

    // Step 3: Fill form fields dynamically
    const fieldMappings: Record<string, string> = {
      name: "#name, #full-name, input[name='name']",
      email: "#email, #email-address, input[type='email']",
      company: "#company, #company-name, input[name='company']",
      description: "#description, #about, textarea[name='description']",
      website: "#website, #url, input[name='website']",
    };

    for (const [key, value] of Object.entries(formData)) {
      if (!value) continue;

      const selectors = fieldMappings[key]?.split(", ") || [`#${key}`, `input[name='${key}']`];

      // Try each selector until one works
      let filled = false;
      for (const selector of selectors) {
        try {
          await browserCore.executeStep(
            {
              mission: mission.missionId,
              goal: `Fill ${key} field`,
              action: { type: "type", selector: selector.trim(), text: value },
            },
            "WebOpsAgent"
          );
          filled = true;
          break;
        } catch (error) {
          // Try next selector
          continue;
        }
      }

      if (!filled) {
        console.warn(`⚠️  Could not find field for ${key}`);
      }
    }

    // Step 4: Take screenshot before submission
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Capture filled form",
        action: { type: "screenshot", label: "filled-form" },
      },
      "WebOpsAgent"
    );

    // Step 5: Submit form
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Submit the form",
        action: { type: "click", selector: "button[type='submit'], button.submit, input[type='submit']" },
      },
      "WebOpsAgent"
    );

    // Step 6: Wait for confirmation
    await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Wait for submission confirmation",
        action: { type: "wait", ms: 3000 },
      },
      "WebOpsAgent"
    );

    // Step 7: Extract confirmation
    const confirmation = await browserCore.executeStep(
      {
        mission: mission.missionId,
        goal: "Extract confirmation message",
        action: { type: "extract_text", selector: ".success, .confirmation, .message" },
      },
      "WebOpsAgent"
    );

    const summary = await browserCore.getMissionSummary(mission);
    await browserCore.endMission(mission.missionId, "success");

    console.log(`✅ Form filled successfully!`);
    console.log(`   Confirmation: ${confirmation.observation.textSnippet?.substring(0, 100)}...`);

    return {
      success: true,
      missionId: mission.missionId,
      confirmation: confirmation.observation.textSnippet,
    };
  } catch (error: any) {
    console.error(`❌ Form filling failed:`, error);
    await browserCore.endMission(mission.missionId, "failed");
    return { success: false, error: error.message };
  }
}

