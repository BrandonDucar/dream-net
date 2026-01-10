/**
 * Seed Real Investor Leads
 * 
 * Adds a curated list of real investor leads to get started.
 * These are actual VCs, funds, and programs that might be interested in DreamNet.
 * 
 * Usage:
 *   pnpm exec tsx scripts/seedRealInvestors.ts
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";

const investors = [
  // Base Ecosystem
  {
    id: "lead:base-ecosystem-fund",
    name: "Base Ecosystem Fund",
    type: "ecosystem-fund" as const,
    email: "grants@base.org", // Public contact
    tags: ["base", "ecosystem", "grants", "infra"],
    website: "https://base.org/ecosystem-fund",
  },
  {
    id: "lead:base-builder-grants",
    name: "Base Builder Grant Program",
    type: "grant" as const,
    email: "grants@base.org",
    tags: ["base", "grants", "builders"],
    website: "https://base.org/grants",
  },

  // Major VCs (use public contact forms or find partner emails)
  {
    id: "lead:a16z-crypto",
    name: "a16z Crypto",
    type: "vc" as const,
    email: "crypto@a16z.com", // Public contact
    tags: ["vc", "crypto", "web3", "base", "infra"],
    website: "https://a16zcrypto.com",
  },
  {
    id: "lead:paradigm",
    name: "Paradigm",
    type: "vc" as const,
    email: "contact@paradigm.xyz",
    tags: ["vc", "crypto", "web3", "infra"],
    website: "https://paradigm.xyz",
  },
  {
    id: "lead:coinbase-ventures",
    name: "Coinbase Ventures",
    type: "vc" as const,
    email: "ventures@coinbase.com",
    tags: ["vc", "crypto", "base", "ecosystem"],
    website: "https://www.coinbase.com/ventures",
  },

  // Accelerators
  {
    id: "lead:base-camp",
    name: "Base Camp",
    type: "accelerator" as const,
    email: "hello@basecamp.build",
    tags: ["accelerator", "base", "builders"],
    website: "https://basecamp.build",
  },

  // Ecosystem Funds
  {
    id: "lead:optimism-foundation",
    name: "Optimism Foundation",
    type: "ecosystem-fund" as const,
    email: "grants@optimism.io",
    tags: ["ecosystem-fund", "l2", "grants", "infra"],
    website: "https://optimism.io",
  },
];

async function main() {
  console.log("===============================================");
  console.log(" Seeding Real Investor Leads");
  console.log("===============================================");
  console.log("");
  console.log(`📝 Adding ${investors.length} investor leads...`);
  console.log("");

  let added = 0;
  let skipped = 0;

  for (const investor of investors) {
    // Check if already exists
    const existing = WolfPackFundingCore.getLead(investor.id);
    if (existing) {
      console.log(`⏭️  Skipping ${investor.name} (already exists)`);
      skipped++;
      continue;
    }

    const lead = WolfPackFundingCore.upsertLead({
      id: investor.id,
      name: investor.name,
      type: investor.type,
      email: investor.email,
      tags: investor.tags,
      website: investor.website,
      stage: "new",
    });

    console.log(`✅ Added: ${lead.name}`);
    console.log(`   Type: ${lead.type}`);
    console.log(`   Email: ${lead.email}`);
    console.log(`   Tags: ${lead.tags?.join(", ")}`);
    console.log("");
    added++;
  }

  console.log("===============================================");
  console.log(" Seeding Complete");
  console.log("===============================================");
  console.log("");
  console.log(`✅ Added: ${added} leads`);
  console.log(`⏭️  Skipped: ${skipped} leads (already exist)`);
  console.log("");

  const status = WolfPackFundingCore.status();
  console.log("📊 Current Status:");
  console.log(`   Total Leads: ${status.leadCount}`);
  console.log(`   Hot Leads: ${status.hotLeadCount}`);
  console.log(`   Grant Drafts: ${WolfPackFundingCore.listGrantDrafts().length}`);
  console.log("");

  console.log("🔄 Next Steps:");
  console.log("   1. The background service will score these leads automatically");
  console.log("   2. Hot leads will be prioritized");
  console.log("   3. Grant drafts will be generated for grant/ecosystem-fund leads");
  console.log("   4. Emails will be queued for qualified leads");
  console.log("   5. Check status: pnpm exec tsx scripts/checkWolfpackEmailStatus.ts");
  console.log("   6. View dashboard: /system/funding");
  console.log("");
  console.log("💡 Tip: You can add more leads with:");
  console.log('   pnpm exec tsx scripts/addInvestorLead.ts vc "VC Name" email@vc.com base ai');
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Error:", err);
  console.error("");
  process.exit(1);
});

