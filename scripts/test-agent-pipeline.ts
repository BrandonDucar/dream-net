/**
 * Test Agent Pipeline
 * 
 * Tests the end-to-end flow: Agent 1 → Agent 2
 */

import { generateSnapshot } from "../server/services/SnapshotGenerator.js";
import { runDroneDomeAnalysis } from "../server/services/DroneDomeScanner.js";
import { getLatestOutput } from "../server/services/AgentOutputStore.js";
import { validateDependencies } from "../server/services/AgentHelpers.js";

async function testPipeline() {
  console.log("🧪 Testing Agent Pipeline (Agent 1 → Agent 2)\n");

  try {
    // Step 1: Generate snapshot (Agent 1)
    console.log("📸 Step 1: Generating vertex_fusion_snapshot (Agent 1)...");
    const snapshot = await generateSnapshot();
    console.log(`✅ Snapshot generated:`);
    console.log(`   - Agents: ${snapshot.domains.ai_agents.length}`);
    console.log(`   - Apps: ${snapshot.domains.apps.length}`);
    console.log(`   - Services: ${snapshot.domains.services.length}`);
    console.log(`   - Integrations: ${snapshot.domains.integrations.length}`);
    console.log(`   - Infra: ${snapshot.domains.infra.length}\n`);

    // Verify snapshot was stored
    const storedSnapshot = await getLatestOutput(1, "vertex_fusion_snapshot");
    if (!storedSnapshot) {
      throw new Error("Snapshot was not stored!");
    }
    console.log("✅ Snapshot stored successfully\n");

    // Step 2: Validate Agent 2 dependencies
    console.log("🔍 Step 2: Validating Agent 2 dependencies...");
    const deps = await validateDependencies(2);
    if (!deps.valid) {
      throw new Error(`Missing dependencies: ${deps.missing.join(", ")}`);
    }
    console.log(`✅ Dependencies valid: ${deps.available.join(", ")}\n`);

    // Step 3: Run drone dome analysis (Agent 2)
    console.log("🛸 Step 3: Running drone dome analysis (Agent 2)...");
    const { report, commands } = await runDroneDomeAnalysis();
    console.log(`✅ Drone dome analysis complete:`);
    console.log(`   - Overall health: ${report.overall_health}`);
    console.log(`   - Risk zones: ${report.risk_zones.length}`);
    console.log(`   - Priority zones: ${report.priority_zones.length}`);
    console.log(`   - Commands generated: ${commands.length}\n`);

    // Verify outputs were stored
    const storedReport = await getLatestOutput(2, "drone_dome_report");
    const storedCommands = await getLatestOutput(2, "drone_dome_commands");
    
    if (!storedReport) {
      throw new Error("Drone dome report was not stored!");
    }
    if (!storedCommands) {
      throw new Error("Drone dome commands were not stored!");
    }
    console.log("✅ All outputs stored successfully\n");

    // Step 4: Display summary
    console.log("📊 Pipeline Test Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Agent 1 Output:`);
    console.log(`  - Snapshot version: ${snapshot.meta.snapshot_version}`);
    console.log(`  - Created at: ${snapshot.meta.created_at}`);
    console.log(`  - Total domains: ${Object.keys(snapshot.domains).length}`);
    console.log(`\nAgent 2 Output:`);
    console.log(`  - Overall health: ${report.overall_health}`);
    console.log(`  - Summary: ${report.summary}`);
    console.log(`  - Risk zones: ${report.risk_zones.length}`);
    console.log(`  - Priority zones: ${report.priority_zones.length}`);
    console.log(`  - Commands for downstream agents: ${commands.length}`);
    console.log(`\nCommands:`);
    commands.forEach((cmd, i) => {
      console.log(`  ${i + 1}. ${cmd.id} → Agent ${cmd.target_agent} (${cmd.priority})`);
      console.log(`     Goal: ${cmd.goal}`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("✅ Pipeline test PASSED!\n");
    return true;
  } catch (error: any) {
    console.error("❌ Pipeline test FAILED:", error.message);
    console.error(error.stack);
    return false;
  }
}

// Run test
testPipeline()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

