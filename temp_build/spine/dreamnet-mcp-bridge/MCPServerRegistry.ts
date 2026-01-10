import { MCPServer, MCPTool, MCPResource, MCPPermissions } from './MCPServerTypes';
import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';

/**
 * MCP Server Registry
 * 
 * Central registry for all MCP servers, tools, and resources.
 * Manages permissions and access control.
 */
export class MCPServerRegistry {
    private servers: Map<string, MCPServer> = new Map();
    private eventBus?: DreamEventBus;

    constructor(eventBus?: DreamEventBus) {
        this.eventBus = eventBus;
    }

    /**
     * Register an MCP server
     */
    public registerServer(server: MCPServer): void {
        this.servers.set(server.id, server);

        if (this.eventBus) {
            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'MCP.ServerRegistered',
                    'mcp-server-registry',
                    { serverId: server.id, serverName: server.name, toolCount: server.tools.length }
                )
            );
        }

        console.log(`[MCPServerRegistry] Registered server: ${server.name} (${server.tools.length} tools)`);
    }

    /**
     * Unregister an MCP server
     */
    public unregisterServer(serverId: string): boolean {
        const existed = this.servers.delete(serverId);

        if (existed && this.eventBus) {
            this.eventBus.publish(
                this.eventBus.createEnvelope(
                    'MCP.ServerUnregistered',
                    'mcp-server-registry',
                    { serverId }
                )
            );
        }

        return existed;
    }

    /**
     * Get server by ID
     */
    public getServer(serverId: string): MCPServer | undefined {
        return this.servers.get(serverId);
    }

    /**
     * Get server by tool name
     */
    public getServerByTool(toolName: string): MCPServer | undefined {
        for (const server of this.servers.values()) {
            if (server.tools.some(t => t.name === toolName)) {
                return server;
            }
        }
        return undefined;
    }

    /**
     * Get server by resource URI
     */
    public getServerByResource(uri: string): MCPServer | undefined {
        for (const server of this.servers.values()) {
            if (server.resources.some(r => r.uri === uri || uri.startsWith(r.uri))) {
                return server;
            }
        }
        return undefined;
    }

    /**
     * List all servers
     */
    public listServers(): MCPServer[] {
        return Array.from(this.servers.values());
    }

    /**
     * List all tools across all servers
     */
    public listAllTools(): Array<{ server: MCPServer; tool: MCPTool }> {
        const tools: Array<{ server: MCPServer; tool: MCPTool }> = [];

        for (const server of this.servers.values()) {
            for (const tool of server.tools) {
                tools.push({ server, tool });
            }
        }

        return tools;
    }

    /**
     * Check if an agent/identity has permission to use a server
     */
    public checkPermission(
        serverId: string,
        agentId: string,
        identityId: string,
        passportTier?: string
    ): { allowed: boolean; reason?: string } {
        const server = this.servers.get(serverId);

        if (!server) {
            return { allowed: false, reason: 'Server not found' };
        }

        const { allowedAgents, allowedIdentities, allowedTiers, requiresApproval } = server.permissions;

        // Check if requires approval
        if (requiresApproval) {
            return { allowed: false, reason: 'Requires admin approval' };
        }

        // Check agent allowlist
        if (allowedAgents.length > 0 && !allowedAgents.includes(agentId)) {
            return { allowed: false, reason: 'Agent not authorized' };
        }

        // Check identity allowlist
        if (allowedIdentities.length > 0 && !allowedIdentities.includes(identityId)) {
            return { allowed: false, reason: 'Identity not authorized' };
        }

        // Check tier allowlist
        if (allowedTiers && allowedTiers.length > 0 && passportTier && !allowedTiers.includes(passportTier)) {
            return { allowed: false, reason: 'Insufficient passport tier' };
        }

        return { allowed: true };
    }

    /**
     * Get tool by name
     */
    public getTool(toolName: string): { server: MCPServer; tool: MCPTool } | undefined {
        for (const server of this.servers.values()) {
            const tool = server.tools.find(t => t.name === toolName);
            if (tool) {
                return { server, tool };
            }
        }
        return undefined;
    }

    /**
     * Get resource by URI
     */
    public getResource(uri: string): { server: MCPServer; resource: MCPResource } | undefined {
        for (const server of this.servers.values()) {
            const resource = server.resources.find(r => r.uri === uri || uri.startsWith(r.uri));
            if (resource) {
                return { server, resource };
            }
        }
        return undefined;
    }
}
