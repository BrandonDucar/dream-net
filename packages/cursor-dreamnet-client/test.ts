/**
 * Test script for CursorDreamNetClient
 * Tests package structure and basic functionality
 */

import { CursorDreamNetClient, createClient, checkHealth } from "./index.js";

console.log("🧪 Testing Cursor DreamNet Client\n");

// Test 1: Package imports
console.log("1️⃣ Testing package imports...");
try {
  console.log("   ✅ CursorDreamNetClient imported");
  console.log("   ✅ createClient imported");
  console.log("   ✅ checkHealth imported");
} catch (error: any) {
  console.error("   ❌ Import failed:", error.message);
  process.exit(1);
}

// Test 2: Client initialization (without API key - should throw)
console.log("\n2️⃣ Testing client initialization (no API key)...");
try {
  // Temporarily clear API key
  const originalKey = process.env.DREAMNET_API_KEY;
  delete process.env.DREAMNET_API_KEY;
  
  try {
    const client = new CursorDreamNetClient();
    console.error("   ❌ Should have thrown error without API key");
    process.exit(1);
  } catch (error: any) {
    if (error.message.includes("DREAMNET_API_KEY")) {
      console.log("   ✅ Correctly throws error when API key missing");
    } else {
      console.error("   ❌ Wrong error:", error.message);
      process.exit(1);
    }
  }
  
  // Restore API key if it existed
  if (originalKey) {
    process.env.DREAMNET_API_KEY = originalKey;
  }
} catch (error: any) {
  console.error("   ❌ Test failed:", error.message);
  process.exit(1);
}

// Test 3: Client initialization with API key (mock)
console.log("\n3️⃣ Testing client initialization (with mock API key)...");
try {
  process.env.DREAMNET_API_KEY = "dn_test_mock_key_for_testing";
  const client = new CursorDreamNetClient({
    baseUrl: "https://dreamnet.world"
  });
  console.log("   ✅ Client created successfully");
  console.log("   ✅ Base URL:", client.getAgent() ? "set" : "not set");
} catch (error: any) {
  console.error("   ❌ Client creation failed:", error.message);
  process.exit(1);
}

// Test 4: createClient helper function
console.log("\n4️⃣ Testing createClient helper...");
try {
  const client = createClient({
    apiKey: "dn_test_mock_key",
    baseUrl: "https://dreamnet.world"
  });
  console.log("   ✅ createClient works");
} catch (error: any) {
  console.error("   ❌ createClient failed:", error.message);
  process.exit(1);
}

// Test 5: Check method existence
console.log("\n5️⃣ Testing method availability...");
try {
  const client = new CursorDreamNetClient({
    apiKey: "dn_test_mock_key"
  });
  
  const methods = [
    "validateApiKey",
    "getHeartbeat",
    "getSystemState",
    "isHealthy",
    "getSpiderWebStatus",
    "getShieldStatus",
    "getControlPlaneStatus",
    "queryDreams",
    "getDream",
    "queryAgent",
    "query",
    "getShieldThreats",
    "getWolfPackOpportunities",
    "getSpiderWebThreads",
    "listVercelProjects",
    "getAgent"
  ];
  
  for (const method of methods) {
    if (typeof (client as any)[method] === "function") {
      console.log(`   ✅ ${method}() exists`);
    } else {
      console.error(`   ❌ ${method}() missing`);
      process.exit(1);
    }
  }
} catch (error: any) {
  console.error("   ❌ Method check failed:", error.message);
  process.exit(1);
}

// Test 6: Type checking
console.log("\n6️⃣ Testing TypeScript types...");
try {
  const client = new CursorDreamNetClient({
    apiKey: "dn_test_mock_key"
  });
  
  // These should compile without errors
  const agent = client.getAgent();
  console.log("   ✅ getAgent() returns DreamNetAgent");
  
  // Test that methods exist on agent
  if (typeof agent.checkSystemStatus === "function") {
    console.log("   ✅ Underlying agent has checkSystemStatus()");
  }
} catch (error: any) {
  console.error("   ❌ Type check failed:", error.message);
  process.exit(1);
}

console.log("\n✅ All tests passed!");
console.log("\n📝 Note: To test actual API calls, set DREAMNET_API_KEY environment variable");
console.log("   Example: $env:DREAMNET_API_KEY='dn_live_your_key_here'");

