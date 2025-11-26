/**
 * Example: Memory Access (DreamVault, Events, Agent States)
 * 
 * Run with: pnpm tsx packages/cursor-dreamnet-client/example-memory.ts
 */

import {
  CursorDreamNetClient,
  getMemoryAccess,
} from "./index.js";

async function main() {
  console.log("🧠 Cursor DreamNet Memory Access Example\n");

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

  // Get memory access
  console.log("2️⃣ Getting memory access...");
  const memory = client.getMemory();
  console.log("   ✅ Memory access ready\n");

  // Test DreamVault operations
  console.log("3️⃣ Testing DreamVault operations...");
  
  try {
    // Search dreams
    const dreams = await memory.searchDreams({ limit: 5 });
    console.log(`   ✅ Found ${dreams.length} dreams`);
    
    if (dreams.length > 0) {
      const firstDream = dreams[0];
      console.log(`   📝 Sample dream: ${firstDream.title} (${firstDream.id})`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Dream search failed: ${error.message}`);
  }

  // Test creating a dream (if write access available)
  console.log("\n4️⃣ Testing dream creation...");
  try {
    const newDream = await memory.createDream({
      title: "Cursor Analysis Test",
      description: "This is a test dream created by Cursor",
      type: "analysis",
      createdByAgent: "cursor",
      tags: ["test", "cursor"],
    });
    console.log(`   ✅ Dream created: ${newDream.id}`);
    console.log(`   📝 Title: ${newDream.title}`);
  } catch (error: any) {
    console.log(`   ⚠️  Dream creation failed: ${error.message}`);
    console.log(`   (This is expected if write permissions are not available)`);
  }

  // Test event logs
  console.log("\n5️⃣ Testing event log access...");
  try {
    const events = await memory.getRecentEvents(10);
    console.log(`   ✅ Found ${events.length} recent events`);
    
    if (events.length > 0) {
      const firstEvent = events[0];
      console.log(`   📅 Latest event: ${firstEvent.type} at ${firstEvent.timestamp.toISOString()}`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Event log access failed: ${error.message}`);
  }

  // Test logging an event
  console.log("\n6️⃣ Testing event logging...");
  try {
    const logged = await memory.logEvent("cursor.test", {
      message: "Test event from Cursor",
      timestamp: new Date().toISOString(),
    });
    if (logged) {
      console.log("   ✅ Event logged successfully");
    } else {
      console.log("   ⚠️  Event logging returned false (may not have write access)");
    }
  } catch (error: any) {
    console.log(`   ⚠️  Event logging failed: ${error.message}`);
  }

  // Test agent states
  console.log("\n7️⃣ Testing agent state access...");
  try {
    const agentStates = await memory.getAllAgentStates();
    const agentNames = Object.keys(agentStates);
    console.log(`   ✅ Found ${agentNames.length} agents`);
    
    if (agentNames.length > 0) {
      const firstAgent = agentNames[0];
      const state = agentStates[firstAgent];
      console.log(`   🤖 Sample agent: ${firstAgent} (${state.status})`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Agent state access failed: ${error.message}`);
  }

  // Test storing analysis
  console.log("\n8️⃣ Testing analysis storage...");
  try {
    const analysis = await memory.storeCursorAnalysis({
      title: "System Analysis - Test",
      content: "This is a test analysis stored by Cursor",
      findings: [
        "System is operational",
        "All cores are healthy",
      ],
      recommendations: [
        "Continue monitoring",
        "Consider optimization opportunities",
      ],
      metadata: {
        source: "cursor-test",
        timestamp: new Date().toISOString(),
      },
    });
    console.log(`   ✅ Analysis stored as dream: ${analysis.id}`);
    console.log(`   📝 Title: ${analysis.title}`);
  } catch (error: any) {
    console.log(`   ⚠️  Analysis storage failed: ${error.message}`);
    console.log(`   (This is expected if write permissions are not available)`);
  }

  console.log("\n✅ Memory access examples completed!");
  console.log("\n💡 Note: Some operations may require write permissions");
  console.log("   Read operations should work with any valid API key");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
}

