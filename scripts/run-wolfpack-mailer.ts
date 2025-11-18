import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";

/**
 * Simple Node entrypoint for processing the Wolf Pack funding send queue.
 * 
 * Usage:
 *   tsx scripts/run-wolfpack-mailer.ts
 * 
 * Or build and run:
 *   pnpm build
 *   node dist/scripts/run-wolfpack-mailer.js
 * 
 * Environment variables required:
 *   WOLFMAIL_FROM_NAME (default: "DreamNet Wolf Pack")
 *   WOLFMAIL_FROM_EMAIL (default: "dreamnetgmo@gmail.com")
 *   WOLFMAIL_SMTP_HOST (default: "smtp.gmail.com")
 *   WOLFMAIL_SMTP_PORT (default: 465)
 *   WOLFMAIL_SMTP_SECURE (default: "true")
 *   WOLFMAIL_SMTP_USER (default: fromEmail)
 *   WOLFMAIL_SMTP_PASS (required - Gmail App Password)
 */

async function main() {
  console.log("Processing Wolf Pack funding send-queue...");
  
  // Check queue status before processing
  const status = WolfPackFundingCore.status();
  console.log(`Queue status: ${status.pendingCount} pending, ${status.queueCount} total`);
  
  if (status.pendingCount === 0) {
    console.log("No pending emails to send. Exiting.");
    return;
  }
  
  try {
    await WolfPackMailerCore.processSendQueueOnce();
    console.log("Done.");
  } catch (err: any) {
    console.error("Mailer error:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

