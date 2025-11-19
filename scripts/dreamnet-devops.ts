#!/usr/bin/env tsx
/**
 * DreamNet DevOps / DeployKeeper Script
 * Gets deployment summary and infrastructure recommendations
 * 
 * Usage:
 *   pnpm tsx scripts/dreamnet-devops.ts [query]
 * 
 * Examples:
 *   pnpm tsx scripts/dreamnet-devops.ts
 *   pnpm tsx scripts/dreamnet-devops.ts "Get deployment summary"
 *   pnpm tsx scripts/dreamnet-devops.ts "What infrastructure changes are recommended?"
 */

import { dnDevOps } from "@dreamnet/dreamnet-bridge";

async function main() {
  const query = process.argv[2] || "Get deployment summary for DreamNet";
  
  console.log("🚀 Querying DeployKeeper...\n");
  console.log(`Query: ${query}\n`);
  
  try {
    const result = await dnDevOps(query);
    console.log("✅ DeployKeeper Response:");
    console.log("─".repeat(60));
    console.log(result);
    console.log("─".repeat(60));
  } catch (error: any) {
    console.error("❌ Error querying DeployKeeper:");
    console.error(error.message);
    process.exit(1);
  }
}

main();

