/**
 * Test API Key Auto-Discovery & Base Mini-Apps
 */

import { APIKeeperCore } from "@dreamnet/api-keeper-core";
import { BaseMiniApps } from "@dreamnet/base-mini-apps";

async function main() {
  console.log("===============================================");
  console.log(" 🔑 API Key Auto-Discovery Test");
  console.log("===============================================");
  console.log("");

  // Test auto-discovery
  console.log("🔍 Auto-discovering API keys from .env...");
  const discovered = APIKeeperCore.autoDiscoverKeys();
  console.log(`   ✅ Auto-discovered ${discovered.length} key(s)`);
  
  for (const key of discovered) {
    console.log(`      • ${key.name} (${key.providerId})`);
    console.log(`        Tags: ${key.tags?.join(", ") || "none"}`);
  }
  console.log("");

  // Check status
  const status = APIKeeperCore.status();
  console.log("📊 API Keeper Status:");
  console.log(`   Total Keys: ${status.keyCount}`);
  console.log(`   Active Keys: ${status.activeKeyCount}`);
  console.log(`   Providers: ${status.providerCount}`);
  console.log("");

  console.log("===============================================");
  console.log(" 📱 Base Mini-Apps Test");
  console.log("===============================================");
  console.log("");

  // Create default mini-apps
  console.log("🏗️  Creating Base mini-apps...");
  const apps = BaseMiniApps.createDefaultMiniApps();
  console.log(`   ✅ Created ${apps.length} mini-apps`);
  console.log("");

  // List by category
  console.log("📱 Mini-Apps by Category:");
  const categories: Array<{ name: string; count: number }> = [];
  for (const app of apps) {
    const existing = categories.find((c) => c.name === app.category);
    if (existing) {
      existing.count += 1;
    } else {
      categories.push({ name: app.category, count: 1 });
    }
  }

  for (const cat of categories) {
    console.log(`   ${cat.name}: ${cat.count} app(s)`);
    const catApps = apps.filter((a) => a.category === cat.name);
    for (const app of catApps) {
      console.log(`      • ${app.name}`);
      console.log(`        ${app.description}`);
      if (app.integratesWith && app.integratesWith.length > 0) {
        console.log(`        Integrates: ${app.integratesWith.join(", ")}`);
      }
      if (app.requiresPassport) {
        console.log(`        Requires Passport: ${app.passportTier?.join(", ") || "any"}`);
      }
    }
  }
  console.log("");

  // Show governance integration
  console.log("🏛️  Governance Integration:");
  const governanceApps = apps.filter((a) => a.category === "governance");
  console.log(`   ${governanceApps.length} governance app(s)`);
  for (const app of governanceApps) {
    console.log(`      • ${app.name}`);
    console.log(`        Features: ${app.features.join(", ")}`);
  }
  console.log("");

  // Show identity apps
  console.log("🪪 Identity Apps:");
  const identityApps = apps.filter((a) => a.category === "identity");
  console.log(`   ${identityApps.length} identity app(s)`);
  for (const app of identityApps) {
    console.log(`      • ${app.name}`);
    console.log(`        ${app.description}`);
  }
  console.log("");

  // Show utility apps
  console.log("🛠️  Utility Apps:");
  const utilityApps = apps.filter((a) => a.category === "utility");
  console.log(`   ${utilityApps.length} utility app(s)`);
  for (const app of utilityApps) {
    console.log(`      • ${app.name}`);
    console.log(`        Integrates: ${app.integratesWith?.join(", ")}`);
  }
  console.log("");

  console.log("===============================================");
  console.log(" ✅ Test Complete");
  console.log("===============================================");
  console.log("");
  console.log("🚀 Key Features:");
  console.log("   • API keys auto-discovered from .env");
  console.log("   • Never have to manually register keys");
  console.log("   • Base mini-apps ready for deployment");
  console.log("   • Integrated with Dream State governance");
  console.log("   • Passport-gated access");
  console.log("");
  console.log("💡 Next Steps:");
  console.log("   1. Deploy mini-apps to Base (contracts)");
  console.log("   2. Build frontend UIs for each mini-app");
  console.log("   3. Integrate with Dream State passports");
  console.log("   4. Launch on Base ecosystem");
  console.log("");
}

main().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});

