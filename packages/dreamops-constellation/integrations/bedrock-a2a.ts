/**
 * Amazon Bedrock AgentCore A2A Protocol Integration
 * 
 * Expose /.well-known/agent-card.json for each agent
 * JSON-RPC over HTTP (port 9000)
 * Secure auth (SigV4/OAuth2)
 */

export interface AgentCard {
  name: string;
  version: string;
  capabilities: string[];
  endpoints: {
    rpc: string;
    health: string;
  };
  metadata?: Record<string, any>;
}

export class BedrockA2AIntegration {
  private agentCards: Map<string, AgentCard> = new Map();
  private rpcPort = 9000;

  /**
   * Register an agent with A2A protocol
   */
  registerAgent(agentId: string, card: AgentCard): void {
    this.agentCards.set(agentId, card);
    console.log(`[BedrockA2A] Registered agent: ${agentId}`);
  }

  /**
   * Get agent card JSON (for /.well-known/agent-card.json endpoint)
   */
  getAgentCard(agentId: string): AgentCard | undefined {
    return this.agentCards.get(agentId);
  }

  /**
   * Discover other agents via A2A protocol
   */
  async discoverAgents(discoveryUrl: string): Promise<AgentCard[]> {
    try {
      const response = await fetch(`${discoveryUrl}/.well-known/agent-card.json`);
      if (!response.ok) {
        throw new Error(`Failed to discover agents: ${response.statusText}`);
      }
      const card = await response.json() as AgentCard;
      return [card];
    } catch (error: any) {
      console.error(`[BedrockA2A] Failed to discover agents:`, error);
      return [];
    }
  }

  /**
   * Send JSON-RPC message to another agent
   */
  async sendRPC(
    agentUrl: string,
    method: string,
    params: any,
    auth?: { type: "sigv4" | "oauth2"; credentials: any }
  ): Promise<any> {
    const rpcUrl = `${agentUrl}:${this.rpcPort}`;
    
    const payload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // TODO: Add SigV4 or OAuth2 authentication
    if (auth) {
      if (auth.type === "sigv4") {
        // TODO: Implement SigV4 signing
      } else if (auth.type === "oauth2") {
        headers["Authorization"] = `Bearer ${auth.credentials.token}`;
      }
    }

    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`RPC call failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error(`[BedrockA2A] RPC call failed:`, error);
      throw error;
    }
  }

  /**
   * Generate agent card JSON for an agent
   */
  generateAgentCard(
    name: string,
    capabilities: string[],
    baseUrl: string
  ): AgentCard {
    return {
      name,
      version: "1.0.0",
      capabilities,
      endpoints: {
        rpc: `${baseUrl}:${this.rpcPort}`,
        health: `${baseUrl}/healthz`,
      },
    };
  }
}

export default BedrockA2AIntegration;

