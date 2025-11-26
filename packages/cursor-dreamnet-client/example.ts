/**
 * Example usage of CursorDreamNetClient
 * 
 * Run with: pnpm tsx packages/cursor-dreamnet-client/example.ts
 */

import { CursorDreamNetClient, checkHealth } from "./index.js";

async function main() {
  console.log("🚀 Cursor DreamNet Client Example\n");

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

  try {
    // 1. Validate API key
    console.log("1️⃣ Validating API key...");
    const isValid = await client.validateApiKey();
    console.log(`   ✅ API key valid: ${isValid}\n`);

    if (!isValid) {
      console.error("❌ API key is invalid");
      process.exit(1);
    }

    // 2. Quick health check
    console.log("2️⃣ Checking system health...");
    const isHealthy = await client.isHealthy();
    console.log(`   ✅ System healthy: ${isHealthy}\n`);

    // 3. Get full heartbeat
    console.log("3️⃣ Getting system heartbeat...");
    const heartbeat = await client.getHeartbeat();
    console.log(`   ✅ System OK: ${heartbeat.ok}`);
    console.log(`   📊 Timestamp: ${heartbeat.timestamp}`);
    if (heartbeat.uptime) {
      console.log(`   ⏱️  Uptime: ${heartbeat.uptime}s`);
    }
    console.log();

    // 4. Get system state
    console.log("4️⃣ Getting system state...");
    const systemState = await client.getSystemState();
    console.log(`   ✅ System state retrieved`);
    console.log(`   📦 Keys: ${Object.keys(systemState).join(", ")}\n`);

    // 5. Get Shield status
    console.log("5️⃣ Getting Shield Core status...");
    const shieldStatus = await client.getShieldStatus();
    console.log(`   ✅ Shield status retrieved\n`);

    // 6. Query dreams (if available)
    console.log("6️⃣ Querying dreams...");
    try {
      const dreams = await client.queryDreams({ limit: 5 });
      console.log(`   ✅ Found ${dreams.length} dreams\n`);
    } catch (error: any) {
      console.log(`   ⚠️  Dreams query failed: ${error.message}\n`);
    }

    // 7. Natural language query
    console.log("7️⃣ Sending natural language query...");
    try {
      const queryResult = await client.query("What's the current system status?");
      console.log(`   ✅ Query result received`);
      if (typeof queryResult === "string") {
        console.log(`   💬 Response: ${queryResult.substring(0, 100)}...\n`);
      } else {
        console.log(`   💬 Response type: ${typeof queryResult}\n`);
      }
    } catch (error: any) {
      console.log(`   ⚠️  Query failed: ${error.message}\n`);
    }

    console.log("✅ All examples completed successfully!");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

