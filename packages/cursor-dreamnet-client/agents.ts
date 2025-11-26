/**
 * Cursor DreamNet Agent Communication
 * 
 * Direct agent communication protocol for:
 * - Sending messages to agents
 * - Querying agents
 * - Triggering agent actions
 * - Coordinating multi-agent workflows
 * - Using agent gateway for tool execution
 */

import { CursorDreamNetClient } from "./index.js";

// ============================================================================
// Types
// ============================================================================

export interface AgentMessage {
  from: string;
  to: string;
  topic?: string;
  text: string;
  meta?: Record<string, any>;
  timestamp?: Date;
}

export interface AgentQuery {
  agentName: string;
  query: string;
  context?: Record<string, unknown>;
  sessionId?: string;
}

export interface AgentAction {
  agentName: string;
  action: string;
  params?: Record<string, any>;
}

export interface AgentGatewayIntent {
  intent: string;
  payload?: Record<string, any>;
  constraints?: Record<string, any>;
}

export interface AgentGatewayTool {
  id: string;
  label: string;
  description: string;
  clusterId?: string;
  portId?: string;
  minTier?: string;
}

export interface AgentGatewayResult {
  traceId: string;
  intent: string;
  toolId: string;
  toolConfig: AgentGatewayTool;
  result: {
    ok: boolean;
    data: any;
    latencyMs?: number;
  };
  message: string;
  status: string;
}

export interface MultiAgentWorkflow {
  steps: Array<{
    agent: string;
    action: string;
    params?: Record<string, any>;
    waitFor?: string; // Wait for previous step
  }>;
  parallel?: boolean;
}

// ============================================================================
// Agent Communication Class
// ============================================================================

export class CursorAgentComm {
  private client: CursorDreamNetClient;

  constructor(client: CursorDreamNetClient) {
    this.client = client;
  }

  // ============================================================================
  // Direct Agent Messaging
  // ============================================================================

  /**
   * Send a message to an agent
   */
  async sendMessage(to: string, message: string, options?: {
    topic?: string;
    meta?: Record<string, any>;
  }): Promise<boolean> {
    const agent = this.client.getAgent();
    
    try {
      // Try DM bus endpoint first
      const result = await (agent as any).request("POST", "/api/dm/send", {
        from: "cursor",
        to,
        topic: options?.topic || "general",
        text: message,
        meta: options?.meta || {},
      });
      return result?.success === true || result?.ok === true;
    } catch (error: any) {
      // Fallback: use natural language query
      try {
        await this.client.queryAgent(to, message);
        return true;
      } catch (fallbackError: any) {
        console.warn(`Failed to send message to ${to}: ${fallbackError.message}`);
        return false;
      }
    }
  }

  /**
   * Query an agent using natural language
   */
  async queryAgent(agentName: string, query: string, options?: {
    sessionId?: string;
    context?: Record<string, unknown>;
  }): Promise<any> {
    return await this.client.queryAgent(agentName, query, options);
  }

  /**
   * Trigger an agent action
   */
  async triggerAction(agentName: string, action: string, params?: Record<string, any>): Promise<any> {
    const agent = this.client.getAgent();
    
    try {
      // Try agent-specific action endpoint
      const result = await (agent as any).request("POST", `/api/agents/${encodeURIComponent(agentName)}/action`, {
        action,
        params: params || {},
        source: "cursor",
      });
      return result;
    } catch (error: any) {
      // Fallback: use natural language
      const query = `Execute action: ${action}${params ? ` with params: ${JSON.stringify(params)}` : ""}`;
      return await this.client.queryAgent(agentName, query);
    }
  }

  /**
   * Get agent status
   */
  async getAgentStatus(agentName: string): Promise<any> {
    const agent = this.client.getAgent();
    
    try {
      return await (agent as any).request("GET", `/api/agents/${encodeURIComponent(agentName)}/status`);
    } catch (error: any) {
      // Fallback: try to get from system state
      const systemState = await this.client.getSystemState();
      return systemState?.agents?.[agentName] || null;
    }
  }

  // ============================================================================
  // Agent Gateway (Tool Execution)
  // ============================================================================

  /**
   * List available tools via Agent Gateway
   */
  async listTools(): Promise<AgentGatewayTool[]> {
    const agent = this.client.getAgent();
    
    try {
      const result = await (agent as any).request("GET", "/api/agent/gateway/tools");
      return result?.tools || [];
    } catch (error: any) {
      console.warn(`Failed to list tools: ${error.message}`);
      return [];
    }
  }

  /**
   * Execute a tool via Agent Gateway using natural language intent
   */
  async executeIntent(intent: string, payload?: Record<string, any>, constraints?: Record<string, any>): Promise<AgentGatewayResult> {
    const agent = this.client.getAgent();
    
    const result = await (agent as any).request("POST", "/api/agent/gateway", {
      intent,
      payload: payload || {},
      constraints: constraints || {},
    });
    
    return result;
  }

  /**
   * Execute a specific tool by ID
   */
  async executeTool(toolId: string, payload?: Record<string, any>): Promise<AgentGatewayResult> {
    return await this.executeIntent(toolId, payload);
  }

  // ============================================================================
  // Multi-Agent Coordination
  // ============================================================================

  /**
   * Execute a multi-agent workflow
   */
  async executeWorkflow(workflow: MultiAgentWorkflow): Promise<Array<{ agent: string; result: any; error?: string }>> {
    const results: Array<{ agent: string; result: any; error?: string }> = [];

    if (workflow.parallel) {
      // Execute all steps in parallel
      const promises = workflow.steps.map(async (step) => {
        try {
          const result = await this.triggerAction(step.agent, step.action, step.params);
          return { agent: step.agent, result };
        } catch (error: any) {
          return { agent: step.agent, result: null, error: error.message };
        }
      });
      
      const parallelResults = await Promise.all(promises);
      results.push(...parallelResults);
    } else {
      // Execute steps sequentially
      for (const step of workflow.steps) {
        // Wait for previous step if specified
        if (step.waitFor) {
          const previousResult = results.find(r => r.agent === step.waitFor);
          if (!previousResult || previousResult.error) {
            results.push({
              agent: step.agent,
              result: null,
              error: `Previous step ${step.waitFor} failed or not found`,
            });
            continue;
          }
        }

        try {
          const result = await this.triggerAction(step.agent, step.action, step.params);
          results.push({ agent: step.agent, result });
        } catch (error: any) {
          results.push({ agent: step.agent, result: null, error: error.message });
        }
      }
    }

    return results;
  }

  /**
   * Coordinate multiple agents for a task
   */
  async coordinateAgents(agents: string[], task: string, context?: Record<string, any>): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    // Query all agents in parallel
    const promises = agents.map(async (agentName) => {
      try {
        const result = await this.queryAgent(agentName, task, { context });
        return { agent: agentName, result, error: null };
      } catch (error: any) {
        return { agent: agentName, result: null, error: error.message };
      }
    });

    const agentResults = await Promise.all(promises);
    
    for (const { agent, result, error } of agentResults) {
      results[agent] = { result, error };
    }

    return results;
  }

  // ============================================================================
  // Convenience Methods
  // ============================================================================

  /**
   * Ask DeployKeeper about deployment status
   */
  async askDeployKeeper(query: string): Promise<any> {
    return await this.queryAgent("DeployKeeper", query);
  }

  /**
   * Ask CoinSensei about token/economy
   */
  async askCoinSensei(query: string): Promise<any> {
    return await this.queryAgent("CoinSensei", query);
  }

  /**
   * Ask Economic Brain about economics
   */
  async askEconomicBrain(query: string): Promise<any> {
    return await this.queryAgent("EconomicBrain", query);
  }

  /**
   * Ask DreamKeeper about system health
   */
  async askDreamKeeper(query: string): Promise<any> {
    return await this.queryAgent("DreamKeeper", query);
  }

  /**
   * Ask Shield Core about security
   */
  async askShieldCore(query: string): Promise<any> {
    return await this.queryAgent("ShieldCore", query);
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Get agent communication from a client
 */
export function getAgentComm(client: CursorDreamNetClient): CursorAgentComm {
  return new CursorAgentComm(client);
}

