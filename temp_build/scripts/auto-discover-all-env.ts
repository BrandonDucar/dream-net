/**
 * Auto-Discover ALL Environment Variables
 * Finds every .env file and all process.env vars
 * No manual entry needed!
 */

import { EnvKeeperCore } from "../packages/env-keeper-core";

async function autoDiscover() {
  console.log("\n🔍 Auto-Discovering ALL Environment Variables...\n");
  console.log("=" .repeat(60));

  // Initialize Env Keeper (auto-discovers everything)
  await EnvKeeperCore.init();
  
  const status = EnvKeeperCore.status();
  const vars = EnvKeeperCore.list(false); // Don't decrypt for listing

  console.log(`\n✅ Discovered ${status.totalVars} environment variable(s)`);
  console.log(`🔒 ${status.secretsCount} secret(s)`);
  console.log(`📊 Categories:`);
  
  for (const [category, count] of Object.entries(status.categories)) {
    console.log(`   ${category}: ${count}`);
  }

  console.log("\n📋 All Environment Variables:\n");
  
  // Group by category
  const byCategory: Record<string, typeof vars> = {};
  for (const envVar of vars) {
    if (!byCategory[envVar.category]) {
      byCategory[envVar.category] = [];
    }
    byCategory[envVar.category].push(envVar);
  }

  for (const [category, categoryVars] of Object.entries(byCategory)) {
    console.log(`\n${category.toUpperCase()}:`);
    for (const envVar of categoryVars) {
      const valueDisplay = envVar.isSecret ? "[ENCRYPTED]" : envVar.value.substring(0, 50);
      console.log(`  ${envVar.key} = ${valueDisplay}`);
      if (envVar.description) {
        console.log(`    # ${envVar.description}`);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ All environment variables discovered and stored!");
  console.log("🚀 They're automatically applied to process.env");
  console.log("💡 You never need to manually set env vars again!\n");
}

autoDiscover().catch(console.error);

