/**
 * Run Wolf Pack mailer once (for testing)
 * 
 * Usage:
 *   tsx scripts/runWolfpackMailerOnce.ts
 * 
 * Requires SMTP environment variables:
 *   WOLFMAIL_SMTP_PASS (required)
 *   WOLFMAIL_FROM_EMAIL, WOLFMAIL_SMTP_HOST, etc. (optional, have defaults)
 */

import "dotenv/config";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";

async function main() {
  console.log("Queue BEFORE:", WolfPackFundingCore.status());

  console.log("Processing Wolf Pack send queue once...");
  await WolfPackMailerCore.processSendQueueOnce();

  console.log("Queue AFTER:", WolfPackFundingCore.status());
}

main().catch((err) => {
  console.error("Mailer error:", err);
  process.exit(1);
});

