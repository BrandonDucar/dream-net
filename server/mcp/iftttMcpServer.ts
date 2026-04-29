import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { IftttService } from "../services/IftttService.js";

// Initialize the MCP Server strictly following the protocol
const server = new McpServer({
  name: "DreamNet-IFTTT-MCP",
  version: "1.0.0",
});

// Register the tool
server.tool(
  "trigger_ifttt_event",
  "Triggers a configured IFTTT Webhook applet event",
  {
    event: z.string().describe("The name of the IFTTT Webhook event to trigger"),
    value1: z.string().optional().describe("Optional payload value 1"),
    value2: z.string().optional().describe("Optional payload value 2"),
    value3: z.string().optional().describe("Optional payload value 3"),
  },
  async ({ event, value1, value2, value3 }) => {
    try {
      await IftttService.triggerWebhook(event, { value1, value2, value3 });
      return {
        content: [
          {
            type: "text",
            text: `Successfully sent trigger for event: ${event}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to trigger event ${event}: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function runMcpServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("IFTTT MCP Server connected via stdio");
}

if (require.main === module) {
  runMcpServer().catch((error) => {
    console.error("MCP Server Error:", error);
    process.exit(1);
  });
}
