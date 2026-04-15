/**
 * Wolf Pack End-to-End Test
 * 
 * Runs the complete Wolf Pack funding flow:
 * 1. Seed a test lead
 * 2. Run funding cycle (lead → queue)
 * 3. Run mailer (queue → real email)
 * 
 * Usage:
 *   tsx scripts/runWolfpackEndToEndTest.ts
 *   or
 *   pnpm wolfpack:test
 * 
 * Requires:
 *   - TEST_LEAD_EMAIL in .env (email to receive test email)
 *   - WOLFMAIL_SMTP_PASS in .env (Gmail App Password)
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";

// Minimal context for WolfPackFundingCore (same as used in other test scripts)
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
  console.log(" Wolf Pack End-to-End Test");
  console.log("===============================================");
  console.log("");

  // Validate environment variables
  const testLeadEmail = process.env.TEST_LEAD_EMAIL;
  const fromEmail = process.env.WOLFMAIL_FROM_EMAIL || "dreamnetgeo@gmail.com";

  if (!testLeadEmail || testLeadEmail === "YOUR_PERSONAL_EMAIL@example.com") {
    console.error("❌ ERROR: TEST_LEAD_EMAIL is not set or is still the placeholder.");
    console.error("");
    console.error("Please set TEST_LEAD_EMAIL in your .env file:");
    console.error("  TEST_LEAD_EMAIL=your-email@example.com");
    console.error("");
    process.exit(1);
  }

  if (!process.env.WOLFMAIL_SMTP_PASS) {
    console.error("❌ ERROR: WOLFMAIL_SMTP_PASS is not set.");
    console.error("");
    console.error("Please set WOLFMAIL_SMTP_PASS in your .env file:");
    console.error("  WOLFMAIL_SMTP_PASS=your-gmail-app-password");
    console.error("");
    console.error("Note: This must be a Gmail App Password, not your regular password.");
    console.error("See .env.example for instructions on creating one.");
    console.error("");
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
  console.log(`   Test lead email: ${testLeadEmail}`);
  console.log(`   From email: ${fromEmail}`);
  console.log("");

  // ============================================
  // Step 1: Seed Test Lead
  // ============================================
  console.log("📝 Step 1: Seeding test lead...");
  
  const initialStatus = WolfPackFundingCore.status();
  console.log(`   Initial state: ${initialStatus.leadCount} leads, ${initialStatus.queueCount} queue items`);

  WolfPackFundingCore.upsertLead({
    id: "lead:test-self",
    name: "Test Self Lead",
    type: "angel",
    email: testLeadEmail,
    tags: ["test", "ai", "infra"],
    stage: "new",
  });

  const afterSeedStatus = WolfPackFundingCore.status();
  console.log(`   ✅ Seeded lead: ${testLeadEmail}`);
  console.log(`   Current lead count: ${afterSeedStatus.leadCount}`);
  console.log("");

  // ============================================
  // Step 2: Run Funding Cycle
  // ============================================
  console.log("🔄 Step 2: Running funding cycle (lead → queue)...");
  
  const beforeFunding = WolfPackFundingCore.status();
  console.log("   Before funding run:", {
    leadCount: beforeFunding.leadCount,
    queueCount: beforeFunding.queueCount,
    pendingCount: beforeFunding.pendingCount,
  });

  const afterFunding = WolfPackFundingCore.run(ctx);

  console.log("   After funding run:", {
    leadCount: afterFunding.leadCount,
    queueCount: afterFunding.queueCount,
    pendingCount: afterFunding.pendingCount,
  });

  if (afterFunding.sampleQueue.length > 0) {
    const firstQueueItem = afterFunding.sampleQueue[0];
    console.log(`   ✅ Queue item generated:`);
    console.log(`      ID: ${firstQueueItem.id}`);
    console.log(`      To: ${firstQueueItem.toEmail}`);
    console.log(`      Subject: ${firstQueueItem.subject.substring(0, 50)}...`);
    console.log(`      Status: ${firstQueueItem.status}`);
  } else {
    console.log("   ⚠️  No queue items generated (this may be expected if lead scoring didn't qualify it)");
  }
  console.log("");

  // ============================================
  // Step 3: Run Mailer
  // ============================================
  console.log("📧 Step 3: Processing send queue (queue → real email)...");
  
  const beforeMailer = WolfPackFundingCore.status();
  console.log("   Queue before mailer:", {
    queueCount: beforeMailer.queueCount,
    pendingCount: beforeMailer.pendingCount,
  });

  if (beforeMailer.pendingCount === 0) {
    console.log("   ⚠️  No pending emails to send. Skipping mailer step.");
    console.log("   (This is normal if the funding cycle didn't generate queue items)");
  } else {
    console.log("   Processing send queue once...");
    await WolfPackMailerCore.processSendQueueOnce();

    const afterMailer = WolfPackFundingCore.status();
    console.log("   Queue after mailer:", {
      queueCount: afterMailer.queueCount,
      pendingCount: afterMailer.pendingCount,
    });

    if (afterMailer.pendingCount < beforeMailer.pendingCount) {
      const sentCount = beforeMailer.pendingCount - afterMailer.pendingCount;
      console.log(`   ✅ Successfully sent ${sentCount} email(s)`);
    } else {
      console.log("   ⚠️  No emails were sent (check SMTP configuration and logs above)");
    }
  }
  console.log("");

  // ============================================
  // Final Summary
  // ============================================
  console.log("===============================================");
  console.log(" End-to-End Test Complete");
  console.log("===============================================");
  console.log("");
  console.log("📊 Final Status:");
  const finalStatus = WolfPackFundingCore.status();
  console.log(`   Leads: ${finalStatus.leadCount}`);
  console.log(`   Queue Items: ${finalStatus.queueCount}`);
  console.log(`   Pending: ${finalStatus.pendingCount}`);
  console.log(`   Hot Leads: ${finalStatus.hotLeadCount}`);
  console.log("");
  console.log("📬 Next Steps:");
  console.log(`   1. Check your inbox: ${testLeadEmail}`);
  console.log(`   2. Look for email from: ${fromEmail}`);
  console.log(`   3. Subject should mention "DreamNet" or "Partnership"`);
  console.log("");
  console.log("💡 If you didn't receive an email:");
  console.log("   - Check spam/junk folder");
  console.log("   - Verify WOLFMAIL_SMTP_PASS is correct (Gmail App Password)");
  console.log("   - Check console logs above for errors");
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Wolf Pack end-to-end test error:", err);
  console.error("");
  process.exit(1);
});

