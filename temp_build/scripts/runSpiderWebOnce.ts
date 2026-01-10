/**
 * Run Spider Web cycle once
 * Tests the complete interweave layer with fly-catching and thread execution
 */

import { SpiderWebCore } from "@dreamnet/spider-web-core";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WhalePackCore } from "@dreamnet/whale-pack-core";
import { OrcaPackCore } from "@dreamnet/orca-pack-core";
import { DreamStateCore } from "@dreamnet/dream-state-core";

const ctx = {
  wolfPackCore: WolfPackFundingCore,
  whalePackCore: WhalePackCore,
  orcaPackCore: OrcaPackCore,
  dreamStateCore: DreamStateCore,
  dreamNetOSCore: undefined,
  narrativeField: undefined,
  dataVaultCore: undefined,
  economicEngineCore: undefined,
  neuralMesh: undefined,
};

async function main() {
  console.log("===============================================");
  console.log(" 🕸️  Spider Web - Complete Cycle");
  console.log("===============================================");
  console.log("");

  // Ensure sensors and templates are initialized
  SpiderWebCore.ensureDefaultSensors();
  SpiderWebCore.ensureDefaultTemplates();

  // Create a test fly to catch
  console.log("🪰 Creating test fly...");
  const testFly = SpiderWebCore.createFly(
    "message",
    "twilio",
    { message: "Test message from Twilio", from: "+1234567890" },
    "high",
    true
  );
  console.log(`   ✅ Fly created: ${testFly.id} (${testFly.type} from ${testFly.source})`);
  console.log("");

  // Catch the fly (creates thread)
  console.log("🕷️  Catching fly...");
  const thread = SpiderWebCore.catchFly(testFly);
  if (thread) {
    console.log(`   ✅ Fly caught! Thread created: ${thread.id}`);
    console.log(`      Kind: ${thread.kind}`);
    console.log(`      Priority: ${thread.priority}`);
    console.log(`      Targets: ${thread.targets.map((t) => t.kind).join(", ")}`);
  }
  console.log("");

  // Run Spider Web cycle
  console.log("🔄 Running Spider Web cycle...");
  const status = await SpiderWebCore.run(ctx);

  console.log("");
  console.log("✅ Cycle Complete");
  console.log("");
  console.log("📊 Thread Metrics:");
  console.log(`   Total Threads: ${status.threadCount}`);
  console.log(`   Pending: ${status.pendingCount}`);
  console.log(`   In Progress: ${status.inProgressCount}`);
  console.log(`   Completed: ${status.completedCount}`);
  console.log(`   Failed: ${status.failedCount}`);
  console.log(`   Success Rate: ${(status.threadSuccessRate * 100).toFixed(1)}%`);
  console.log(`   Avg Execution Time: ${status.avgExecutionTime.toFixed(0)}ms`);
  console.log("");

  console.log("🪰 Fly Metrics:");
  console.log(`   Total Flies: ${status.flyCount}`);
  console.log(`   Caught Today: ${status.fliesCaughtToday}`);
  console.log(`   Sticky Flies: ${status.stickyFlyCount}`);
  console.log("");

  console.log("📡 Sensor Metrics:");
  console.log(`   Active Sensors: ${status.activeSensors}`);
  status.activeSensorsList.forEach((sensor) => {
    console.log(`   - ${sensor.type}: ${sensor.catchRate.toFixed(1)} flies/hour`);
  });
  console.log("");

  console.log("📋 Templates & Patterns:");
  console.log(`   Templates: ${status.templateCount}`);
  console.log(`   Patterns: ${status.patternCount}`);
  console.log("");

  console.log("🕸️  Sample Threads:");
  status.sampleThreads.slice(0, 5).forEach((thread) => {
    console.log(`   - ${thread.kind}: ${thread.source.kind} → ${thread.targets.map((t) => t.kind).join(", ")}`);
    console.log(`     Status: ${thread.status} | Priority: ${thread.priority} | Executable: ${thread.executable}`);
  });
  console.log("");

  console.log("🪰 Sample Flies:");
  status.sampleFlies.slice(0, 3).forEach((fly) => {
    console.log(`   - ${fly.type} from ${fly.source} (${fly.priority})`);
    console.log(`     Sticky: ${fly.sticky} | Processed: ${fly.processed}`);
  });
  console.log("");

  console.log("🧵 Sample Insights:");
  status.sampleInsights.slice(0, 3).forEach((insight) => {
    console.log(`   - [${insight.type}] ${insight.title}`);
  });
  console.log("");

  console.log("===============================================");
  console.log(" 🕸️  Spider Web Status");
  console.log("===============================================");
  console.log("");
  console.log("💡 Features Active:");
  console.log("   ✅ Fly-catching system");
  console.log("   ✅ Thread execution engine");
  console.log("   ✅ Thread templates");
  console.log("   ✅ Pattern learning");
  console.log("   ✅ Sensor system");
  console.log("   ✅ Priority routing");
  console.log("   ✅ Dependency checking");
  console.log("");
}

main().catch(console.error);
