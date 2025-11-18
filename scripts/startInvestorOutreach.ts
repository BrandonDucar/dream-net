/**
 * Start Investor Outreach
 * 
 * Seeds real investor leads and immediately runs the funding cycle
 * to score them, generate drafts, and queue emails.
 * 
 * Usage:
 *   pnpm exec tsx scripts/startInvestorOutreach.ts
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";

const investors = [
  // Base Ecosystem
  {
    id: "lead:base-ecosystem-fund",
    name: "Base Ecosystem Fund",
    type: "ecosystem-fund" as const,
    email: "grants@base.org",
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

  // Major VCs
  {
    id: "lead:a16z-crypto",
    name: "a16z Crypto",
    type: "vc" as const,
    email: "crypto@a16z.com",
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

const ctx = {
  reputationLattice: undefined,
  fieldLayer: undefined,
  dreamTankCore: undefined,
  economicEngineCore: undefined,
  narrativeField: undefined,
  agentRegistryCore: undefined,
  neuralMesh: undefined,
};

async function main() {
  console.log("===============================================");
  console.log(" 🚀 Starting Investor Outreach");
  console.log("===============================================");
  console.log("");

  // Step 1: Seed leads
  console.log("📝 Step 1: Adding investor leads...");
  let added = 0;
  for (const investor of investors) {
    const existing = WolfPackFundingCore.getLead(investor.id);
    if (existing) {
      console.log(`   ⏭️  ${investor.name} (already exists)`);
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

    console.log(`   ✅ ${lead.name}`);
    added++;
  }
  console.log(`   Total: ${added} new leads added`);
  console.log("");

  // Step 2: Run funding cycle
  console.log("🔄 Step 2: Running funding cycle (scoring, drafting, queueing)...");
  const beforeStatus = WolfPackFundingCore.status();
  console.log(`   Before: ${beforeStatus.leadCount} leads, ${beforeStatus.queueCount} queue items`);

  const afterStatus = WolfPackFundingCore.run(ctx);

  console.log(`   After: ${afterStatus.leadCount} leads, ${afterStatus.queueCount} queue items`);
  console.log(`   Hot Leads: ${afterStatus.hotLeadCount}`);
  console.log(`   Grant Drafts: ${WolfPackFundingCore.listGrantDrafts().length}`);
  console.log("");

  // Step 3: Show hot leads
  const allLeads = WolfPackFundingCore.listLeads();
  const hotLeads = allLeads.filter(l => l.isHot === true);
  if (hotLeads.length > 0) {
    console.log("🔥 Step 3: Hot leads detected:");
    hotLeads.forEach(lead => {
      console.log(`   - ${lead.name}`);
      console.log(`     Hot Score: ${lead.hotScore?.toFixed(2)}`);
      console.log(`     Priority: ${lead.priorityScore?.toFixed(2)}`);
      console.log(`     Type: ${lead.type}`);
    });
    console.log("");
  }

  // Step 4: Show queue
  const queue = WolfPackFundingCore.listQueue();
  const pending = queue.filter(q => q.status === "pending");
  if (pending.length > 0) {
    console.log("📧 Step 4: Emails queued for sending:");
    pending.forEach(item => {
      const lead = allLeads.find(l => l.id === item.leadId);
      console.log(`   - ${lead?.name || item.leadId}`);
      console.log(`     To: ${item.toEmail}`);
      console.log(`     Subject: ${item.subject.substring(0, 60)}...`);
    });
    console.log("");
    console.log("💡 These emails will be sent by the background service");
    console.log("   (or run: pnpm exec tsx scripts/runWolfpackMailerOnce.ts)");
    console.log("");
  } else {
    console.log("📧 Step 4: No emails queued yet");
    console.log("   (Leads may need higher scores to qualify)");
    console.log("");
  }

  // Step 5: Show grant drafts
  const grantDrafts = WolfPackFundingCore.listGrantDrafts();
  if (grantDrafts.length > 0) {
    console.log("📝 Step 5: Grant drafts generated:");
    grantDrafts.forEach(draft => {
      const lead = allLeads.find(l => l.id === draft.leadId);
      console.log(`   - ${draft.title}`);
      console.log(`     For: ${lead?.name || draft.leadId}`);
    });
    console.log("");
  }

  console.log("===============================================");
  console.log(" ✅ Investor Outreach Started!");
  console.log("===============================================");
  console.log("");
  console.log("📊 Summary:");
  console.log(`   Leads: ${afterStatus.leadCount}`);
  console.log(`   Hot Leads: ${afterStatus.hotLeadCount}`);
  console.log(`   Queue Items: ${afterStatus.queueCount}`);
  console.log(`   Pending Emails: ${pending.length}`);
  console.log(`   Grant Drafts: ${grantDrafts.length}`);
  console.log("");
  console.log("🔄 Next Steps:");
  console.log("   1. Background service will process leads every 30 minutes");
  console.log("   2. Emails will be sent automatically (respects 50/day limit)");
  console.log("   3. Follow-ups will be scheduled 5 days after contact");
  console.log("   4. Check status: pnpm exec tsx scripts/checkWolfpackEmailStatus.ts");
  console.log("   5. View dashboard: /system/funding");
  console.log("");
  console.log("💡 To send emails immediately:");
  console.log("   pnpm exec tsx scripts/runWolfpackMailerOnce.ts");
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Error:", err);
  console.error("");
  process.exit(1);
});

