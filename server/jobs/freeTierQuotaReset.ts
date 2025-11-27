/**
 * Free Tier Quota Monthly Reset Job
 * Resets all Free Tier quotas on the 1st of each month at midnight UTC
 */

import { registerRailJob } from "../magnetic-rail/scheduler";
import { FreeTierQuotaService } from "../services/FreeTierQuotaService";

registerRailJob({
  id: "free_tier_quota_reset",
  name: "Free Tier Quota Monthly Reset",
  cronExpression: "0 0 1 * *", // 1st of each month at 00:00 UTC
  active: true,
  handler: async () => {
    console.log("[Free Tier Quota] Starting monthly reset...");
    
    try {
      FreeTierQuotaService.resetAllQuotas();
      
      const statuses = FreeTierQuotaService.getAllQuotaStatuses();
      console.log(`[Free Tier Quota] Reset complete. ${statuses.length} quotas reset.`);
      
      // Log status summary
      const summary = statuses.map((s) => ({
        quota: s.quotaType,
        limit: s.limit,
        used: s.used,
        remaining: s.remaining,
      }));
      console.log("[Free Tier Quota] Reset summary:", JSON.stringify(summary, null, 2));
    } catch (error: any) {
      console.error("[Free Tier Quota] Reset failed:", error);
      throw error;
    }
  },
});

