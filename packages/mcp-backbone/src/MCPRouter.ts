/**
 * MCP Router - Tool routing logic
 * 
 * Routes tool invocations to appropriate MCP servers based on tool type or routing rules.
 */

import type { MCPServer } from './MCPServer.js';
import type { MCPToolExecution } from './MCPServer.js';

export interface RoutingRule {
  toolPattern: string;
  serverId: string;
  priority: number;
}

/**
 * MCP Router - Routes tool invocations to servers
 */
export class MCPRouter {
  private servers: Map<string, MCPServer> = new Map();
  private routingRules: RoutingRule[] = [];

  /**
   * Register an MCP server
   */
  registerServer(serverId: string, server: MCPServer): void {
    this.servers.set(serverId, server);
  }

  /**
   * Add a routing rule
   */
  addRoutingRule(rule: RoutingRule): void {
    this.routingRules.push(rule);
    this.routingRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Route a tool execution to the appropriate server
   */
  async route(execution: MCPToolExecution): Promise<any> {
    // Find matching routing rule
    const rule = this.routingRules.find(r => 
      execution.tool.match(new RegExp(r.toolPattern))
    );

    if (!rule) {
      throw new Error(`No routing rule found for tool: ${execution.tool}`);
    }

    const server = this.servers.get(rule.serverId);
    if (!server) {
      throw new Error(`Server not found: ${rule.serverId}`);
    }

    return server.executeTool(execution);
  }

  /**
   * Get all available tools across all servers
   */
  getAllTools(): Array<{ serverId: string; tools: any[] }> {
    return Array.from(this.servers.entries()).map(([serverId, server]) => ({
      serverId,
      tools: server.listTools(),
    }));
  }
}

