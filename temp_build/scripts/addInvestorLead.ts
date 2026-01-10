/**
 * Add Investor Lead
 * 
 * Quick script to add real investor leads to the Wolf Pack system.
 * 
 * Usage:
 *   pnpm exec tsx scripts/addInvestorLead.ts <type> <name> <email> [tags...]
 * 
 * Examples:
 *   pnpm exec tsx scripts/addInvestorLead.ts vc "a16z Crypto" partner@a16z.com base ai infra
 *   pnpm exec tsx scripts/addInvestorLead.ts ecosystem-fund "Base Ecosystem Fund" grants@base.org base grants
 *   pnpm exec tsx scripts/addInvestorLead.ts angel "John Doe" john@example.com ai web3
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import type { LeadType } from "@dreamnet/wolfpack-funding-core";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log("===============================================");
    console.log(" Add Investor Lead to Wolf Pack");
    console.log("===============================================");
    console.log("");
    console.log("Usage:");
    console.log("  pnpm exec tsx scripts/addInvestorLead.ts <type> <name> <email> [tags...]");
    console.log("");
    console.log("Types:");
    console.log("  vc, angel, grant, accelerator, ecosystem-fund, dao, other");
    console.log("");
    console.log("Examples:");
    console.log('  pnpm exec tsx scripts/addInvestorLead.ts vc "a16z Crypto" partner@a16z.com base ai infra');
    console.log('  pnpm exec tsx scripts/addInvestorLead.ts ecosystem-fund "Base Ecosystem Fund" grants@base.org base grants');
    console.log('  pnpm exec tsx scripts/addInvestorLead.ts grant "Base Builder Grant" grants@base.org base');
    console.log("");
    process.exit(1);
  }

  const [typeStr, name, email, ...tagArgs] = args;
  const type = typeStr as LeadType;
  const tags = tagArgs.length > 0 ? tagArgs : [];

  // Validate type
  const validTypes: LeadType[] = ["vc", "angel", "grant", "accelerator", "ecosystem-fund", "dao", "other"];
  if (!validTypes.includes(type)) {
    console.error(`❌ Invalid type: ${type}`);
    console.error(`   Valid types: ${validTypes.join(", ")}`);
    process.exit(1);
  }

  // Generate lead ID from name
  const leadId = `lead:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

  console.log("===============================================");
  console.log(" Adding Investor Lead");
  console.log("===============================================");
  console.log("");
  console.log("📝 Lead Details:");
  console.log(`   ID: ${leadId}`);
  console.log(`   Name: ${name}`);
  console.log(`   Type: ${type}`);
  console.log(`   Email: ${email}`);
  console.log(`   Tags: ${tags.length > 0 ? tags.join(", ") : "none"}`);
  console.log("");

  // Add the lead
  const lead = WolfPackFundingCore.upsertLead({
    id: leadId,
    name,
    type,
    email,
    tags: tags.length > 0 ? tags : undefined,
    stage: "new",
  });

  console.log("✅ Lead added successfully!");
  console.log("");
  console.log("🔄 Next Steps:");
  console.log("   1. The background service will score this lead in the next cycle (30 min)");
  console.log("   2. If qualified, an email will be queued automatically");
  console.log("   3. Check status: pnpm exec tsx scripts/checkWolfpackEmailStatus.ts");
  console.log("   4. View dashboard: /system/funding");
  console.log("");

  // If it's a grant/ecosystem-fund/accelerator, mention grant drafts
  if (type === "grant" || type === "ecosystem-fund" || type === "accelerator") {
    console.log("📝 Note: Grant application draft will be auto-generated!");
    console.log("");
  }
}

main().catch((err) => {
  console.error("");
  console.error("❌ Error:", err);
  console.error("");
  process.exit(1);
});

