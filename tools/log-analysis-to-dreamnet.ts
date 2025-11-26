#!/usr/bin/env node
/**
 * Log Analysis to DreamNet
 * 
 * Reads analysis data from JSON file (CLI arg or stdin) and stores it in DreamNet memory.
 * 
 * Usage:
 *   tsx tools/log-analysis-to-dreamnet.ts analysis.json
 *   cat analysis.json | tsx tools/log-analysis-to-dreamnet.ts
 * 
 * Environment Variables:
 *   DREAMNET_API_KEY - Required: DreamNet API key
 *   DREAMNET_BASE_URL - Optional: DreamNet base URL (default: http://localhost:3000)
 */

import { readFileSync } from "node:fs";
import { createClient } from "../packages/cursor-dreamnet-client/index.js";

interface AnalysisInput {
  title: string;
  content: string;
  findings: string[];
  recommendations: string[];
}

/**
 * Read JSON from file path
 */
function readAnalysisInputFromFile(filePath: string): AnalysisInput {
  try {
    const jsonContent = readFileSync(filePath, "utf-8");
    return JSON.parse(jsonContent);
  } catch (error: any) {
    console.error(`❌ Failed to read file: ${filePath}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Read JSON from stdin
 */
async function readAnalysisInputFromStdin(): Promise<AnalysisInput> {
  return new Promise<AnalysisInput>((resolve, reject) => {
    let stdinData = "";

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      stdinData += chunk;
    });

    process.stdin.on("end", () => {
      try {
        if (!stdinData.trim()) {
          reject(new Error("No data received from stdin"));
          return;
        }
        const data = JSON.parse(stdinData);
        resolve(data);
      } catch (error: any) {
        reject(new Error(`Failed to parse JSON from stdin: ${error.message}`));
      }
    });

    process.stdin.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Main function
 */
async function main() {
  try {
    // Check for API key
    const apiKey = process.env.DREAMNET_API_KEY;
    if (!apiKey) {
      console.error("❌ DREAMNET_API_KEY environment variable is required");
      console.error("   Set it with: export DREAMNET_API_KEY=your-api-key");
      process.exit(1);
    }

    // Get base URL (optional)
    const baseUrl = process.env.DREAMNET_BASE_URL || "http://localhost:3000";

    // Read analysis input
    const filePath = process.argv[2];
    let analysis: AnalysisInput;

    if (filePath) {
      // Read from file
      analysis = readAnalysisInputFromFile(filePath);
    } else {
      // Read from stdin
      try {
        analysis = await readAnalysisInputFromStdin();
      } catch (error: any) {
        console.error(`❌ Failed to read from stdin`);
        console.error(`   Error: ${error.message}`);
        process.exit(1);
      }
    }

    // Validate input
    if (!analysis.title || !analysis.content) {
      console.error("❌ Invalid analysis input: title and content are required");
      console.error("   Expected format: { title: string, content: string, findings?: string[], recommendations?: string[] }");
      process.exit(1);
    }

    // Initialize DreamNet client
    console.log(`🔗 Connecting to DreamNet at ${baseUrl}...`);
    const client = createClient({
      apiKey,
      baseUrl,
    });

    // Check health
    const isHealthy = await client.isHealthy();
    if (!isHealthy) {
      console.warn("⚠️  DreamNet health check failed, but continuing...");
    } else {
      console.log("✅ DreamNet connection healthy");
    }

    // Store analysis in memory
    console.log(`📝 Storing analysis: "${analysis.title}"...`);
    const memory = client.getMemory();

    try {
      // Store as cursor analysis
      const storedDream = await memory.storeCursorAnalysis({
        title: analysis.title,
        content: analysis.content,
        findings: analysis.findings || [],
        recommendations: analysis.recommendations || [],
        metadata: {
          type: "log_analysis",
        },
      });

      console.log(`✅ Analysis stored in DreamVault`);
      console.log(`   Dream ID: ${storedDream.id}`);
      console.log(`   Title: ${storedDream.title}`);

      // Log action
      try {
        await memory.logCursorAction("analysis", {
          title: analysis.title,
          findings: analysis.findings || [],
          recommendations: analysis.recommendations || [],
          dreamId: storedDream.id,
        });

        console.log(`✅ Action logged to event stream`);
      } catch (actionError: any) {
        console.warn(`⚠️  Failed to log action: ${actionError.message}`);
        // Don't fail the whole operation if action logging fails
      }

      // Success output
      console.log(`\n🎉 Success! Analysis stored in DreamNet memory.`);
      console.log(`   Dream ID: ${storedDream.id}`);
      console.log(`   Type: ${storedDream.type || "log_analysis"}`);
      if (storedDream.tags) {
        console.log(`   Tags: ${storedDream.tags.join(", ")}`);
      }

      process.exit(0);
    } catch (error: any) {
      console.error(`❌ Failed to store analysis in DreamNet`);
      console.error(`   Error: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack}`);
      }
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`❌ Unexpected error`);
    console.error(`   Error: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack}`);
    }
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error(`❌ Fatal error:`, error);
  process.exit(1);
});

