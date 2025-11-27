/**
 * MCP Bridge - Empty bridge implementation for MCP integration
 * 
 * This will be filled by Antigravity with actual MCP bridge logic.
 */

import type { MCPProviderDescriptor } from "./MCPProviderDescriptor.js";
import type { MCPTool, MCPToolExecutionRequest, MCPToolExecutionResponse } from "./MCPTools.js";
import type { MCPSessionContext } from "./MCPSessionContext.js";

/**
 * MCP Bridge - Bridges DreamNet to MCP providers
 * Empty implementation - Antigravity will fill this
 */
export class MCPBridge {
  constructor() {
    // Empty constructor - Antigravity will initialize
  }

  /**
   * Register MCP provider
   * @param provider - Provider descriptor
   */
  registerProvider(provider: MCPProviderDescriptor): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get provider by ID
   * @param providerId - Provider ID
   * @returns Provider descriptor or undefined
   */
  getProvider(providerId: string): MCPProviderDescriptor | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get tools for provider
   * @param providerId - Provider ID
   * @returns Array of tools
   */
  getTools(providerId: string): MCPTool[] {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Execute tool
   * @param request - Tool execution request
   * @returns Promise resolving to execution response
   */
  async executeTool(request: MCPToolExecutionRequest): Promise<MCPToolExecutionResponse> {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Create session
   * @param providerId - Provider ID
   * @returns Session context
   */
  createSession(providerId: string): MCPSessionContext {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get session
   * @param sessionId - Session ID
   * @returns Session context or undefined
   */
  getSession(sessionId: string): MCPSessionContext | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

