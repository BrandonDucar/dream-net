/**
 * MCP Provider Descriptor - Types for MCP providers
 * 
 * Describes MCP (Model Context Protocol) providers
 */

/**
 * MCP Provider Type
 */
export type MCPProviderType =
  | "openai"
  | "anthropic"
  | "cursor"
  | "antigravity"
  | "agentforce"
  | "custom";

/**
 * MCP Provider Descriptor - Describes an MCP provider
 */
export interface MCPProviderDescriptor {
  /** Provider identifier */
  id: string;
  /** Provider type */
  type: MCPProviderType;
  /** Provider name */
  name: string;
  /** Provider endpoint */
  endpoint?: string;
  /** Provider authentication */
  auth?: {
    type: string;
    config?: Record<string, unknown>;
  };
  /** Provider capabilities */
  capabilities?: string[];
  /** Provider metadata */
  metadata?: Record<string, unknown>;
}

