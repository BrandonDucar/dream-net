/**
 * MCP Tools - Types for MCP tools
 * 
 * Describes tools available through MCP providers
 */

/**
 * MCP Tool - Tool available through MCP
 */
export interface MCPTool {
  /** Tool identifier */
  id: string;
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Tool input schema */
  inputSchema?: Record<string, unknown>;
  /** Tool output schema */
  outputSchema?: Record<string, unknown>;
  /** Provider ID */
  providerId: string;
  /** Tool metadata */
  metadata?: Record<string, unknown>;
}

/**
 * MCP Tool Execution Request
 */
export interface MCPToolExecutionRequest {
  /** Tool ID */
  toolId: string;
  /** Execution input */
  input: Record<string, unknown>;
  /** Request metadata */
  metadata?: Record<string, unknown>;
}

/**
 * MCP Tool Execution Response
 */
export interface MCPToolExecutionResponse {
  /** Request ID */
  requestId: string;
  /** Execution status */
  status: "success" | "error" | "pending";
  /** Execution result */
  result?: unknown;
  /** Error information */
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

