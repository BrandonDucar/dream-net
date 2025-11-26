/**
 * Example: Agent Communication
 * 
 * Run with: pnpm tsx packages/cursor-dreamnet-client/example-agents.ts
 */

import {
  CursorDreamNetClient,
} from "./index.js";

async function main() {
  console.log("🤖 Cursor DreamNet Agent Communication Example\n");

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

  // Get agent communication
  console.log("2️⃣ Getting agent communication...");
  const agents = client.getAgents();
  console.log("   ✅ Agent communication ready\n");

  // Test listing tools
  console.log("3️⃣ Testing Agent Gateway tools...");
  try {
    const tools = await agents.listTools();
    console.log(`   ✅ Found ${tools.length} available tools`);
    if (tools.length > 0) {
      console.log(`   📦 Sample tools: ${tools.slice(0, 3).map(t => t.id).join(", ")}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Tool listing failed: ${error.message}`);
  }

  // Test querying an agent
  console.log("\n4️⃣ Testing agent query (DeployKeeper)...");
  try {
    const result = await agents.askDeployKeeper("What's the current deployment status?");
    console.log("   ✅ Query successful");
    if (typeof result === "string") {
      console.log(`   💬 Response: ${result.substring(0, 100)}...`);
    } else {
      console.log(`   💬 Response type: ${typeof result}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Agent query failed: ${error.message}`);
  }

  // Test sending a message
  console.log("\n5️⃣ Testing agent messaging...");
  try {
    const sent = await agents.sendMessage("DeployKeeper", "Hello from Cursor!", {
      topic: "cursor.communication",
      meta: { source: "cursor-test" },
    });
    if (sent) {
      console.log("   ✅ Message sent successfully");
    } else {
      console.log("   ⚠️  Message sending returned false (may not have write access)");
    }
  } catch (error: any) {
    console.log(`   ⚠️  Message sending failed: ${error.message}`);
    console.log("   (This is expected if DM bus is not available)");
  }

  // Test agent gateway intent execution
  console.log("\n6️⃣ Testing Agent Gateway intent execution...");
  try {
    const result = await agents.executeIntent("Show me system status", {});
    console.log("   ✅ Intent executed");
    console.log(`   🔧 Tool used: ${result.toolId}`);
    console.log(`   ✅ Success: ${result.result.ok}`);
    if (result.result.data) {
      console.log(`   📊 Result data available`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Intent execution failed: ${error.message}`);
  }

  // Test multi-agent coordination
  console.log("\n7️⃣ Testing multi-agent coordination...");
  try {
    const results = await agents.coordinateAgents(
      ["DeployKeeper", "DreamKeeper"],
      "What's your current status?",
      { source: "cursor-test" }
    );
    console.log(`   ✅ Coordinated ${Object.keys(results).length} agents`);
    for (const [agent, { result, error }] of Object.entries(results)) {
      if (error) {
        console.log(`   ⚠️  ${agent}: ${error}`);
      } else {
        console.log(`   ✅ ${agent}: responded`);
      }
    }
  } catch (error: any) {
    console.log(`   ⚠️  Coordination failed: ${error.message}`);
  }

  // Test workflow execution
  console.log("\n8️⃣ Testing workflow execution...");
  try {
    const workflow = {
      steps: [
        {
          agent: "DeployKeeper",
          action: "get_status",
        },
        {
          agent: "DreamKeeper",
          action: "get_health",
          waitFor: "DeployKeeper",
        },
      ],
      parallel: false,
    };

    const results = await agents.executeWorkflow(workflow);
    console.log(`   ✅ Workflow executed: ${results.length} steps`);
    for (const { agent, result, error } of results) {
      if (error) {
        console.log(`   ⚠️  ${agent}: ${error}`);
      } else {
        console.log(`   ✅ ${agent}: completed`);
      }
    }
  } catch (error: any) {
    console.log(`   ⚠️  Workflow execution failed: ${error.message}`);
  }

  // Test convenience methods
  console.log("\n9️⃣ Testing convenience methods...");
  try {
    const deployStatus = await agents.askDeployKeeper("Status?");
    console.log("   ✅ DeployKeeper responded");
  } catch (error: any) {
    console.log(`   ⚠️  DeployKeeper query failed: ${error.message}`);
  }

  console.log("\n✅ Agent communication examples completed!");
  console.log("\n💡 Note: Some operations may require specific permissions");
  console.log("   Agent Gateway tools are filtered by your tier/access level");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
}

