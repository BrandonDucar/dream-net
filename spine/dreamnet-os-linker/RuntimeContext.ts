/**
 * Runtime Context - Types for runtime context in OS linker
 * 
 * Describes the runtime environment for processes
 */

/**
 * Runtime Context - Context information for process execution
 */
export interface RuntimeContext {
  /** Runtime environment identifier */
  environment: string;
  /** Runtime version */
  version?: string;
  /** Environment variables */
  env?: Record<string, string>;
  /** Runtime metadata */
  metadata?: Record<string, unknown>;
}

