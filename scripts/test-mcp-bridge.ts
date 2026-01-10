import { MCPBridgeV2 } from "../spine/dreamnet-mcp-bridge/MCPBridgeV2.js";

async function testMCPBridge() {
    console.log("🔌 Testing MCP Bridge V2...");

    const bridge = MCPBridgeV2.getInstance();

    try {
        // Example: Connect to a filesystem MCP server
        // Note: This requires the MCP server to be installed
        // Install with: npm install -g @modelcontextprotocol/server-filesystem

        await bridge.connectServer({
            name: "filesystem",
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", process.cwd()],
        });

        // List available tools
        const tools = await bridge.listTools("filesystem");
        console.log("✅ Available tools:", tools.map(t => t.name));

        // Example tool call: read a file
        const result = await bridge.callTool("filesystem", "read_file", {
            path: "package.json",
        });

        console.log("✅ Tool call successful!");
        console.log("📄 File content preview:", result.content[0].text.substring(0, 200) + "...");

        await bridge.disconnectAll();
        console.log("🎉 MCP Bridge V2 is working! The agents have senses.");

    } catch (error) {
        console.error("❌ MCP Bridge Test Failed:", error);
        await bridge.disconnectAll();
        process.exit(1);
    }
}

testMCPBridge();
