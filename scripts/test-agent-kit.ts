import { AgentKitService } from "../server/services/AgentKitService.js";

async function testAgentKit() {
    console.log("🐺 Testing Wolf Pack Agent Kit Integration...");

    try {
        const service = await AgentKitService.getInstance();

        // Simple test: Ask the agent for its wallet address
        const response = await service.execute("What is my wallet address?");

        console.log("✅ Agent Response:", response);
        console.log("🎉 Agent Kit is working! The Wolf Pack has hands.");

    } catch (error) {
        console.error("❌ Agent Kit Test Failed:", error);
        process.exit(1);
    }
}

testAgentKit();
