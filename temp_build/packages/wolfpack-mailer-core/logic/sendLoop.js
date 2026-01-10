"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSendQueueOnce = processSendQueueOnce;
const mailer_1 = require("./mailer");
const wolfpack_funding_core_1 = require("../../wolfpack-funding-core");
const rateLimiter_1 = require("./rateLimiter");
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
async function processSendQueueOnce() {
    const config = (0, mailer_1.createMailerFromEnv)();
    const queue = wolfpack_funding_core_1.WolfPackFundingCore.listQueue();
    const pending = queue.filter((q) => q.status === "pending");
    if (pending.length === 0) {
        console.log("[WolfPackMailer] No pending emails to send.");
        return;
    }
    // Check daily limit
    if (!(0, rateLimiter_1.canSendMoreToday)()) {
        const maxPerDay = (0, rateLimiter_1.getMaxEmailsPerDay)();
        console.log(`[WolfPackMailer] Daily limit reached (${maxPerDay} emails/day). Skipping send cycle.`);
        return;
    }
    const maxPerCycle = (0, rateLimiter_1.getMaxEmailsPerCycle)();
    const remainingToday = (0, rateLimiter_1.getRemainingToday)();
    const maxToSend = Math.min(pending.length, maxPerCycle, remainingToday);
    console.log(`[WolfPackMailer] Processing ${pending.length} pending email(s)...`);
    console.log(`[WolfPackMailer] Safety limits: max ${maxPerCycle} per cycle, ${remainingToday} remaining today (limit: ${(0, rateLimiter_1.getMaxEmailsPerDay)()}/day)`);
    let sentCount = 0;
    let failedCount = 0;
    for (let i = 0; i < Math.min(pending.length, maxToSend); i++) {
        const item = pending[i];
        // Check if we've hit the daily limit mid-cycle
        if (!(0, rateLimiter_1.canSendMoreToday)()) {
            console.log(`[WolfPackMailer] Daily limit reached. Stopping after ${sentCount} emails sent.`);
            break;
        }
        console.log(`[WolfPackMailer] Sending email ${i + 1}/${maxToSend} to ${item.toEmail}...`);
        const result = await (0, mailer_1.sendMail)(config, item.toEmail, item.subject, item.body);
        if (result.success) {
            wolfpack_funding_core_1.WolfPackFundingCore.updateQueueItemStatus(item.id, "sent");
            // Update follow-up metadata (B)
            const lead = wolfpack_funding_core_1.WolfPackFundingCore.getLead(item.leadId);
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
                wolfpack_funding_core_1.WolfPackFundingCore.upsertLead(updatedLead);
            }
            (0, rateLimiter_1.incrementTodayCount)();
            sentCount += 1;
            console.log(`[WolfPackMailer] ✓ Email sent successfully to ${item.toEmail}`);
        }
        else {
            wolfpack_funding_core_1.WolfPackFundingCore.updateQueueItemStatus(item.id, "failed", result.error);
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
    console.log(`  📊 Remaining today: ${(0, rateLimiter_1.getRemainingToday)()} emails`);
}
