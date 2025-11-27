/**
 * Provider Descriptor - Metadata for external agent engines
 * 
 * Describes how to connect to and interact with different agent providers
 */

/**
 * Provider Type - Type of agent provider
 */
export type ProviderType =
  | "openai"
  | "gemini"
  | "cursor"
  | "antigravity"
  | "slack"
  | "salesforce"
  | "custom";

/**
 * Provider Descriptor - Metadata for an agent provider
 */
export interface ProviderDescriptor {
  /** Provider identifier */
  id: string;
  /** Provider type */
  type: ProviderType;
  /** Provider name */
  name: string;
  /** Provider version */
  version?: string;
  /** Connection endpoint/configuration */
  endpoint?: string;
  /** Authentication configuration */
  auth?: {
    type: "api_key" | "oauth" | "token" | "none";
    config?: Record<string, unknown>;
  };
  /** Supported capabilities */
  capabilities?: string[];
  /** Provider-specific configuration */
  config?: Record<string, unknown>;
  /** Provider metadata */
  metadata?: Record<string, unknown>;
}

