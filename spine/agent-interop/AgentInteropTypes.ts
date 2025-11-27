/**
 * Agent Interop Types - Types for inter-agent interoperability requests
 * 
 * Defines the standard format for agents to communicate across different
 * agent engines (OpenAI, Gemini, Cursor, Antigravity, etc.)
 */

/**
 * Interop Request - Standard request format for agent communication
 */
export interface AgentInteropRequest {
  /** Unique request ID */
  id: string;
  /** Source agent identifier */
  sourceAgent: string;
  /** Target agent identifier (optional for broadcast) */
  targetAgent?: string;
  /** Request type */
  type: "task" | "query" | "capability" | "status" | "event";
  /** Request payload */
  payload: Record<string, unknown>;
  /** Request metadata */
  metadata?: {
    priority?: number;
    timeout?: number;
    retries?: number;
    [key: string]: unknown;
  };
  /** Request timestamp */
  timestamp: number;
}

/**
 * Interop Response - Standard response format
 */
export interface AgentInteropResponse {
  /** Request ID this responds to */
  requestId: string;
  /** Responding agent identifier */
  agentId: string;
  /** Response status */
  status: "success" | "error" | "pending" | "rejected";
  /** Response payload */
  payload?: Record<string, unknown>;
  /** Error information (if status is error) */
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  /** Response timestamp */
  timestamp: number;
}

/**
 * Interop Capability - What an agent can do
 */
export interface AgentInteropCapability {
  /** Capability name */
  name: string;
  /** Capability description */
  description: string;
  /** Input schema */
  inputSchema?: Record<string, unknown>;
  /** Output schema */
  outputSchema?: Record<string, unknown>;
  /** Capability version */
  version?: string;
}

