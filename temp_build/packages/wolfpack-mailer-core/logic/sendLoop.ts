import { createMailerFromEnv, sendMail } from "./mailer";
import { WolfPackFundingCore } from "../../wolfpack-funding-core";
import {
  getMaxEmailsPerCycle,
  getMaxEmailsPerDay,
  getRemainingToday,
  canSendMoreToday,
  incrementTodayCount,
} from "./rateLimiter";

/**
 * Process the send queue once with safety limits:
 * - Respects daily email limit (default: 50/day, well under Gmail's 500/day)
 * - Limits emails per cycle (default: 10 per cycle)
 * - Adds small delay between sends to avoid rate limits
 * 
 * Environment variables:
 * - WOLFMAIL_MAX_PER_DAY: Max emails per day (default: 50)
 * - WOLFMAIL_MAX_PER_CYCLE: Max emails per cycle (default: 10)
 */
export async function processSendQueueOnce(): Promise<void> {
  const config = createMailerFromEnv();
  const queue = WolfPackFundingCore.listQueue();
  const pending = queue.filter((q) => q.status === "pending");

  if (pending.length === 0) {
    console.log("[WolfPackMailer] No pending emails to send.");
    return;
  }

  // Check daily limit
  if (!canSendMoreToday()) {
    const maxPerDay = getMaxEmailsPerDay();
    console.log(
      `[WolfPackMailer] Daily limit reached (${maxPerDay} emails/day). Skipping send cycle.`
    );
    return;
  }

  const maxPerCycle = getMaxEmailsPerCycle();
  const remainingToday = getRemainingToday();
  const maxToSend = Math.min(pending.length, maxPerCycle, remainingToday);

  console.log(`[WolfPackMailer] Processing ${pending.length} pending email(s)...`);
  console.log(
    `[WolfPackMailer] Safety limits: max ${maxPerCycle} per cycle, ${remainingToday} remaining today (limit: ${getMaxEmailsPerDay()}/day)`
  );

  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < Math.min(pending.length, maxToSend); i++) {
    const item = pending[i];

    // Check if we've hit the daily limit mid-cycle
    if (!canSendMoreToday()) {
      console.log(
        `[WolfPackMailer] Daily limit reached. Stopping after ${sentCount} emails sent.`
      );
      break;
    }

    console.log(`[WolfPackMailer] Sending email ${i + 1}/${maxToSend} to ${item.toEmail}...`);

    const result = await sendMail(config, item.toEmail, item.subject, item.body);

    if (result.success) {
      WolfPackFundingCore.updateQueueItemStatus(item.id, "sent");
      
      // Update follow-up metadata (B)
      const lead = WolfPackFundingCore.getLead(item.leadId);
      if (lead) {
        const now = Date.now();
        const followupDays = Number(process.env.WOLF_FUNDING_FOLLOWUP_DAYS || "5");
        const ms = followupDays * 24 * 60 * 60 * 1000;
        
        const updatedLead = {
          ...lead,
          lastContactedAt: now,
          contactCount: (lead.contactCount ?? 0) + 1,
          nextFollowUpAt: now + ms,
        };
        
        // Optional: upgrade stage
        if (updatedLead.stage === "new" || updatedLead.stage === "qualified") {
          updatedLead.stage = "contacted";
        }
        
        WolfPackFundingCore.upsertLead(updatedLead);
      }
      
      incrementTodayCount();
      sentCount += 1;
      console.log(`[WolfPackMailer] ✓ Email sent successfully to ${item.toEmail}`);
    } else {
      WolfPackFundingCore.updateQueueItemStatus(item.id, "failed", result.error);
      failedCount += 1;
      console.error(`[WolfPackMailer] ✗ Failed to send email to ${item.toEmail}: ${result.error}`);
    }

    // Small delay between sends to avoid rate limiting (1 second)
    if (i < Math.min(pending.length, maxToSend) - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  const skipped = pending.length - sentCount - failedCount;
  console.log(`[WolfPackMailer] Queue processing complete:`);
  console.log(`  ✓ Sent: ${sentCount}`);
  console.log(`  ✗ Failed: ${failedCount}`);
  if (skipped > 0) {
    console.log(`  ⏸ Skipped: ${skipped} (will be processed in next cycle)`);
  }
  console.log(`  📊 Remaining today: ${getRemainingToday()} emails`);
}

