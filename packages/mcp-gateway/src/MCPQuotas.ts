/**
 * MCP Quotas - Rate limiting for MCP tools
 * 
 * Enforces quotas and rate limits per tool invocation.
 */

export interface QuotaConfig {
  limit: number;
  windowMs: number;
  resetOnWindow: boolean;
}

/**
 * MCP Quotas - Manages tool quotas and rate limits
 */
export class MCPQuotas {
  private quotas: Map<string, QuotaConfig> = new Map();
  private usage: Map<string, { count: number; windowStart: number }> = new Map();

  /**
   * Set quota for a tool
   */
  setQuota(toolName: string, config: QuotaConfig): void {
    this.quotas.set(toolName, config);
  }

  /**
   * Check if tool invocation is allowed
   */
  checkQuota(toolName: string): boolean {
    const quota = this.quotas.get(toolName);
    if (!quota) {
      return true; // No quota set, allow
    }

    const usage = this.usage.get(toolName) || { count: 0, windowStart: Date.now() };
    const now = Date.now();

    // Reset window if needed
    if (now - usage.windowStart >= quota.windowMs) {
      usage.count = 0;
      usage.windowStart = now;
    }

    // Check limit
    if (usage.count >= quota.limit) {
      return false;
    }

    // Increment usage
    usage.count++;
    this.usage.set(toolName, usage);

    return true;
  }

  /**
   * Get remaining quota for a tool
   */
  getRemainingQuota(toolName: string): number {
    const quota = this.quotas.get(toolName);
    if (!quota) {
      return Infinity;
    }

    const usage = this.usage.get(toolName) || { count: 0, windowStart: Date.now() };
    return Math.max(0, quota.limit - usage.count);
  }
}

