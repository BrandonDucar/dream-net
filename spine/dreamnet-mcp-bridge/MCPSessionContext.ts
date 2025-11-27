/**
 * MCP Session Context - Types for MCP session context
 * 
 * Describes session context for MCP interactions
 */

/**
 * MCP Session Context - Context for MCP session
 */
export interface MCPSessionContext {
  /** Session ID */
  sessionId: string;
  /** Provider ID */
  providerId: string;
  /** Session start time */
  startTime: number;
  /** Session metadata */
  metadata?: Record<string, unknown>;
  /** Session state */
  state?: Record<string, unknown>;
}

