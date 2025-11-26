/**
 * Cursor DreamNet Client
 * 
 * A Cursor-friendly wrapper around DreamNetAgent that provides:
 * - Direct API access with authentication
 * - Convenient methods for common operations
 * - Better error handling and types
 * - Easy integration with Cursor workflows
 */

import { DreamNetAgent, DreamNetAgentOptions } from "@dreamnet/dreamnet-agent-client";

// ============================================================================
// Types
// ============================================================================

export interface CursorDreamNetClientOptions {
  apiKey?: string;
  baseUrl?: string;
  maxRetries?: number;
  retryBaseDelayMs?: number;
  timeoutMs?: number;
}

export interface SystemStatus {
  ok: boolean;
  timestamp: string;
  uptime?: number;
  version?: string;
  cores?: Record<string, any>;
  agents?: Record<string, any>;
  [key: string]: any;
}

export interface Dream {
  id: string;
  title?: string;
  content?: string;
  author?: string;
  lucidityScore?: number;
  [key: string]: any;
}

export interface AgentStatus {
  name: string;
  status: "active" | "inactive" | "error";
  health?: number;
  lastActivity?: string;
  [key: string]: any;
}

// ============================================================================
// Main Client Class
// ============================================================================

export class CursorDreamNetClient {
  private agent: DreamNetAgent;
  private apiKey: string;

  constructor(options?: CursorDreamNetClientOptions) {
    // Get API key from options or environment
    this.apiKey = options?.apiKey || process.env.DREAMNET_API_KEY || "";
    
    if (!this.apiKey) {
      throw new Error(
        "DREAMNET_API_KEY is required. " +
        "Set it in options, environment variable, or .env file."
      );
    }

    // Initialize underlying agent client
    const agentOptions: DreamNetAgentOptions = {
      apiKey: this.apiKey,
      baseUrl: options?.baseUrl || process.env.DREAMNET_API_URL || "https://dreamnet.world",
      maxRetries: options?.maxRetries,
      retryBaseDelayMs: options?.retryBaseDelayMs,
      timeoutMs: options?.timeoutMs,
    };

    this.agent = new DreamNetAgent(agentOptions);
  }

  // ============================================================================
  // Authentication & Validation
  // ============================================================================

  /**
   * Validate the API key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const result = await this.agent.validateApiKey();
      return result?.valid === true || result?.ok === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get API key info (without exposing the key itself)
   */
  async getApiKeyInfo(): Promise<any> {
    return await this.agent.listApiKeys();
  }

  // ============================================================================
  // System Status & Health
  // ============================================================================

  /**
   * Get full system heartbeat/status
   * This is the main endpoint for checking DreamNet health
   */
  async getHeartbeat(): Promise<SystemStatus> {
    return await this.agent.checkSystemStatus();
  }

  /**
   * Get system state
   */
  async getSystemState(): Promise<any> {
    return await this.agent.getSystemState();
  }

  /**
   * Quick health check (returns true if system is healthy)
   */
  async isHealthy(): Promise<boolean> {
    try {
      const status = await this.getHeartbeat();
      return status?.ok === true;
    } catch (error) {
      return false;
    }
  }

  // ============================================================================
  // Core System Status Endpoints
  // ============================================================================

  /**
   * Get Spider Web Core status
   */
  async getSpiderWebStatus(): Promise<any> {
    return await this.agent.getSpiderWebStatus();
  }

  /**
   * Get Shield Core status
   */
  async getShieldStatus(): Promise<any> {
    return await this.agent.getShieldStatus();
  }

  /**
   * Get Shield Core status (system endpoint)
   */
  async getShieldCoreStatus(): Promise<any> {
    return await this.agent.getShieldCoreStatus();
  }

  /**
   * Get Control Plane status
   */
  async getControlPlaneStatus(): Promise<any> {
    return await this.agent.getControlPlaneStatus();
  }

  /**
   * Get Dream State status
   */
  async getDreamStateStatus(): Promise<any> {
    return await this.agent.getDreamStateStatus();
  }

  // ============================================================================
  // Dreams
  // ============================================================================

  /**
   * Query/search dreams
   */
  async queryDreams(options?: {
    text?: string;
    filter?: Record<string, unknown>;
    limit?: number;
  }): Promise<Dream[]> {
    const result = await this.agent.queryDreams({
      text: options?.text,
      filter: options?.filter,
      limit: options?.limit,
    });
    
    // Handle different response formats
    if (Array.isArray(result)) return result;
    if (result?.dreams) return result.dreams;
    if (result?.data) return result.data;
    return [];
  }

  /**
   * Get a specific dream by ID
   */
  async getDream(id: string): Promise<Dream | null> {
    try {
      return await this.agent.getDream(id);
    } catch (error) {
      return null;
    }
  }

  // ============================================================================
  // Agents
  // ============================================================================

  /**
   * Query an agent using natural language
   */
  async queryAgent(agentName: string, query: string, options?: {
    sessionId?: string;
    vars?: Record<string, unknown>;
  }): Promise<any> {
    const message = `Agent ${agentName}: ${query}`;
    return await this.agent.autonomousQuery(message, {
      sessionId: options?.sessionId,
      vars: options?.vars,
    });
  }

  /**
   * Get agent context/info
   */
  async getAgentContext(): Promise<any> {
    return await this.agent.getContext();
  }

  // ============================================================================
  // Shield Core (Security)
  // ============================================================================

  /**
   * Get Shield threats
   */
  async getShieldThreats(options?: {
    limit?: number;
    since?: string;
  }): Promise<any> {
    return await this.agent.getShieldThreats(options);
  }

  // ============================================================================
  // Wolf Pack (Funding/Opportunities)
  // ============================================================================

  /**
   * Get Wolf Pack opportunities
   */
  async getWolfPackOpportunities(options?: {
    limit?: number;
    status?: string;
  }): Promise<any> {
    return await this.agent.getWolfPackOpportunities(options);
  }

  /**
   * Get Wolf Pack status
   */
  async getWolfPackStatus(): Promise<any> {
    return await this.agent.getWolfPackStatus();
  }

  // ============================================================================
  // Spider Web (Threads/Connections)
  // ============================================================================

  /**
   * Get Spider Web threads
   */
  async getSpiderWebThreads(options?: {
    limit?: number;
    kind?: string;
  }): Promise<any> {
    return await this.agent.getSpiderWebThreads(options);
  }

  // ============================================================================
  // Natural Language Interface
  // ============================================================================

  /**
   * Send a natural language query to DreamNet
   * This is the main interface for ChatGPT Agent Mode
   */
  async query(message: string, options?: {
    sessionId?: string;
    vars?: Record<string, unknown>;
    systemPrompt?: string;
  }): Promise<any> {
    return await this.agent.autonomousQuery(message, options);
  }

  // ============================================================================
  // Vercel Integration (DevOps)
  // ============================================================================

  /**
   * List Vercel projects
   */
  async listVercelProjects(): Promise<any> {
    return await this.agent.listVercelProjects();
  }

  /**
   * Get Vercel project details
   */
  async getVercelProject(name: string): Promise<any> {
    return await this.agent.getVercelProject(name);
  }

  /**
   * Analyze cleanup opportunities
   */
  async analyzeCleanupOpportunities(options?: {
    targetDomain?: string;
    dryRun?: boolean;
  }): Promise<any> {
    return await this.agent.analyzeCleanupOpportunities(options);
  }

  // ============================================================================
  // Low-level Access
  // ============================================================================

  /**
   * Get the underlying DreamNetAgent instance
   * Use this for direct access to methods not wrapped here
   */
  getAgent(): DreamNetAgent {
    return this.agent;
  }

  /**
   * Get memory access instance
   * Provides bidirectional access to DreamVault, event logs, and agent states
   */
  getMemory(): import("./memory.js").CursorMemoryAccess {
    // Use getMemoryAccess helper to avoid circular dependencies
    const { getMemoryAccess } = require("./memory.js") as typeof import("./memory.js");
    return getMemoryAccess(this);
  }

  /**
   * Get agent communication instance
   * Provides direct agent messaging, queries, and coordination
   */
  getAgents(): import("./agents.js").CursorAgentComm {
    // Use getAgentComm helper to avoid circular dependencies
    const { getAgentComm } = require("./agents.js") as typeof import("./agents.js");
    return getAgentComm(this);
  }

  /**
   * Get autonomous action system instance
   * Provides safe execution with approval workflows and safety checks
   */
  getActions(): import("./actions.js").CursorActionSystem {
    // Use getActionSystem helper to avoid circular dependencies
    const { getActionSystem } = require("./actions.js") as typeof import("./actions.js");
    return getActionSystem(this);
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Create a new CursorDreamNetClient instance
 * Uses DREAMNET_API_KEY from environment if not provided
 */
export function createClient(options?: CursorDreamNetClientOptions): CursorDreamNetClient {
  return new CursorDreamNetClient(options);
}

/**
 * Quick health check function
 */
export async function checkHealth(apiKey?: string): Promise<boolean> {
  const client = new CursorDreamNetClient({ apiKey });
  return await client.isHealthy();
}

// Export event streaming
export {
  CursorEventStream,
  createEventStream,
  StarbridgeTopic,
  StarbridgeSource,
  type StarbridgeEvent,
  type EventHandler,
  type EventStreamOptions,
  type EventStreamStatus,
} from "./events.js";

// Export memory access
export {
  CursorMemoryAccess,
  getMemoryAccess,
  type Dream as MemoryDream,
  type DreamCreateInput,
  type DreamUpdateInput,
  type EventLog,
  type EventLogQuery,
  type AgentState,
} from "./memory.js";

// Export agent communication
export {
  CursorAgentComm,
  getAgentComm,
  type AgentMessage,
  type AgentQuery,
  type AgentAction,
  type AgentGatewayIntent,
  type AgentGatewayTool,
  type AgentGatewayResult,
  type MultiAgentWorkflow,
} from "./agents.js";

// Export action system
export {
  CursorActionSystem,
  getActionSystem,
  type ActionRequest,
  type ActionSafetyCheck,
  type ActionApproval,
  type ActionResult,
  type ActionWorkflow,
} from "./actions.js";

// Default export
export default CursorDreamNetClient;

