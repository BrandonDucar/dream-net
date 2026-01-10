/**
 * MCP Server
 * 
 * Represents an MCP server with tools, resources, and permissions
 */
export interface MCPServer {
    id: string;
    name: string;
    type: 'internal' | 'external';
    tools: MCPTool[];
    resources: MCPResource[];
    permissions: MCPPermissions;
    authentication?: MCPAuth;
    metadata?: Record<string, any>;
}

/**
 * MCP Tool
 * 
 * A tool provided by an MCP server
 */
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: any;
    outputSchema?: any;
    costEstimate?: number; // In SHEEP tokens
    requiresApproval?: boolean;
}

/**
 * MCP Resource
 * 
 * A resource (data source) provided by an MCP server
 */
export interface MCPResource {
    uri: string;
    type: 'read' | 'write' | 'read-write';
    description: string;
    schema?: any;
}

/**
 * MCP Permissions
 * 
 * Access control for MCP server
 */
export interface MCPPermissions {
    allowedAgents: string[]; // Agent IDs that can use this server
    allowedIdentities: string[]; // Identity IDs that can use this server
    allowedTiers?: string[]; // Passport tiers that can use this server
    requiresApproval: boolean; // Requires admin approval for access
}

/**
 * MCP Authentication
 * 
 * Authentication configuration for external MCP servers
 */
export interface MCPAuth {
    type: 'api-key' | 'oauth' | 'none';
    config?: Record<string, any>;
}
