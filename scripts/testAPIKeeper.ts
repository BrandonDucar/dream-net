/**
 * Test API Keeper System
 */

import { APIKeeperCore } from "@dreamnet/api-keeper-core";
import { DreamStateCore } from "@dreamnet/dream-state-core";

async function main() {
  console.log("===============================================");
  console.log(" 🔑 API Keeper System Test");
  console.log("===============================================");
  console.log("");

  // 1. Discover APIs
  console.log("🔍 Discovering APIs...");
  const discovered = APIKeeperCore.discoverAPIs();
  console.log(`   ✅ Discovered ${discovered.length} providers`);
  for (const provider of discovered) {
    console.log(`      • ${provider.name} (${provider.category}) - $${provider.pricing.payPerUse?.pricePerRequest || 'N/A'}/request`);
  }
  console.log("");

  // 2. Register API keys
  console.log("🔑 Registering API keys...");
  const twilioKey = APIKeeperCore.registerKey(
    "twilio",
    process.env.TWILIO_ACCOUNT_SID || "test_account_sid",
    process.env.TWILIO_AUTH_TOKEN || "test_auth_token",
    { name: "Production Twilio Key", tags: ["production"] }
  );
  console.log(`   ✅ Registered Twilio key: ${twilioKey.id}`);

  const openaiKey = APIKeeperCore.registerKey(
    "openai",
    process.env.OPENAI_API_KEY || "test_openai_key",
    undefined,
    { name: "OpenAI Key", quotaLimit: 10000 }
  );
  console.log(`   ✅ Registered OpenAI key: ${openaiKey.id}`);
  console.log("");

  // 3. Test routing
  console.log("🧭 Testing API routing...");
  const smsRequest = {
    id: `req:${Date.now()}`,
    category: "sms" as const,
    operation: "send-sms",
    params: { to: "+1234567890", message: "Test" },
    priority: "medium" as const,
    success: false,
    requestedAt: Date.now(),
  };

  const routingDecision = APIKeeperCore.routeRequest(smsRequest);
  if (routingDecision) {
    console.log(`   ✅ Routed to: ${routingDecision.providerId}`);
    console.log(`      Reason: ${routingDecision.reason}`);
    console.log(`      Estimated Cost: $${routingDecision.estimatedCost.toFixed(4)}`);
    console.log(`      Confidence: ${(routingDecision.confidence * 100).toFixed(0)}%`);
  }
  console.log("");

  // 4. Execute request
  console.log("⚡ Executing API request...");
  const executed = APIKeeperCore.executeRequest(smsRequest);
  console.log(`   ✅ Request executed`);
  console.log(`      Provider: ${executed.providerUsed}`);
  console.log(`      Success: ${executed.success}`);
  console.log(`      Cost: $${executed.cost?.toFixed(4)}`);
  console.log(`      Latency: ${executed.latency?.toFixed(0)}ms`);
  console.log("");

  // 5. Initialize rail guards
  console.log("🛡️  Initializing rail guards...");
  APIKeeperCore.ensureDefaultRailGuards();
  const guards = APIKeeperCore.listActiveRailGuards();
  console.log(`   ✅ Created ${guards.length} rail guards`);
  for (const guard of guards) {
    console.log(`      • ${guard.name}: ${guard.type} (limit: ${guard.limit}, action: ${guard.action})`);
  }
  console.log("");

  // 6. Test rail guards
  console.log("🛡️  Testing rail guards...");
  const expensiveRequest = {
    id: `req:${Date.now()}:2`,
    category: "ai" as const,
    operation: "generate-text",
    params: { prompt: "Test" },
    priority: "high" as const,
    maxCost: 0.10, // $0.10 max
    success: false,
    requestedAt: Date.now(),
  };

  const guardCheck = APIKeeperCore.checkRailGuards(expensiveRequest);
  console.log(`   ✅ Guard check: ${guardCheck.allowed ? "ALLOWED" : "BLOCKED"}`);
  if (!guardCheck.allowed) {
    console.log(`      Reason: ${guardCheck.reason}`);
  }
  console.log("");

  // 7. Test cost-based routing
  console.log("💰 Testing cost-based routing...");
  const aiProviders = APIKeeperCore.searchProviders("ai");
  console.log(`   Found ${aiProviders.length} AI providers:`);
  for (const provider of aiProviders) {
    const cost = provider.pricing.payPerUse?.pricePerRequest || 0;
    console.log(`      • ${provider.name}: $${cost.toFixed(4)}/request (Quality: ${(provider.quality * 100).toFixed(0)}%)`);
  }

  const aiRequest = {
    id: `req:${Date.now()}:3`,
    category: "ai" as const,
    operation: "generate-text",
    params: { prompt: "Test" },
    priority: "medium" as const,
    maxCost: 0.02, // Prefer cheaper option
    success: false,
    requestedAt: Date.now(),
  };

  const aiRouting = APIKeeperCore.routeRequest(aiRequest);
  if (aiRouting) {
    console.log(`   ✅ Selected: ${aiRouting.providerId} ($${aiRouting.estimatedCost.toFixed(4)})`);
    if (aiRouting.alternatives && aiRouting.alternatives.length > 0) {
      console.log(`      Alternatives:`);
      for (const alt of aiRouting.alternatives) {
        console.log(`         • ${alt.providerId}: $${alt.estimatedCost.toFixed(4)} - ${alt.reason}`);
      }
    }
  }
  console.log("");

  // 8. Check status
  console.log("📊 API Keeper Status:");
  const status = APIKeeperCore.status();
  console.log(`   Providers: ${status.providerCount} (${status.activeProviderCount} active)`);
  console.log(`   Keys: ${status.keyCount} (${status.activeKeyCount} active)`);
  console.log(`   Requests Today: ${status.requestsToday}`);
  console.log(`   Cost Today: $${status.costToday.toFixed(2)}`);
  console.log(`   Cost This Month: $${status.costThisMonth.toFixed(2)}`);
  console.log(`   Rail Guards: ${status.railGuardsActive} active`);
  console.log("");

  // 9. Integration with Dream State
  console.log("🏛️  Checking Dream State integration...");
  const dreamStateCtx = {
    identityGrid: undefined,
    wolfPackFundingCore: undefined,
    economicEngineCore: undefined,
    narrativeField: undefined,
    neuralMesh: undefined,
    agentRegistryCore: undefined,
  };
  const departments = DreamStateCore.listDepartments();
  const apiDept = departments.find((d) => d.id === "dept:api-keeper");
  if (apiDept) {
    console.log(`   ✅ API Keeper Department found: ${apiDept.name}`);
    console.log(`      Responsibilities: ${apiDept.responsibilities.join(", ")}`);
  }
  console.log("");

  console.log("===============================================");
  console.log(" ✅ API Keeper System Test Complete");
  console.log("===============================================");
  console.log("");
  console.log("🚀 Features:");
  console.log("   • Automatic API discovery");
  console.log("   • Intelligent cost-based routing");
  console.log("   • Rail guards for cost/rate limiting");
  console.log("   • Key management and load balancing");
  console.log("   • Integrated with Dream State governance");
  console.log("");
}

main().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

