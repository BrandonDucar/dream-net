/**
 * DreamNet Wolf Pack Funding Service
 * 
 * Standalone backend worker that:
 * 1. Runs WolfPackFundingCore to score leads & generate email drafts
 * 2. Runs WolfPackMailerCore to send pending emails via SMTP
 * 
 * This service runs independently of the main DreamNet orchestrator.
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";

// Minimal context for WolfPackFundingCore; can be expanded later.
const ctx = {
  reputationLattice: undefined,
  fieldLayer: undefined,
  dreamTankCore: undefined,
  economicEngineCore: undefined,
  narrativeField: undefined,
  agentRegistryCore: undefined,
  neuralMesh: undefined,
};

/**
 * Run a single funding cycle:
 * - Score leads
 * - Generate email drafts
 * - Enqueue send-queue items
 */
async function runFundingCycleOnce() {
  console.log("[WolfPackFundingService] Running funding cycle...");
  
  try {
    const status = WolfPackFundingCore.run(ctx);
    
    console.log("[WolfPackFundingService] Funding status:", {
      leadCount: status.leadCount,
      queueCount: status.queueCount,
      pendingCount: status.pendingCount,
      hotLeadCount: status.hotLeadCount,
    });
    
    return status;
  } catch (err: any) {
    console.error("[WolfPackFundingService] Error in funding cycle:", err);
    throw err;
  }
}

/**
 * Process the send queue once:
 * - Send pending emails via SMTP
 * - Update queue item statuses
 */
async function sendQueueOnce() {
  console.log("[WolfPackFundingService] Processing send queue...");
  
  try {
    await WolfPackMailerCore.processSendQueueOnce();
    
    const status = WolfPackFundingCore.status();
    
    console.log("[WolfPackFundingService] Queue status after send:", {
      queueCount: status.queueCount,
      pendingCount: status.pendingCount,
    });
  } catch (err: any) {
    console.error("[WolfPackFundingService] Error in send queue:", err);
    throw err;
  }
}

/**
 * Main service entry point
 */
async function main() {
  console.log("===============================================");
  console.log(" DreamNet Wolf Pack Funding Service ONLINE");
  console.log("===============================================");
  console.log("");

  // Check required environment variables
  const requiredEnvVars = [
    "WOLFMAIL_SMTP_PASS",
  ];
  
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error("[WolfPackFundingService] Missing required environment variables:");
    missingVars.forEach((varName) => {
      console.error(`  - ${varName}`);
    });
    console.error("");
    console.error("Please set these variables before running the service.");
    process.exit(1);
  }

  // Initial run
  console.log("[WolfPackFundingService] Running initial cycle...");
  try {
    await runFundingCycleOnce();
    await sendQueueOnce();
  } catch (err: any) {
    console.error("[WolfPackFundingService] Error in initial cycle:", err);
    // Continue anyway - might be missing leads or other non-fatal issues
  }

  // Schedule periodic cycles
  const intervalMinutes = Number(process.env.WOLF_FUNDING_INTERVAL_MIN || "30");
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log("");
  console.log(
    `[WolfPackFundingService] Scheduling funding cycle every ${intervalMinutes} minutes...`
  );
  console.log("[WolfPackFundingService] Service is running. Press Ctrl+C to stop.");
  console.log("");

  setInterval(async () => {
    try {
      console.log("\n=== Wolf Pack Funding Cycle ===");
      await runFundingCycleOnce();
      await sendQueueOnce();
      console.log("=== Cycle Complete ===\n");
    } catch (err: any) {
      console.error("[WolfPackFundingService] Error in scheduled cycle:", err);
      // Continue running - don't crash on individual cycle errors
    }
  }, intervalMs);
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[WolfPackFundingService] Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[WolfPackFundingService] Shutting down gracefully...");
  process.exit(0);
});

// Start the service
main().catch((err) => {
  console.error("[WolfPackFundingService] Fatal error:", err);
  process.exit(1);
});

