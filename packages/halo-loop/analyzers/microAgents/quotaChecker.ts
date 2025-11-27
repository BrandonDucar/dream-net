import type { MicroAgentResult } from "../swarmPatrol";
import { FreeTierQuotaService } from "../../../../server/services/FreeTierQuotaService.js";

export const quotaChecker = {
  id: "swarm-quota-004",
  name: "Resource Quota Check",
  async check(): Promise<MicroAgentResult> {
    // Check Google Cloud Free Tier quotas
    const allQuotas = FreeTierQuotaService.getAllQuotaStatuses();
    
    const checks = allQuotas.map((quota) => ({
      name: quota.quotaType,
      status: quota.status === 'exceeded' ? 'critical' as const 
        : quota.status === 'critical' ? 'critical' as const
        : quota.status === 'warning' ? 'warning' as const
        : 'ok' as const,
      usage: quota.used,
      limit: quota.limit,
      percentageUsed: quota.percentageUsed,
      remaining: quota.remaining,
    }));

    const criticalQuotas = checks.filter((c) => c.status === "critical");
    const warningQuotas = checks.filter((c) => c.status === "warning");

    if (criticalQuotas.length > 0) {
      return {
        agentId: this.id,
        checkName: this.name,
        status: "red",
        message: `Critical quota limits: ${criticalQuotas.map((c) => `${c.name} (${c.percentageUsed.toFixed(1)}% used)`).join(", ")}`,
        metadata: { checks },
      };
    } else if (warningQuotas.length > 0) {
      return {
        agentId: this.id,
        checkName: this.name,
        status: "amber",
        message: `Quota warnings: ${warningQuotas.map((c) => `${c.name} (${c.percentageUsed.toFixed(1)}% used)`).join(", ")}`,
        metadata: { checks },
      };
    } else {
      return {
        agentId: this.id,
        checkName: this.name,
        status: "green",
        message: `All Free Tier quotas within limits (${checks.length} quotas checked)`,
        metadata: { checks },
      };
    }
  },
};

