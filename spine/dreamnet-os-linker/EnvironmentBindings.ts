/**
 * Environment Bindings - Types for environment bindings in OS linker
 * 
 * Describes how processes bind to their environment
 */

/**
 * Environment Binding - Binding between process and environment
 */
export interface EnvironmentBinding {
  /** Binding identifier */
  id: string;
  /** Process ID */
  processId: string;
  /** Environment identifier */
  environmentId: string;
  /** Binding type */
  type: string;
  /** Binding configuration */
  config?: Record<string, unknown>;
}

