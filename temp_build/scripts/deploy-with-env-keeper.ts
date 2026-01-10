/**
 * Deploy DreamNet with Env Keeper
 * Automatically syncs and deploys with all environment variables managed
 */

import { EnvKeeperCore } from "@dreamnet/env-keeper-core";

async function deploy() {
  console.log("\n🚀 DreamNet Deployment with Env Keeper\n");
  console.log("=" .repeat(60));

  // 1. Initialize Env Keeper
  console.log("\n1️⃣ Initializing Env Keeper...");
  await EnvKeeperCore.init();
  const status = EnvKeeperCore.status();
  console.log(`   ✅ Discovered ${status.totalVars} environment variable(s)`);
  console.log(`   🔒 ${status.secretsCount} secret(s) encrypted`);

  // 2. Generate .env file
  console.log("\n2️⃣ Generating .env file...");
  const envContent = EnvKeeperCore.generateEnvFile("production", true);
  console.log("   ✅ .env file generated");
  console.log("\n" + envContent);

  // 3. Check required variables
  console.log("\n3️⃣ Checking required variables...");
  const required = [
    "DATABASE_URL",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
  ];

  const missing: string[] = [];
  for (const key of required) {
    const envVar = EnvKeeperCore.get(key);
    if (!envVar) {
      missing.push(key);
      console.log(`   ⚠️  Missing: ${key}`);
    } else {
      console.log(`   ✅ Found: ${key}`);
    }
  }

  if (missing.length > 0) {
    console.log(`\n⚠️  Missing ${missing.length} required variable(s)`);
    console.log("   Set them via: POST /api/env-keeper/set");
    console.log("   Or add to your secrets manager");
  } else {
    console.log("\n✅ All required variables found!");
  }

  // 4. Export for deployment
  console.log("\n4️⃣ Exporting for deployment...");
  const exportData = EnvKeeperCore.export(false); // Don't decrypt for export
  console.log(`   ✅ Exported ${exportData.variables.length} variable(s)`);

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Deployment ready!");
  console.log("\nNext steps:");
  console.log("  1. Review generated .env file");
  console.log("  2. Set missing variables via Env Keeper API");
  console.log("  3. Deploy to Vercel/production");
  console.log("\n");
}

deploy().catch(console.error);

