/**
 * Launch Investor Outreach
 * 
 * Complete script that:
 * 1. Seeds real investor leads
 * 2. Scores and qualifies them
 * 3. Generates grant drafts
 * 4. Queues emails
 * 5. Optionally sends emails
 * 
 * Usage:
 *   pnpm exec tsx scripts/launchInvestorOutreach.ts [--send]
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";

const investors = [
  {
    id: "lead:base-ecosystem-fund",
    name: "Base Ecosystem Fund",
    type: "ecosystem-fund" as const,
    email: "grants@base.org",
    tags: ["base", "ecosystem", "grants", "infra"],
  },
  {
    id: "lead:base-builder-grants",
    name: "Base Builder Grant Program",
    type: "grant" as const,
    email: "grants@base.org",
    tags: ["base", "grants", "builders"],
  },
  {
    id: "lead:a16z-crypto",
    name: "a16z Crypto",
    type: "vc" as const,
    email: "crypto@a16z.com",
    tags: ["vc", "crypto", "web3", "base", "infra"],
  },
  {
    id: "lead:paradigm",
    name: "Paradigm",
    type: "vc" as const,
    email: "contact@paradigm.xyz",
    tags: ["vc", "crypto", "web3", "infra"],
  },
  {
    id: "lead:coinbase-ventures",
    name: "Coinbase Ventures",
    type: "vc" as const,
    email: "ventures@coinbase.com",
    tags: ["vc", "crypto", "base", "ecosystem"],
  },
  {
    id: "lead:base-camp",
    name: "Base Camp",
    type: "accelerator" as const,
    email: "hello@basecamp.build",
    tags: ["accelerator", "base", "builders"],
  },
  {
    id: "lead:optimism-foundation",
    name: "Optimism Foundation",
    type: "ecosystem-fund" as const,
    email: "grants@optimism.io",
    tags: ["ecosystem-fund", "l2", "grants", "infra"],
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

const shouldSend = process.argv.includes("--send");

async function main() {
  console.log("===============================================");
  console.log(" 🚀 Launch Investor Outreach");
  console.log("===============================================");
  console.log("");

  // Step 1: Seed leads
  console.log("📝 Step 1: Adding investor leads...");
  for (const investor of investors) {
    const lead = WolfPackFundingCore.upsertLead({
      id: investor.id,
      name: investor.name,
      type: investor.type,
      email: investor.email,
      tags: investor.tags,
      stage: "new",
    });
    console.log(`   ✅ ${lead.name}`);
  }
  console.log("");

  // Step 2: Run funding cycle to score leads
  console.log("🔄 Step 2: Scoring leads...");
  WolfPackFundingCore.run(ctx);
  
  // Step 3: Manually qualify all leads with emails (for real outreach)
  console.log("✅ Step 3: Qualifying leads for outreach...");
  const allLeads = WolfPackFundingCore.listLeads();
  for (const lead of allLeads) {
    if (lead.email && lead.stage === "new") {
      const qualified = WolfPackFundingCore.upsertLead({
        ...lead,
        stage: "qualified",
      });
      console.log(`   ✅ ${qualified.name} - Hot: ${qualified.isHot ? "🔥" : "No"}, Score: ${qualified.hotScore?.toFixed(2) ?? "N/A"}`);
    }
  }
  console.log("");

  // Step 4: Run funding cycle again to queue emails for qualified leads
  console.log("📧 Step 4: Queuing emails for qualified leads...");
  const beforeStatus = WolfPackFundingCore.status();
  WolfPackFundingCore.run(ctx);
  const afterStatus = WolfPackFundingCore.status();
  
  const queued = afterStatus.queueCount - beforeStatus.queueCount;
  console.log(`   ✅ Queued ${queued} email(s)`);
  console.log(`   ✅ Generated ${WolfPackFundingCore.listGrantDrafts().length} grant draft(s)`);
  
  // Re-fetch to get updated leads
  const updatedLeads = WolfPackFundingCore.listLeads();
  const hotLeads = updatedLeads.filter(l => l.isHot === true);
  if (hotLeads.length > 0) {
    console.log(`   🔥 Hot Leads: ${hotLeads.length}`);
  }
  console.log("");

  // Step 5: Show summary
  const queue = WolfPackFundingCore.listQueue();
  const pending = queue.filter(q => q.status === "pending");
  const finalHotLeads = updatedLeads.filter(l => l.isHot === true);

  console.log("📊 Summary:");
  console.log(`   Total Leads: ${afterStatus.leadCount}`);
  console.log(`   Hot Leads: ${hotLeads.length}`);
  console.log(`   Pending Emails: ${pending.length}`);
  console.log(`   Grant Drafts: ${WolfPackFundingCore.listGrantDrafts().length}`);
  console.log("");

  if (pending.length > 0) {
    console.log("📬 Queued Emails:");
    pending.forEach(item => {
      const lead = allLeads.find(l => l.id === item.leadId);
      console.log(`   - ${lead?.name || item.leadId} → ${item.toEmail}`);
    });
    console.log("");

    if (shouldSend) {
      console.log("📤 Step 4: Sending emails...");
      await WolfPackMailerCore.processSendQueueOnce();
      console.log("   ✅ Emails sent!");
      console.log("");
    } else {
      console.log("💡 To send these emails:");
      console.log("   pnpm exec tsx scripts/launchInvestorOutreach.ts --send");
      console.log("   or");
      console.log("   pnpm exec tsx scripts/runWolfpackMailerOnce.ts");
      console.log("");
    }
  }

  if (finalHotLeads.length > 0) {
    console.log("🔥 Hot Leads (prioritized):");
    finalHotLeads.forEach(lead => {
      console.log(`   - ${lead.name} (Score: ${lead.hotScore?.toFixed(2)})`);
    });
    console.log("");
  }

  console.log("✅ Investor outreach launched!");
  console.log("");
  console.log("🔄 Background service will continue processing every 30 minutes");
  console.log("📊 View dashboard: /system/funding");
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Error:", err);
  console.error("");
  process.exit(1);
});

