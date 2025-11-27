/**
 * OS Process Descriptor - Types for process descriptors in OS linker
 * 
 * Describes how processes are represented in the DreamNet OS linker
 */

import type { RuntimeContext } from "./RuntimeContext.js";

/**
 * Process Status
 */
export type ProcessStatus = "running" | "stopped" | "error" | "pending";

/**
 * OS Process Descriptor - Describes a process in the OS linker
 */
export interface OSProcessDescriptor {
  /** Process ID */
  id: string;
  /** Process name */
  name: string;
  /** Process type */
  type: string;
  /** Process status */
  status: ProcessStatus;
  /** Process metadata */
  metadata?: Record<string, unknown>;
  /** Process capabilities */
  capabilities?: string[];
  /** Process runtime context */
  runtimeContext?: RuntimeContext;
}

