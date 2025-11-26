/**
 * Cursor DreamNet Memory Access
 * 
 * Bidirectional memory access for:
 * - DreamVault (dreams storage)
 * - Event logs
 * - Agent states
 */

import { CursorDreamNetClient } from "./index.js";

// ============================================================================
// Types
// ============================================================================

export interface Dream {
  id: string;
  title: string;
  description?: string;
  content?: string;
  tags?: string[];
  type?: string;
  wallet?: string;
  author?: string;
  createdByAgent?: string;
  lineage?: string[];
  createdAt?: string;
  updatedAt?: string;
  lucidityScore?: number;
  [key: string]: any;
}

export interface DreamCreateInput {
  title: string;
  description?: string;
  content?: string;
  tags?: string[];
  type?: string;
  wallet?: string;
  createdByAgent?: string;
  lineage?: string[];
  [key: string]: any;
}

export interface DreamUpdateInput {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
  [key: string]: any;
}

export interface EventLog {
  id: string;
  type: string;
  timestamp: Date;
  source?: string;
  payload?: any;
  [key: string]: any;
}

export interface EventLogQuery {
  type?: string;
  since?: Date;
  until?: Date;
  limit?: number;
  offset?: number;
}

export interface AgentState {
  name: string;
  status: "active" | "inactive" | "error";
  health?: number;
  lastActivity?: Date;
  metadata?: Record<string, any>;
  [key: string]: any;
}

// ============================================================================
// Memory Access Class
// ============================================================================

export class CursorMemoryAccess {
  private client: CursorDreamNetClient;

  constructor(client: CursorDreamNetClient) {
    this.client = client;
  }

  // ============================================================================
  // DreamVault Operations
  // ============================================================================

  /**
   * Search/query dreams in DreamVault
   */
  async searchDreams(query?: {
    text?: string;
    filter?: Record<string, unknown>;
    limit?: number;
    offset?: number;
  }): Promise<Dream[]> {
    const results = await this.client.queryDreams(query);
    // Convert to MemoryDream format (ensure title is string)
    return results.map(dream => ({
      ...dream,
      title: dream.title || dream.id || "Untitled",
    })) as Dream[];
  }

  /**
   * Get a specific dream by ID
   */
  async getDream(id: string): Promise<Dream | null> {
    const dream = await this.client.getDream(id);
    if (!dream) return null;
    // Ensure title is string
    return {
      ...dream,
      title: dream.title || dream.id || "Untitled",
    } as Dream;
  }

  /**
   * Get dreams for a specific wallet
   */
  async getDreamsByWallet(wallet: string): Promise<Dream[]> {
    const agent = this.client.getAgent();
    const result = await (agent as any).request("GET", `/api/my-dreams?wallet=${encodeURIComponent(wallet)}`);
    
    if (Array.isArray(result)) return result;
    if (result?.dreams) return result.dreams;
    if (result?.data) return result.data;
    return [];
  }

  /**
   * Create a new dream in DreamVault
   */
  async createDream(input: DreamCreateInput): Promise<Dream> {
    const agent = this.client.getAgent();
    
    // Try POST /api/my-dreams first (most common endpoint)
    try {
      const result = await (agent as any).request("POST", "/api/my-dreams", input);
      if (result?.dream) return result.dream;
      if (result?.id) return result as Dream;
      return result;
    } catch (error: any) {
      // Fallback to POST /api/dreams
      try {
        const result = await (agent as any).request("POST", "/api/dreams", input);
        if (result?.dream) return result.dream;
        if (result?.id) return result as Dream;
        return result;
      } catch (fallbackError: any) {
        throw new Error(`Failed to create dream: ${error.message || fallbackError.message}`);
      }
    }
  }

  /**
   * Update an existing dream
   */
  async updateDream(id: string, updates: DreamUpdateInput): Promise<Dream | null> {
    const agent = this.client.getAgent();
    
    try {
      // Try PATCH first
      const result = await (agent as any).request("PATCH", `/api/dreams/${encodeURIComponent(id)}`, updates);
      if (result?.dream) return result.dream;
      return result;
    } catch (error: any) {
      // Fallback to PUT
      try {
        const result = await (agent as any).request("PUT", `/api/dreams/${encodeURIComponent(id)}`, updates);
        if (result?.dream) return result.dream;
        return result;
      } catch (fallbackError: any) {
        console.warn(`Failed to update dream ${id}: ${fallbackError.message}`);
        return null;
      }
    }
  }

  /**
   * Delete a dream (if supported)
   */
  async deleteDream(id: string): Promise<boolean> {
    const agent = this.client.getAgent();
    
    try {
      await (agent as any).request("DELETE", `/api/dreams/${encodeURIComponent(id)}`);
      return true;
    } catch (error: any) {
      console.warn(`Failed to delete dream ${id}: ${error.message}`);
      return false;
    }
  }

  /**
   * Store analysis or notes in DreamVault
   * Creates a dream with analysis content
   */
  async storeAnalysis(title: string, content: string, metadata?: Record<string, any>): Promise<Dream> {
    return await this.createDream({
      title,
      description: content.substring(0, 200), // First 200 chars as description
      content,
      type: "analysis",
      createdByAgent: "cursor",
      tags: ["analysis", "cursor", ...(metadata?.tags || [])],
      ...metadata,
    });
  }

  // ============================================================================
  // Event Log Operations
  // ============================================================================

  /**
   * Get event logs (StarBridge events)
   */
  async getEventLogs(query?: EventLogQuery): Promise<EventLog[]> {
    const agent = this.client.getAgent();
    
    const params = new URLSearchParams();
    if (query?.type) params.set("type", query.type);
    if (query?.since) params.set("since", query.since.toISOString());
    if (query?.until) params.set("until", query.until.toISOString());
    if (query?.limit) params.set("limit", String(query.limit));
    if (query?.offset) params.set("offset", String(query.offset));

    const url = `/api/starbridge/events${params.toString() ? `?${params.toString()}` : ""}`;
    const result = await (agent as any).request("GET", url);
    
    if (result?.events) {
      return result.events.map((e: any) => ({
        ...e,
        timestamp: new Date(e.ts || e.timestamp),
      }));
    }
    if (Array.isArray(result)) {
      return result.map((e: any) => ({
        ...e,
        timestamp: new Date(e.ts || e.timestamp),
      }));
    }
    return [];
  }

  /**
   * Log an event (if write access is available)
   */
  async logEvent(type: string, payload?: any, source: string = "cursor"): Promise<boolean> {
    const agent = this.client.getAgent();
    
    try {
      await (agent as any).request("POST", "/api/starbridge/event", {
        topic: "System",
        source: "External",
        type,
        payload,
        metadata: {
          source,
          timestamp: new Date().toISOString(),
        },
      });
      return true;
    } catch (error: any) {
      console.warn(`Failed to log event: ${error.message}`);
      return false;
    }
  }

  /**
   * Get recent events (convenience method)
   */
  async getRecentEvents(limit: number = 50): Promise<EventLog[]> {
    return await this.getEventLogs({
      limit,
      since: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    });
  }

  // ============================================================================
  // Agent State Operations
  // ============================================================================

  /**
   * Get agent state
   */
  async getAgentState(agentName: string): Promise<AgentState | null> {
    try {
      // Try agent-specific endpoint
      const agent = this.client.getAgent();
      const result = await (agent as any).request("GET", `/api/agents/${encodeURIComponent(agentName)}/state`);
      
      if (result) {
        return {
          name: agentName,
          ...result,
          lastActivity: result.lastActivity ? new Date(result.lastActivity) : undefined,
        };
      }
    } catch (error: any) {
      // Fallback: try to get from system state
      try {
        const systemState = await this.client.getSystemState();
        if (systemState?.agents?.[agentName]) {
          return {
            name: agentName,
            ...systemState.agents[agentName],
          };
        }
      } catch (fallbackError) {
        // Ignore
      }
    }
    
    return null;
  }

  /**
   * Update agent state (if write access is available)
   */
  async updateAgentState(agentName: string, state: Partial<AgentState>): Promise<boolean> {
    const agent = this.client.getAgent();
    
    try {
      await (agent as any).request("PUT", `/api/agents/${encodeURIComponent(agentName)}/state`, state);
      return true;
    } catch (error: any) {
      console.warn(`Failed to update agent state for ${agentName}: ${error.message}`);
      return false;
    }
  }

  /**
   * Get all agent states
   */
  async getAllAgentStates(): Promise<Record<string, AgentState>> {
    try {
      const systemState = await this.client.getSystemState();
      if (systemState?.agents) {
        const states: Record<string, AgentState> = {};
        for (const [name, agent] of Object.entries(systemState.agents)) {
          states[name] = {
            name,
            ...(agent as any),
          };
        }
        return states;
      }
    } catch (error) {
      console.warn("Failed to get agent states:", error);
    }
    
    return {};
  }

  // ============================================================================
  // Convenience Methods
  // ============================================================================

  /**
   * Store Cursor analysis as a dream
   */
  async storeCursorAnalysis(analysis: {
    title: string;
    content: string;
    findings?: string[];
    recommendations?: string[];
    metadata?: Record<string, any>;
  }): Promise<Dream> {
    const content = [
      analysis.content,
      analysis.findings?.length ? `\n\n## Findings\n${analysis.findings.map(f => `- ${f}`).join("\n")}` : "",
      analysis.recommendations?.length ? `\n\n## Recommendations\n${analysis.recommendations.map(r => `- ${r}`).join("\n")}` : "",
    ].filter(Boolean).join("\n");

    return await this.storeAnalysis(analysis.title, content, {
      ...analysis.metadata,
      source: "cursor-analysis",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log Cursor action to event system
   */
  async logCursorAction(action: string, details?: any): Promise<boolean> {
    return await this.logEvent(`cursor.${action}`, {
      action,
      details,
      timestamp: new Date().toISOString(),
    }, "cursor");
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Get memory access from a client
 */
export function getMemoryAccess(client: CursorDreamNetClient): CursorMemoryAccess {
  return new CursorMemoryAccess(client);
}

