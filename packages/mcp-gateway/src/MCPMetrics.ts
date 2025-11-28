/**
 * MCP Metrics - Usage tracking for MCP tools
 * 
 * Tracks tool usage, latency, success/failure rates, and costs.
 */

export interface ToolMetrics {
  toolName: string;
  invocationCount: number;
  successCount: number;
  failureCount: number;
  averageLatency: number;
  totalCost: number;
  lastInvocation: number;
}

/**
 * MCP Metrics - Tracks MCP tool usage
 */
export class MCPMetrics {
  private metrics: Map<string, ToolMetrics> = new Map();

  /**
   * Record a tool invocation
   */
  recordInvocation(toolName: string, success: boolean, latency: number, cost?: number): void {
    const existing = this.metrics.get(toolName) || {
      toolName,
      invocationCount: 0,
      successCount: 0,
      failureCount: 0,
      averageLatency: 0,
      totalCost: 0,
      lastInvocation: 0,
    };

    existing.invocationCount++;
    if (success) {
      existing.successCount++;
    } else {
      existing.failureCount++;
    }

    // Update average latency (simple moving average)
    existing.averageLatency = 
      (existing.averageLatency * (existing.invocationCount - 1) + latency) / 
      existing.invocationCount;

    if (cost) {
      existing.totalCost += cost;
    }

    existing.lastInvocation = Date.now();
    this.metrics.set(toolName, existing);
  }

  /**
   * Get metrics for a tool
   */
  getMetrics(toolName: string): ToolMetrics | undefined {
    return this.metrics.get(toolName);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): ToolMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Reset metrics for a tool
   */
  resetMetrics(toolName: string): void {
    this.metrics.delete(toolName);
  }
}

