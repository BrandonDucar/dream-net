/**
 * Full System Test
 * Comprehensive test of all DreamNet systems
 */

import WebhookNervousCoreModule from "../packages/webhook-nervous-core/index";
import JaggyCoreModule from "../packages/jaggy-core/index";
import { APIKeeperCore } from "../packages/api-keeper-core/index";
import { AISEOCore } from "../packages/ai-seo-core/index";
import DreamNetOSCoreModule from "../packages/dreamnet-os-core/index";
import { autoOptimizeContent } from "../packages/ai-seo-core/logic/autoSEO";

// Handle default exports
const WebhookNervousCore = WebhookNervousCoreModule.default || WebhookNervousCoreModule;
const JaggyCore = JaggyCoreModule.default || JaggyCoreModule;
const DreamNetOSCore = DreamNetOSCoreModule.default || DreamNetOSCoreModule;

interface TestResult {
  system: string;
  status: "pass" | "fail" | "warning";
  message: string;
  details?: any;
  timestamp: number;
}

const results: TestResult[] = [];

function logTest(system: string, status: "pass" | "fail" | "warning", message: string, details?: any) {
  results.push({
    system,
    status,
    message,
    details,
    timestamp: Date.now(),
  });
  
  const emoji = status === "pass" ? "✅" : status === "fail" ? "❌" : "⚠️";
  console.log(`${emoji} [${system}] ${message}`);
  if (details) {
    console.log(`   Details:`, JSON.stringify(details, null, 2));
  }
}

async function runFullTest() {
  console.log("🧪 Starting Full System Test...\n");
  const startTime = Date.now();

  // ===== 1. WEBHOOK NERVOUS CORE =====
  console.log("\n📋 Testing Webhook Nervous Core (Biomimetic)...");
  try {
    // Test auto-discovery
    const discovered = WebhookNervousCore.autoDiscoverWebhooks
      ? WebhookNervousCore.autoDiscoverWebhooks()
      : [];
    logTest(
      "WebhookNervousCore",
      discovered.length > 0 ? "pass" : "warning",
      `Auto-discovered ${discovered.length} webhook(s)`,
      { discovered: discovered.length }
    );

    // Test status
    const webhookStatus = WebhookNervousCore.status();
    logTest(
      "WebhookNervousCore",
      "pass",
      `Status: ${webhookStatus.neurons.total} neurons, ${webhookStatus.synapses.total} synapses`,
      webhookStatus
    );

    // Test antibody creation
    WebhookNervousCore.autoCreateDefaultAntibodies();
    const antibodies = WebhookNervousCore.getAntibodies();
    logTest(
      "WebhookNervousCore",
      antibodies.length > 0 ? "pass" : "fail",
      `Created ${antibodies.length} security antibody(ies)`,
      { antibodies: antibodies.length }
    );
  } catch (error: any) {
    logTest("WebhookNervousCore", "fail", `Error: ${error.message}`, { error: error.message });
  }

  // ===== 2. JAGGY CORE =====
  console.log("\n📋 Testing Jaggy Core (The Silent Sentinel)...");
  try {
    // Test initialization
    if (JaggyCore.init) {
      JaggyCore.init();
    }
    const jaggyStatus = JaggyCore.status();
    logTest(
      "JaggyCore",
      "pass",
      `Jaggy is ${jaggyStatus.status}`,
      {
        stealth: jaggyStatus.stealthLevel,
        independence: jaggyStatus.independence,
        baseFame: jaggyStatus.baseFame,
        territories: jaggyStatus.territories.length,
      }
    );

    // Test territory creation
    const territories = JaggyCore.getTerritories();
    logTest(
      "JaggyCore",
      territories.length > 0 ? "pass" : "warning",
      `Watching ${territories.length} territory(ies)`,
      { territories: territories.map((t) => t.name) }
    );

    // Test mesh watching
    const testEvent = {
      event: "test_event",
      timestamp: new Date().toISOString(),
      initiator: "test",
      metadata: {
        title: "Test Event",
        emotions: [],
        webhookUrl: "https://hooks.slack.com/test",
      },
    };
    
    const alerts = JaggyCore.watchEvent(testEvent, "mesh");
    logTest(
      "JaggyCore",
      "pass",
      `Watched mesh event, generated ${alerts.length} alert(s)`,
      { alerts: alerts.length }
    );

    // Test hunts
    const hunts = JaggyCore.getActiveHunts();
    logTest(
      "JaggyCore",
      "pass",
      `Active hunts: ${hunts.length}`,
      { hunts: hunts.length }
    );
  } catch (error: any) {
    logTest("JaggyCore", "fail", `Error: ${error.message}`, { error: error.message });
  }

  // ===== 3. API KEEPER CORE =====
  console.log("\n📋 Testing API Keeper Core (Zero-Touch API Management)...");
  try {
    const apiStatus = APIKeeperCore.status();
    logTest(
      "APIKeeperCore",
      "pass",
      `Status: ${apiStatus.providerCount} providers, ${apiStatus.keyCount} keys`,
      {
        providers: apiStatus.providerCount,
        keys: apiStatus.keyCount,
        activeKeys: apiStatus.activeKeyCount,
        costToday: apiStatus.costToday,
      }
    );

    // Test auto-discovery
    const discoveryResult = APIKeeperCore.discoverAPIs();
    logTest(
      "APIKeeperCore",
      discoveryResult.discovered > 0 ? "pass" : "warning",
      `Discovered ${discoveryResult.discovered} API provider(s)`,
      discoveryResult
    );
  } catch (error: any) {
    logTest("APIKeeperCore", "fail", `Error: ${error.message}`, { error: error.message });
  }

  // ===== 4. AI SEO CORE =====
  console.log("\n📋 Testing AI SEO Core (Global Auto-SEO)...");
  try {
    const seoStatus = AISEOCore.status();
    logTest(
      "AISEOCore",
      "pass",
      `Status: ${seoStatus.optimizationCount} optimizations, ${seoStatus.geofenceCount} geofences`,
      {
        optimizations: seoStatus.optimizationCount,
        keywords: seoStatus.keywordCount,
        geofences: seoStatus.geofenceCount,
      }
    );

    // Test auto-optimization
    const optimized = autoOptimizeContent(
      "post",
      "test-content",
      "My Dream Project",
      "A cool project description",
      "web",
      { country: "US", city: "San Francisco" }
    );

    logTest(
      "AISEOCore",
      optimized.seoScore > 0 ? "pass" : "fail",
      `Auto-optimized content: Score ${optimized.seoScore}/100`,
      {
        score: optimized.seoScore,
        keywords: optimized.keywords.length,
        geofences: optimized.geofences.length,
      }
    );
  } catch (error: any) {
    logTest("AISEOCore", "fail", `Error: ${error.message}`, { error: error.message });
  }

  // ===== 5. DREAMNET OS CORE (HEARTBEAT) =====
  console.log("\n📋 Testing DreamNet OS Core (Heartbeat System)...");
  try {
    const osStatus = DreamNetOSCore.status();
    const snapshot = osStatus.snapshot;
    
    logTest(
      "DreamNetOSCore",
      "pass",
      `Heartbeat active: ${snapshot.subsystems.length} subsystems`,
      {
        subsystems: snapshot.subsystems.length,
        infraHealth: snapshot.globalHealth.infraHealth,
        economyHealth: snapshot.globalHealth.economyHealth,
        socialHealth: snapshot.globalHealth.socialHealth,
        pipelineHealth: snapshot.globalHealth.dreamPipelineHealth,
      }
    );

    // Test alerts
    const alerts = DreamNetOSCore.getActiveAlerts();
    logTest(
      "DreamNetOSCore",
      alerts.length === 0 ? "pass" : "warning",
      `Active alerts: ${alerts.length}`,
      { alerts: alerts.length }
    );

    // Test trends
    const trends = DreamNetOSCore.detectTrends();
    logTest(
      "DreamNetOSCore",
      "pass",
      `Detected ${trends.length} trend(s)`,
      { trends: trends.length }
    );

    // Test health stats
    const stats = DreamNetOSCore.getHealthStats();
    logTest(
      "DreamNetOSCore",
      "pass",
      `Health stats: ${stats.totalAlerts} total alerts, ${stats.criticalAlerts} critical`,
      stats
    );
  } catch (error: any) {
    logTest("DreamNetOSCore", "fail", `Error: ${error.message}`, { error: error.message });
  }

  // ===== 6. INTEGRATION TESTS =====
  console.log("\n📋 Testing System Integration...");
  try {
    // Test Jaggy + Webhook integration
    const jaggyStatus = JaggyCore.status();
    const webhookStatus = WebhookNervousCore.status();
    
    logTest(
      "Integration",
      jaggyStatus.webhooksDiscovered > 0 || webhookStatus.neurons.total > 0 ? "pass" : "warning",
      `Jaggy discovered ${jaggyStatus.webhooksDiscovered} webhook(s), Nervous Core has ${webhookStatus.neurons.total} neuron(s)`,
      {
        jaggyDiscoveries: jaggyStatus.webhooksDiscovered,
        webhookNeurons: webhookStatus.neurons.total,
      }
    );

    // Test Heartbeat integration
    const osStatus = DreamNetOSCore.status();
    const subsystems = osStatus.snapshot.subsystems;
    const hasJaggy = subsystems.some((s) => s.name.includes("Jaggy"));
    const hasWebhook = subsystems.some((s) => s.name.includes("Webhook") || s.name.includes("APIKeeper"));
    
    logTest(
      "Integration",
      hasWebhook ? "pass" : "warning",
      `Heartbeat tracking: ${subsystems.length} subsystems monitored`,
      {
        subsystemsTracked: subsystems.length,
        includesJaggy: hasJaggy,
        includesWebhook: hasWebhook,
      }
    );
  } catch (error: any) {
    logTest("Integration", "fail", `Error: ${error.message}`, { error: error.message });
  }

  // ===== GENERATE REPORT =====
  const endTime = Date.now();
  const duration = endTime - startTime;

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const warnings = results.filter((r) => r.status === "warning").length;

  console.log("\n" + "=".repeat(80));
  console.log("📊 FULL SYSTEM TEST REPORT");
  console.log("=".repeat(80));
  console.log(`\n⏱️  Duration: ${duration}ms`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  console.log("\n📋 Detailed Results:");
  console.log("-".repeat(80));
  for (const result of results) {
    const emoji = result.status === "pass" ? "✅" : result.status === "fail" ? "❌" : "⚠️";
    console.log(`${emoji} [${result.system}] ${result.message}`);
    if (result.details) {
      console.log(`   ${JSON.stringify(result.details, null, 2).split("\n").join("\n   ")}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("🎯 SYSTEM STATUS SUMMARY");
  console.log("=".repeat(80));

  // System summaries
  try {
    const jaggyStatus = JaggyCore.status();
    console.log(`\n🐱 Jaggy: ${jaggyStatus.status} | Stealth: ${jaggyStatus.stealthLevel}/100 | Base Fame: ${jaggyStatus.baseFame.toFixed(1)}/100`);
    console.log(`   Kills: ${jaggyStatus.kills} | Discovered: ${jaggyStatus.webhooksDiscovered} | Implemented: ${jaggyStatus.webhooksImplemented}`);
  } catch {}

  try {
    const webhookStatus = WebhookNervousCore.status();
    console.log(`\n🧠 Webhook Nervous Core: ${webhookStatus.neurons.total} neurons | ${webhookStatus.synapses.total} synapses`);
    console.log(`   🛡️  Immune: ${webhookStatus.immuneSystem.antibodies} antibodies | ${webhookStatus.immuneSystem.memoryCells} memory cells`);
    console.log(`   🍄 Mycelium: ${webhookStatus.mycelium.networks} networks | ${webhookStatus.mycelium.totalHyphae} paths`);
    console.log(`   🐜 Ant Colony: ${webhookStatus.antColony.pheromoneTrails} trails | ${webhookStatus.antColony.activeAnts} active ants`);
  } catch {}

  try {
    const apiStatus = APIKeeperCore.status();
    console.log(`\n🔑 API Keeper: ${apiStatus.providerCount} providers | ${apiStatus.keyCount} keys | $${apiStatus.costToday.toFixed(2)} today`);
  } catch {}

  try {
    const seoStatus = AISEOCore.status();
    console.log(`\n🔍 AI SEO: ${seoStatus.optimizationCount} optimizations | ${seoStatus.keywordCount} keywords | ${seoStatus.geofenceCount} geofences`);
  } catch {}

  try {
    const osStatus = DreamNetOSCore.status();
    const snapshot = osStatus.snapshot;
    console.log(`\n💓 Heartbeat: ${snapshot.subsystems.length} subsystems monitored`);
    console.log(`   Health: Infra=${(snapshot.globalHealth.infraHealth * 100).toFixed(0)}% | Economy=${(snapshot.globalHealth.economyHealth * 100).toFixed(0)}% | Social=${(snapshot.globalHealth.socialHealth * 100).toFixed(0)}% | Pipeline=${(snapshot.globalHealth.dreamPipelineHealth * 100).toFixed(0)}%`);
  } catch {}

  console.log("\n" + "=".repeat(80));
  console.log("✨ Test Complete!");
  console.log("=".repeat(80) + "\n");

  return {
    duration,
    passed,
    failed,
    warnings,
    successRate: (passed / results.length) * 100,
    results,
  };
}

// Run test
runFullTest()
  .then((report) => {
    process.exit(report.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });

export { runFullTest };

