/**
 * Qualify and Queue Investor Emails
 * 
 * Manually qualifies investor leads and queues emails for them.
 * Useful for getting started quickly with real outreach.
 * 
 * Usage:
 *   pnpm exec tsx scripts/qualifyAndQueueInvestors.ts
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";

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
  console.log(" Qualify & Queue Investor Emails");
  console.log("===============================================");
  console.log("");

  const allLeads = WolfPackFundingCore.listLeads();
  console.log(`📝 Found ${allLeads.length} leads`);
  console.log("");

  // Qualify leads with emails
  const leadsWithEmail = allLeads.filter(l => l.email && l.stage === "new");
  console.log(`🔄 Qualifying ${leadsWithEmail.length} leads with emails...`);
  console.log("");

  let qualified = 0;
  for (const lead of leadsWithEmail) {
    // Score the lead first
    const { scoreLead } = await import("@dreamnet/wolfpack-funding-core/logic/scoringEngine");
    const scored = scoreLead(ctx, lead);
    
    // Force qualify by setting stage
    const qualifiedLead = WolfPackFundingCore.upsertLead({
      ...scored,
      stage: "qualified",
    });

    console.log(`   ✅ ${qualifiedLead.name}`);
    console.log(`      Hot Score: ${qualifiedLead.hotScore?.toFixed(2) ?? "N/A"}`);
    console.log(`      Is Hot: ${qualifiedLead.isHot ? "🔥 YES" : "No"}`);
    console.log(`      Priority: ${qualifiedLead.priorityScore?.toFixed(2) ?? "N/A"}`);
    qualified++;
  }
  console.log("");

  // Run funding cycle to generate emails
  console.log("📧 Running funding cycle to queue emails...");
  const beforeQueue = WolfPackFundingCore.listQueue().filter(q => q.status === "pending").length;
  
  WolfPackFundingCore.run(ctx);
  
  const afterQueue = WolfPackFundingCore.listQueue().filter(q => q.status === "pending");
  const queued = afterQueue.length - beforeQueue;

  console.log(`   ✅ Queued ${queued} new email(s)`);
  console.log("");

  if (afterQueue.length > 0) {
    console.log("📬 Queued Emails:");
    afterQueue.forEach(item => {
      const lead = allLeads.find(l => l.id === item.leadId);
      console.log(`   - ${lead?.name || item.leadId}`);
      console.log(`     To: ${item.toEmail}`);
      console.log(`     Subject: ${item.subject.substring(0, 60)}...`);
    });
    console.log("");
    console.log("💡 To send these emails:");
    console.log("   pnpm exec tsx scripts/runWolfpackMailerOnce.ts");
    console.log("");
  }

  const status = WolfPackFundingCore.status();
  console.log("📊 Final Status:");
  console.log(`   Leads: ${status.leadCount}`);
  console.log(`   Hot Leads: ${status.hotLeadCount}`);
  console.log(`   Queue Items: ${status.queueCount}`);
  console.log(`   Pending: ${status.pendingCount}`);
  console.log(`   Grant Drafts: ${WolfPackFundingCore.listGrantDrafts().length}`);
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Error:", err);
  console.error("");
  process.exit(1);
});

