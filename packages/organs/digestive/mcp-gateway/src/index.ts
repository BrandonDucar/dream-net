import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
    listTools,
    getToolConfig,
    executeTool
} from "@dreamnet/agent-gateway";

/**
 * DreamNet MCP Gateway
 * Standardized Model Context Protocol adapter for DreamNet internal tools.
 */
const server = new Server(
    {
        name: "dreamnet-gateway",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * Handler for listing available tools.
 * Exposes internal agent-gateway tools as MCP tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = listTools();
    return {
        tools: tools.map((tool) => ({
            name: tool.id,
            description: tool.description || tool.label,
            inputSchema: {
                type: "object",
                properties: {
                    // Dynamic properties based on tool could be added here
                    // For now, we accept a generic payload
                    payload: { type: "object" }
                },
            },
        })),
    };
});

/**
 * Handler for executing tools.
 * Routes MCP tool calls to the internal agent-gateway executor.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Stub identity for the gateway - in production, this should be resolved from context/headers
    // For the MCP stdio transport, we might use a default "OPERATOR" or "SYSTEM" identity
    const mockRequest = {
        traceId: `mcp-${Date.now()}`,
        callerIdentity: {
            tierId: "OPERATOR", // Default to Operator for MCP calls for now
            isGodVault: false,
            officeIds: [],
            cabinetIds: ["DATA_PRIVACY_CABINET", "TREASURY_CABINET"], // Required for core env/api tools
        }
    } as any;

    try {
        const result = await executeTool(name, (args?.payload as any) || {}, mockRequest);

        if (!result.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Tool execution failed: ${result.error}`,
                    },
                ],
                isError: true,
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result.data, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text",
                    text: `Gateway Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

/**
 * Start the server using stdio transport.
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("DreamNet MCP Gateway running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in MCP Gateway:", error);
    process.exit(1);
});
