/**
 * Check Wolf Pack Email Status
 * 
 * Diagnoses why emails might not have been received:
 * - Checks queue status
 * - Shows sent/failed emails
 * - Validates SMTP configuration
 * 
 * Usage:
 *   tsx scripts/checkWolfpackEmailStatus.ts
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";

async function main() {
  console.log("===============================================");
  console.log(" Wolf Pack Email Status Check");
  console.log("===============================================");
  console.log("");

  // Check environment variables
  console.log("🔍 Environment Check:");
  const hasSmtpPass = !!process.env.WOLFMAIL_SMTP_PASS;
  const testEmail = process.env.TEST_LEAD_EMAIL;
  const fromEmail = process.env.WOLFMAIL_FROM_EMAIL || "dreamnetgeo@gmail.com";
  
  console.log(`   WOLFMAIL_SMTP_PASS: ${hasSmtpPass ? "✅ Set" : "❌ NOT SET"}`);
  console.log(`   TEST_LEAD_EMAIL: ${testEmail || "❌ NOT SET"}`);
  console.log(`   WOLFMAIL_FROM_EMAIL: ${fromEmail}`);
  console.log("");

  // Check queue status
  console.log("📬 Email Queue Status:");
  const status = WolfPackFundingCore.status();
  const queue = WolfPackFundingCore.listQueue();
  
  console.log(`   Total Queue Items: ${status.queueCount}`);
  console.log(`   Pending: ${status.pendingCount}`);
  
  const sent = queue.filter((q) => q.status === "sent");
  const failed = queue.filter((q) => q.status === "failed");
  const pending = queue.filter((q) => q.status === "pending");
  
  console.log(`   Sent: ${sent.length}`);
  console.log(`   Failed: ${failed.length}`);
  console.log("");

  // Show sent emails
  if (sent.length > 0) {
    console.log("✅ Sent Emails:");
    sent.slice(0, 5).forEach((item) => {
      console.log(`   - To: ${item.toEmail}`);
      console.log(`     Subject: ${item.subject.substring(0, 60)}...`);
      console.log(`     Sent at: ${new Date(item.createdAt).toLocaleString()}`);
      console.log("");
    });
    if (sent.length > 5) {
      console.log(`   ... and ${sent.length - 5} more`);
      console.log("");
    }
  }

  // Show failed emails
  if (failed.length > 0) {
    console.log("❌ Failed Emails:");
    failed.slice(0, 5).forEach((item) => {
      console.log(`   - To: ${item.toEmail}`);
      console.log(`     Subject: ${item.subject.substring(0, 60)}...`);
      console.log(`     Error: ${item.lastError || "Unknown error"}`);
      console.log("");
    });
    if (failed.length > 5) {
      console.log(`   ... and ${failed.length - 5} more`);
      console.log("");
    }
  }

  // Show pending emails
  if (pending.length > 0) {
    console.log("⏳ Pending Emails:");
    pending.slice(0, 5).forEach((item) => {
      console.log(`   - To: ${item.toEmail}`);
      console.log(`     Subject: ${item.subject.substring(0, 60)}...`);
      console.log(`     Created at: ${new Date(item.createdAt).toLocaleString()}`);
      console.log("");
    });
    if (pending.length > 5) {
      console.log(`   ... and ${pending.length - 5} more`);
      console.log("");
    }
  }

  // Check test lead
  console.log("🧪 Test Lead Status:");
  const testLead = WolfPackFundingCore.getLead("lead:test-self");
  if (testLead) {
    console.log(`   ✅ Test lead exists`);
    console.log(`   Email: ${testLead.email || "❌ NO EMAIL"}`);
    console.log(`   Stage: ${testLead.stage}`);
    console.log(`   Dream Fit Score: ${testLead.dreamFitScore ?? "N/A"}`);
    console.log(`   Priority Score: ${testLead.priorityScore ?? "N/A"}`);
    
    // Check if there's a queue item for this lead
    const leadQueueItems = queue.filter((q) => q.leadId === testLead.id);
    if (leadQueueItems.length > 0) {
      console.log(`   Queue Items: ${leadQueueItems.length}`);
      leadQueueItems.forEach((item) => {
        console.log(`     - Status: ${item.status}`);
        if (item.status === "failed" && item.lastError) {
          console.log(`       Error: ${item.lastError}`);
        }
      });
    } else {
      console.log(`   ⚠️  No queue items for this lead`);
    }
  } else {
    console.log(`   ❌ Test lead not found (run seed script first)`);
  }
  console.log("");

  // Test SMTP configuration
  if (hasSmtpPass) {
    console.log("🔧 Testing SMTP Configuration:");
    try {
      const config = WolfPackMailerCore.createMailerFromEnv();
      console.log(`   ✅ SMTP config created successfully`);
      console.log(`   Host: ${config.host}`);
      console.log(`   Port: ${config.port}`);
      console.log(`   Secure: ${config.secure}`);
      console.log(`   From: ${config.fromEmail}`);
      console.log(`   User: ${config.user}`);
      console.log(`   Password: ${config.pass ? "✅ Set" : "❌ NOT SET"}`);
    } catch (err: any) {
      console.log(`   ❌ Error creating SMTP config: ${err.message}`);
    }
    console.log("");
  }

  // Recommendations
  console.log("💡 Recommendations:");
  
  if (!hasSmtpPass) {
    console.log("   ❌ Set WOLFMAIL_SMTP_PASS in .env (Gmail App Password)");
  }
  
  if (!testEmail) {
    console.log("   ❌ Set TEST_LEAD_EMAIL in .env");
  }
  
  if (pending.length > 0) {
    console.log(`   ⚠️  You have ${pending.length} pending emails. Run the mailer to send them.`);
    console.log(`      Command: tsx scripts/runWolfpackMailerOnce.ts`);
  }
  
  if (failed.length > 0) {
    console.log(`   ❌ You have ${failed.length} failed emails. Check SMTP credentials.`);
  }
  
  if (sent.length > 0 && testEmail) {
    const testSent = sent.find((s) => s.toEmail === testEmail);
    if (testSent) {
      console.log(`   ✅ Email was sent to ${testEmail} at ${new Date(testSent.createdAt).toLocaleString()}`);
      console.log(`   📬 Check your inbox (and spam folder) for: ${fromEmail}`);
    }
  }
  
  if (sent.length === 0 && pending.length === 0 && testLead) {
    console.log("   ⚠️  No emails in queue. Run the funding cycle to generate emails:");
    console.log("      Command: tsx scripts/runWolfpackFundingOnce.ts");
  }
  
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Error checking email status:", err);
  console.error("");
  process.exit(1);
});

