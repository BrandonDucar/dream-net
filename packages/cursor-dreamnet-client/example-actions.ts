/**
 * Example: Autonomous Action System
 * 
 * Run with: pnpm tsx packages/cursor-dreamnet-client/example-actions.ts
 */

import {
  CursorDreamNetClient,
} from "./index.js";

async function main() {
  console.log("⚡ Cursor DreamNet Autonomous Action System Example\n");

  // Check if API key is set
  const apiKey = process.env.DREAMNET_API_KEY;
  if (!apiKey) {
    console.error("❌ DREAMNET_API_KEY not set in environment");
    console.log("Set it with: export DREAMNET_API_KEY=your_key_here");
    process.exit(1);
  }

  // Create client
  const client = new CursorDreamNetClient({
    apiKey,
    baseUrl: process.env.DREAMNET_API_URL || "https://dreamnet.world",
  });

  // Validate API key first
  console.log("1️⃣ Validating API key...");
  const isValid = await client.validateApiKey();
  if (!isValid) {
    console.error("❌ API key is invalid");
    process.exit(1);
  }
  console.log("   ✅ API key valid\n");

  // Get action system
  console.log("2️⃣ Getting action system...");
  const actions = client.getActions();
  console.log("   ✅ Action system ready\n");

  // Test safety check for a low-risk action
  console.log("3️⃣ Testing safety check (low-risk read action)...");
  try {
    const safetyCheck = await actions.checkSafety({
      actionId: "query_status",
      actionType: "read",
      target: "system",
      params: {},
      description: "Query system status",
    });
    console.log(`   ✅ Safety check complete`);
    console.log(`   📊 Risk score: ${safetyCheck.riskScore}`);
    console.log(`   ✅ Safe: ${safetyCheck.safe}`);
    console.log(`   🔒 Requires approval: ${safetyCheck.requiresApproval}`);
    if (safetyCheck.warnings) {
      console.log(`   ⚠️  Warnings: ${safetyCheck.warnings.join(", ")}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Safety check failed: ${error.message}`);
  }

  // Test safety check for a high-risk action
  console.log("\n4️⃣ Testing safety check (high-risk system action)...");
  try {
    const safetyCheck = await actions.checkSafety({
      actionId: "kill_switch",
      actionType: "system",
      target: "control-core",
      params: { enabled: true },
      description: "Enable global kill-switch",
    });
    console.log(`   ✅ Safety check complete`);
    console.log(`   📊 Risk score: ${safetyCheck.riskScore}`);
    console.log(`   ✅ Safe: ${safetyCheck.safe}`);
    console.log(`   🔒 Requires approval: ${safetyCheck.requiresApproval}`);
    if (safetyCheck.approvalTypes) {
      console.log(`   👥 Approval types needed: ${safetyCheck.approvalTypes.join(", ")}`);
    }
    if (safetyCheck.reasons) {
      console.log(`   ❌ Reasons: ${safetyCheck.reasons.join(", ")}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Safety check failed: ${error.message}`);
  }

  // Test executing a safe action
  console.log("\n5️⃣ Testing action execution (safe read action)...");
  try {
    const result = await actions.executeAction({
      actionId: "query_status",
      actionType: "read",
      target: "system",
      params: {},
      description: "Query system status",
    }, {
      autoApprove: true, // Auto-approve if safe
    });
    console.log(`   ✅ Action executed: ${result.executed}`);
    if (result.result) {
      console.log(`   ✅ Success: ${result.result.success}`);
      if (result.result.duration) {
        console.log(`   ⏱️  Duration: ${result.result.duration}ms`);
      }
    }
  } catch (error: any) {
    console.log(`   ⚠️  Action execution failed: ${error.message}`);
  }

  // Test approval workflow (if action requires approval)
  console.log("\n6️⃣ Testing approval workflow...");
  try {
    const safetyCheck = await actions.checkSafety({
      actionId: "update_config",
      actionType: "write",
      target: "control-core",
      params: { key: "test", value: "test" },
      description: "Update configuration",
    });

    if (safetyCheck.requiresApproval) {
      console.log("   📝 Requesting approval...");
      const approval = await actions.requestApproval({
        actionId: "update_config",
        actionType: "write",
        target: "control-core",
        params: { key: "test", value: "test" },
        description: "Update configuration",
      });
      console.log(`   ✅ Approval requested: ${approval.approvalId}`);
      console.log(`   📊 Status: ${approval.status}`);
      console.log(`   ⏰ Expires at: ${approval.expiresAt?.toISOString()}`);
    } else {
      console.log("   ℹ️  Action does not require approval");
    }
  } catch (error: any) {
    console.log(`   ⚠️  Approval workflow failed: ${error.message}`);
  }

  // Test workflow execution
  console.log("\n7️⃣ Testing workflow execution...");
  try {
    const workflow: import("./actions.js").ActionWorkflow = {
      workflowId: `workflow-${Date.now()}`,
      steps: [
        {
          stepId: "step1",
          action: {
            actionId: "query_status",
            actionType: "read" as const,
            target: "system",
            params: {},
          },
        },
        {
          stepId: "step2",
          action: {
            actionId: "query_agent",
            actionType: "read" as const,
            target: "DeployKeeper",
            params: { query: "status" },
          },
          waitFor: ["step1"],
        },
      ],
      parallel: false,
      status: "pending",
      results: {},
    };

    const result = await actions.executeWorkflow(workflow);
    console.log(`   ✅ Workflow executed: ${result.status}`);
    console.log(`   📊 Steps completed: ${Object.keys(result.results).length}`);
    for (const [stepId, stepResult] of Object.entries(result.results)) {
      console.log(`   ${stepResult.executed ? "✅" : "❌"} ${stepId}: ${stepResult.result?.success ? "success" : "failed"}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Workflow execution failed: ${error.message}`);
  }

  console.log("\n✅ Autonomous action system examples completed!");
  console.log("\n💡 Note: Some operations may require specific permissions");
  console.log("   High-risk actions require approval before execution");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
}

