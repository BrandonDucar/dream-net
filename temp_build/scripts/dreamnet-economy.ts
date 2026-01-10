#!/usr/bin/env tsx
/**
 * DreamNet Economic Analysis Script
 * Queries DreamNet's Economic Brain for token/liquidity analysis
 * 
 * Usage:
 *   pnpm tsx scripts/dreamnet-economy.ts [query]
 * 
 * Examples:
 *   pnpm tsx scripts/dreamnet-economy.ts "What's the current DREAM/SHEEP liquidity?"
 *   pnpm tsx scripts/dreamnet-economy.ts "Show me treasury balance and flows"
 *   pnpm tsx scripts/dreamnet-economy.ts "Analyze token economics"
 */

import { dnEconomy } from "@dreamnet/dreamnet-bridge";

async function main() {
  const query = process.argv[2];
  
  if (!query) {
    console.error("❌ Error: Query required");
    console.error("\nUsage: pnpm tsx scripts/dreamnet-economy.ts \"your query\"");
    console.error("\nExamples:");
    console.error('  pnpm tsx scripts/dreamnet-economy.ts "What\'s the current DREAM/SHEEP liquidity?"');
    console.error('  pnpm tsx scripts/dreamnet-economy.ts "Show me treasury balance"');
    process.exit(1);
  }
  
  console.log("💰 Querying DreamNet Economic Brain...\n");
  console.log(`Query: ${query}\n`);
  
  try {
    const result = await dnEconomy(query);
    console.log("✅ Economic Analysis:");
    console.log("─".repeat(60));
    console.log(result);
    console.log("─".repeat(60));
  } catch (error: any) {
    console.error("❌ Error querying Economic Brain:");
    console.error(error.message);
    process.exit(1);
  }
}

main();

