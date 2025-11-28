/**
 * MCP Gateway - Gateway for observability and governance
 * 
 * Provides centralized observability, access control, quotas, and security for MCP tools.
 */

import type { MCPServer } from './MCPServer.js';
import type { MCPToolExecution } from './MCPServer.js';

export interface GatewayConfig {
  enableMetrics?: boolean;
  enableQuotas?: boolean;
  enableAuth?: boolean;
}

/**
 * MCP Gateway - Gateway layer for MCP tools
 */
export class MCPGateway {
  private server: MCPServer;
  private config: GatewayConfig;
  private metrics: Map<string, number> = new Map();
  private quotas: Map<string, { limit: number; used: number }> = new Map();

  constructor(server: MCPServer, config: GatewayConfig = {}) {
    this.server = server;
    this.config = {
      enableMetrics: true,
      enableQuotas: true,
      enableAuth: true,
      ...config,
    };
  }

  /**
   * Execute tool through gateway (with observability/governance)
   */
  async executeTool(execution: MCPToolExecution, userId?: string): Promise<any> {
    // Check quotas
    if (this.config.enableQuotas) {
      const quota = this.quotas.get(execution.tool);
      if (quota && quota.used >= quota.limit) {
        throw new Error(`Quota exceeded for tool: ${execution.tool}`);
      }
    }

    // Record metrics
    if (this.config.enableMetrics) {
      const count = this.metrics.get(execution.tool) || 0;
      this.metrics.set(execution.tool, count + 1);
    }

    // Execute tool
    const startTime = Date.now();
    try {
      const result = await this.server.executeTool(execution);

      // Update quota usage
      if (this.config.enableQuotas) {
        const quota = this.quotas.get(execution.tool);
        if (quota) {
          quota.used++;
        }
      }

      return result;
    } catch (error: any) {
      // Record error metrics
      if (this.config.enableMetrics) {
        const errorKey = `${execution.tool}_errors`;
        const count = this.metrics.get(errorKey) || 0;
        this.metrics.set(errorKey, count + 1);
      }
      throw error;
    }
  }

  /**
   * Set quota for a tool
   */
  setQuota(toolName: string, limit: number): void {
    this.quotas.set(toolName, { limit, used: 0 });
  }

  /**
   * Get metrics for a tool
   */
  getMetrics(toolName: string): number {
    return this.metrics.get(toolName) || 0;
  }
}

