/**
 * Agent Registry Integration
 * Registers WebOpsAgent and BrowserSurgeon with the agent registry
 */
import { WebOpsAgentConfig } from "../config/webops-agent";
import { BrowserSurgeonConfig } from "../config/browser-surgeon";
/**
 * Register browser-capable agents with the agent registry
 */
export async function registerBrowserAgents() {
    const { AgentRegistryCore, AgentConfig } = await getAgentRegistry();
    // Register WebOpsAgent
    const webOpsAgentConfig = {
        id: "WebOpsAgent",
        name: "WebOpsAgent",
        kind: "infra",
        description: WebOpsAgentConfig.description,
        subsystem: "BrowserAgentCore",
        tags: ["browser", "automation", "devops", "web-ops"],
    };
    AgentRegistryCore.upsertAgentConfig(webOpsAgentConfig);
    console.log("✅ [BrowserAgentCore] Registered WebOpsAgent");
    // Register BrowserSurgeon
    const browserSurgeonConfig = {
        id: "BrowserSurgeon",
        name: "BrowserSurgeon",
        kind: "infra",
        description: BrowserSurgeonConfig.description,
        subsystem: "BrowserAgentCore",
        tags: ["browser", "automation", "diagnostics", "repair"],
    };
    AgentRegistryCore.upsertAgentConfig(browserSurgeonConfig);
    console.log("✅ [BrowserAgentCore] Registered BrowserSurgeon");
}
/**
 * Initialize browser agent integration
 * Call this during system startup
 */
export async function initBrowserAgentIntegration() {
    try {
        await registerBrowserAgents();
        console.log("🌐 [BrowserAgentCore] Agent registry integration complete");
    }
    catch (error) {
        console.warn("[BrowserAgentCore] Failed to register agents:", error.message);
    }
}
