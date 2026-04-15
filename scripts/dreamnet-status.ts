#!/usr/bin/env tsx
/**
 * DreamNet System Status Script
 * Uses DreamNet bridge to get high-level system status
 * 
 * Usage:
 *   pnpm tsx scripts/dreamnet-status.ts
 */

import { dnStatus } from "@dreamnet/dreamnet-bridge";

async function main() {
  console.log("🔍 Fetching DreamNet system status...\n");
  
  try {
    const status = await dnStatus();
    console.log("✅ DreamNet Status:");
    console.log("─".repeat(60));
    console.log(status);
    console.log("─".repeat(60));
  } catch (error: any) {
    console.error("❌ Error fetching DreamNet status:");
    console.error(error.message);
    process.exit(1);
  }
}

main();

