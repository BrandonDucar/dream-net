/**
 * DreamNet Agent Client - Example Usage
 * TypeScript/JavaScript example
 */

import { DreamNetAgent } from "./dreamnet-agent";

async function main() {
  const apiKey = process.env.DREAMNET_API_KEY;
  if (!apiKey) {
    throw new Error("Set DREAMNET_API_KEY in your environment");
  }

  const agent = new DreamNetAgent({
    apiKey,
    maxRetries: 4,
    retryBaseDelayMs: 500,
  });

  // Natural language interface
  console.log("🤖 Using natural language interface...");
  const nlResponse = await agent.autonomousQuery("Show me DreamNet status");
  console.log("NL response:", JSON.stringify(nlResponse, null, 2));

  // Structured calls
  console.log("\n📊 Getting system status...");
  const status = await agent.checkSystemStatus();
  console.log("System status:", JSON.stringify(status, null, 2));

  console.log("\n🚀 Listing Vercel projects...");
  const projects = await agent.listVercelProjects();
  console.log("Vercel projects:", JSON.stringify(projects, null, 2));

  console.log("\n🧹 Analyzing cleanup opportunities...");
  const cleanup = await agent.analyzeCleanupOpportunities({
    targetDomain: "dreamnet.ink",
  });
  console.log("Cleanup opportunities:", JSON.stringify(cleanup, null, 2));

  console.log("\n🛡️ Getting Shield threats...");
  const threats = await agent.getShieldThreats({ limit: 20 });
  console.log("Shield threats:", JSON.stringify(threats, null, 2));

  console.log("\n💭 Querying dreams...");
  const dreams = await agent.queryDreams({ limit: 10 });
  console.log("Dreams:", JSON.stringify(dreams, null, 2));

  console.log("\n🐺 Getting Wolf Pack opportunities...");
  const opportunities = await agent.getWolfPackOpportunities({ limit: 10 });
  console.log("Wolf Pack opportunities:", JSON.stringify(opportunities, null, 2));

  console.log("\n✅ All operations completed!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});







