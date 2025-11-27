/**
 * Protocol Registry - Empty registry for agent protocols
 * 
 * This will be filled by Antigravity with actual protocol registry logic.
 */

import type { ProtocolDescriptor } from "./ProtocolTypes.js";

/**
 * Protocol Registry - Manages agent protocols
 * Empty implementation - Antigravity will fill this
 */
export class ProtocolRegistry {
  constructor() {
    // Empty constructor - Antigravity will initialize
  }

  /**
   * Register protocol
   * @param protocol - Protocol descriptor
   */
  registerProtocol(protocol: ProtocolDescriptor): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get protocol by ID
   * @param protocolId - Protocol ID
   * @returns Protocol descriptor or undefined
   */
  getProtocol(protocolId: string): ProtocolDescriptor | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get all protocols
   * @returns Array of protocol descriptors
   */
  getAllProtocols(): ProtocolDescriptor[] {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

