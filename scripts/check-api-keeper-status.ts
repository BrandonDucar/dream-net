/**
 * Check API Keeper Status
 * See what APIs are discovered, what keys are registered, and how routing works
 */

// Set NODE_ENV before importing
process.env.NODE_ENV = process.env.NODE_ENV || "development";

async function checkAPIKeeperStatus() {
  console.log("=".repeat(70));
  console.log("🔑 API KEEPER STATUS CHECK");
  console.log("=".repeat(70));
  console.log("");

  try {
    // Import API Keeper
    const { APIKeeperCore } = await import("../packages/api-keeper-core/index.js");
    
    // Force discovery to catch any new keys
    console.log("🔍 Running auto-discovery...\n");
    const discoveredKeys = APIKeeperCore.forceDiscovery();
    console.log(`   ✅ Discovered ${discoveredKeys.length} API key(s)\n`);

    // Get status
    const status = APIKeeperCore.status();
    
    // List providers
    console.log("📋 API Providers:\n");
    const providers = APIKeeperCore.listProviders();
    if (providers.length === 0) {
      console.log("   ⚠️  No providers registered yet");
    } else {
      providers.forEach((provider: any) => {
        console.log(`   ✅ ${provider.id} (${provider.name || "N/A"})`);
        console.log(`      Cost: $${provider.costPerRequest || "N/A"} per request`);
        console.log(`      Quality: ${provider.qualityScore || "N/A"}/10`);
        console.log(`      Status: ${provider.status || "active"}`);
      });
    }
    console.log("");

    // List keys
    console.log("🔑 Registered API Keys:\n");
    const allKeys = APIKeeperCore.listKeys();
    if (allKeys.length === 0) {
      console.log("   ⚠️  No keys registered yet");
    } else {
      // Group by provider
      const keysByProvider = new Map<string, any[]>();
      allKeys.forEach((key: any) => {
        if (!keysByProvider.has(key.providerId)) {
          keysByProvider.set(key.providerId, []);
        }
        keysByProvider.get(key.providerId)!.push(key);
      });

      keysByProvider.forEach((keys, providerId) => {
        console.log(`   ${providerId}:`);
        keys.forEach((key: any) => {
          const keyPreview = key.key ? `${key.key.substring(0, 12)}...` : "N/A";
          console.log(`      - ${key.name || key.id}`);
          console.log(`        Key: ${keyPreview}`);
          console.log(`        Status: ${key.status || "active"}`);
          console.log(`        Tags: ${key.tags?.join(", ") || "none"}`);
          if (key.usage) {
            console.log(`        Usage: ${key.usage.totalRequests || 0} requests`);
            console.log(`        Cost: $${(key.usage.totalCost || 0).toFixed(2)}`);
          }
        });
      });
    }
    console.log("");

    // Check intelligent routing
    console.log("🧭 Intelligent Routing:\n");
    console.log("   API Keeper automatically chooses APIs based on:");
    console.log("   ✅ Cost (chooses cheapest that meets requirements)");
    console.log("   ✅ Quality (considers reliability and quality scores)");
    console.log("   ✅ Quota (routes to keys with remaining quota)");
    console.log("   ✅ Load balancing (distributes across multiple keys)");
    console.log("");

    // Check rail guards
    console.log("🛡️  Rail Guards (Safety Limits):\n");
    const guards = APIKeeperCore.listRailGuards();
    if (guards.length === 0) {
      console.log("   ⚠️  No rail guards configured");
    } else {
      guards.forEach((guard: any) => {
        console.log(`   ✅ ${guard.name || guard.id}`);
        console.log(`      Type: ${guard.type}`);
        if (guard.dailyLimit) console.log(`      Daily Limit: $${guard.dailyLimit}`);
        if (guard.monthlyLimit) console.log(`      Monthly Limit: $${guard.monthlyLimit}`);
        if (guard.rateLimit) console.log(`      Rate Limit: ${guard.rateLimit} requests/min`);
      });
    }
    console.log("");

    // Check environment variables that would be discovered
    console.log("🔍 Environment Variables (Auto-Discovery Sources):\n");
    const envKeys = [
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TELEGRAM_BOT_TOKEN",
      "TWITTER_BEARER_TOKEN",
      "TWITTER_API_KEY",
      "GITHUB_TOKEN",
      "VERCEL_TOKEN",
      "SENDGRID_API_KEY",
      "STRIPE_SECRET_KEY",
      "DATABASE_URL",
    ];

    envKeys.forEach((key) => {
      const value = process.env[key];
      if (value) {
        const preview = value.substring(0, 12) + "...";
        console.log(`   ✅ ${key}: ${preview}`);
      } else {
        console.log(`   ❌ ${key}: Not set`);
      }
    });
    console.log("");

    // Summary
    console.log("=".repeat(70));
    console.log("✅ API KEEPER STATUS");
    console.log("=".repeat(70));
    console.log("");
    console.log(`   Providers: ${providers.length}`);
    console.log(`   Keys: ${allKeys.length}`);
    console.log(`   Guards: ${guards.length}`);
    console.log("");
    console.log("💡 API Keeper automatically:");
    console.log("   - Discovers keys from environment variables");
    console.log("   - Routes requests intelligently (cost + quality)");
    console.log("   - Enforces rail guards (safety limits)");
    console.log("   - Load balances across multiple keys");
    console.log("   - Tracks usage and costs");
    console.log("");
    console.log("🚀 You don't need to manually configure anything!");
    console.log("   Just add keys to .env and API Keeper finds them automatically.");
    console.log("");

  } catch (error: any) {
    console.error("❌ Error checking API Keeper:", error.message);
    console.error(error.stack);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkAPIKeeperStatus().catch(console.error);
}

