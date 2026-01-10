import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export interface MCPServerConfig {
    name: string;
    command: string;
    args: string[];
    env?: Record<string, string>;
}

export class MCPBridgeV2 {
    private static instance: MCPBridgeV2;
    private clients: Map<string, Client> = new Map();
    private transports: Map<string, StdioClientTransport> = new Map();

    private constructor() { }

    public static getInstance(): MCPBridgeV2 {
        if (!MCPBridgeV2.instance) {
            MCPBridgeV2.instance = new MCPBridgeV2();
        }
        return MCPBridgeV2.instance;
    }

    /**
     * Connect to an MCP server
     */
    public async connectServer(config: MCPServerConfig): Promise<void> {
        try {
            const transport = new StdioClientTransport({
                command: config.command,
                args: config.args,
                env: config.env,
            });

            const client = new Client(
                {
                    name: `dreamnet-${config.name}`,
                    version: "1.0.0",
                },
                {
                    capabilities: {},
                }
            );

            await client.connect(transport);

            this.clients.set(config.name, client);
            this.transports.set(config.name, transport);

            console.log(`✅ MCP Server '${config.name}' connected`);
        } catch (error) {
            console.error(`❌ Failed to connect to MCP server '${config.name}':`, error);
            throw error;
        }
    }

    /**
     * List available tools from a connected server
     */
    public async listTools(serverName: string): Promise<any[]> {
        const client = this.clients.get(serverName);
        if (!client) {
            throw new Error(`Server '${serverName}' not connected`);
        }

        const response = await client.listTools();
        return response.tools;
    }

    /**
     * Call a tool on a connected server
     */
    public async callTool(
        serverName: string,
        toolName: string,
        args: Record<string, any>
    ): Promise<any> {
        const client = this.clients.get(serverName);
        if (!client) {
            throw new Error(`Server '${serverName}' not connected`);
        }

        const response = await client.callTool({
            name: toolName,
            arguments: args,
        });

        return response;
    }

    /**
     * Disconnect from a server
     */
    public async disconnectServer(serverName: string): Promise<void> {
        const client = this.clients.get(serverName);
        const transport = this.transports.get(serverName);

        if (client) {
            await client.close();
            this.clients.delete(serverName);
        }

        if (transport) {
            await transport.close();
            this.transports.delete(serverName);
        }

        console.log(`🔌 MCP Server '${serverName}' disconnected`);
    }

    /**
     * Disconnect from all servers
     */
    public async disconnectAll(): Promise<void> {
        const serverNames = Array.from(this.clients.keys());
        await Promise.all(serverNames.map((name) => this.disconnectServer(name)));
    }
}
