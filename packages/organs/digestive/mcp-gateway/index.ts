/**
 * @dreamnet/mcp-gateway — Model Context Protocol Gateway
 * 
 * Implements MCP server/client for tool discovery and execution.
 * Allows DreamNet agents to expose and consume tools via the MCP standard.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'mcp-gateway',
  name: 'DreamNet MCP Gateway',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['mcp-server', 'mcp-client', 'tool-discovery', 'tool-execution'],
  metadata: { organ: 'digestive', role: 'mcp-gateway', protocol: 'MCP' },
});

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  agentId: string;
  endpoint?: string;
}

export interface MCPRequest {
  method: string;
  params: Record<string, any>;
  id: string;
}

const registeredTools: Map<string, MCPTool> = new Map();

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export function registerTool(tool: MCPTool): void {
  registeredTools.set(tool.name, tool);
}

export function listTools(): MCPTool[] {
  return Array.from(registeredTools.values());
}

export async function callTool(name: string, params: Record<string, any>): Promise<any> {
  const tool = registeredTools.get(name);
  if (!tool) throw new Error(`Tool not found: ${name}`);

  // Route through bridge to the owning agent
  const result = await bridge.send(tool.agentId, `MCP call: ${name}`, 'command', { tool: name, params });
  return result;
}

export async function handleMCPRequest(request: MCPRequest): Promise<any> {
  switch (request.method) {
    case 'tools/list':
      return { tools: listTools() };
    case 'tools/call':
      return callTool(request.params.name, request.params.arguments || {});
    default:
      throw new Error(`Unknown MCP method: ${request.method}`);
  }
}

export { bridge };
export default { connect, registerTool, listTools, callTool, handleMCPRequest, bridge };
