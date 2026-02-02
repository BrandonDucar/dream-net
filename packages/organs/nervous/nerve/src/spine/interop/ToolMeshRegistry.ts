/**
 * 🕸️ ToolMeshRegistry: The MCP Substrate
 * 
 * Role: Standardizes tool discovery and execution across the DreamNet mesh
 * using patterns inspired by the Model Context Protocol (MCP).
 */

import { dreamEventBus } from '../dreamnet-event-bus/index.js';

export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: any; // JSON Schema
    agentId: string;
}

export interface ToolExecutionRequest {
    toolName: string;
    arguments: any;
    requesterId: string;
}

export class ToolMeshRegistry {
    private static instance: ToolMeshRegistry;
    private tools: Map<string, ToolDefinition> = new Map();

    private constructor() {
        console.log("🕸️ [ToolMesh] Avenue 11: MCP Registry Active.");
    }

    public static getInstance(): ToolMeshRegistry {
        if (!ToolMeshRegistry.instance) {
            ToolMeshRegistry.instance = new ToolMeshRegistry();
        }
        return ToolMeshRegistry.instance;
    }

    /**
     * registerTool
     * Agents call this to announce their capabilities to the mesh.
     */
    public registerTool(tool: ToolDefinition) {
        console.log(`🕸️ [ToolMesh] Registering Tool: ${tool.name} from Agent ${tool.agentId}`);
        this.tools.set(tool.name, tool);

        dreamEventBus.publish({
            type: 'System.ToolRegistered',
            source: 'ToolMesh',
            payload: { tool, timestamp: Date.now() }
        });
    }

    /**
     * listTools
     * Returns all available tools for context construction.
     */
    public listTools(): ToolDefinition[] {
        return Array.from(this.tools.values());
    }

    /**
     * callTool
     * Routes a tool execution request to the responsible agent.
     */
    public async callTool(request: ToolExecutionRequest) {
        const tool = this.tools.get(request.toolName);
        if (!tool) {
            throw new Error(`Tool ${request.toolName} not found in the mesh.`);
        }

        console.log(`🕸️ [ToolMesh] Routing Call: ${request.toolName} -> Agent ${tool.agentId}`);

        // Broadcast the request; the owning agent must listen and respond
        dreamEventBus.publish({
            type: 'System.ToolCall',
            source: 'ToolMesh',
            payload: { ...request, targetAgentId: tool.agentId, timestamp: Date.now() }
        });
    }
}

export const toolMesh = ToolMeshRegistry.getInstance();
