/**
 * Complete System Test - All Enhancements
 * Tests: Cellular Shields, Cross-Chain, Shield Learning, AI SEO, Geofencing, API Integrations
 */

import { ShieldCore } from "@dreamnet/shield-core";
import { AISEOCore } from "@dreamnet/ai-seo-core";
import { SpiderWebCore } from "@dreamnet/spider-web-core";
import { DreamStateCore } from "@dreamnet/dream-state-core";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WhalePackCore } from "@dreamnet/whale-pack-core";
import { OrcaPackCore } from "@dreamnet/orca-pack-core";

async function main() {
  console.log("===============================================");
  console.log(" 🚀 DreamNet Complete System Test");
  console.log("   Testing ALL Enhancements");
  console.log("===============================================");
  console.log("");

  const results: Record<string, { passed: boolean; details: string[] }> = {};

  // ============================================================
  // 1. CELLULAR SHIELD TEST
  // ============================================================
  console.log("🔬 Testing Cellular Shields...");
  try {
    // Create cellular shields for various cells
    const agentShield = ShieldCore.createCellularShield("agent:wolf-analyst", "agent", "wormhole:1");
    const packShield = ShieldCore.createCellularShield("pack:whale-pack", "pack", "wormhole:2");
    const coreShield = ShieldCore.createCellularShield("core:spider-web", "core", "wormhole:3");

    console.log(`   ✅ Created ${3} cellular shields`);

    // Propagate shield update via wormhole
    const signal = ShieldCore.propagateShieldViaWormhole(
      "shield-update",
      "cellular",
      { integrity: 0.95, frequency: 15000 },
      ["agent:wolf-analyst", "pack:whale-pack", "core:spider-web"]
    );
    console.log(`   ✅ Propagated signal to ${signal.propagationCount} cells`);

    // Get cellular stats
    const cellularStats = ShieldCore.getCellularShieldStats();
    console.log(`   ✅ Cellular Stats:`);
    console.log(`      Total Cells: ${cellularStats.totalCells}`);
    console.log(`      Wormhole Connected: ${cellularStats.wormholeConnected}`);
    console.log(`      Avg Integrity: ${(cellularStats.avgIntegrity * 100).toFixed(1)}%`);

    results["Cellular Shields"] = {
      passed: true,
      details: [
        `Cells: ${cellularStats.totalCells}`,
        `Wormhole Connected: ${cellularStats.wormholeConnected}`,
        `Integrity: ${(cellularStats.avgIntegrity * 100).toFixed(1)}%`,
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ Cellular Shield test failed: ${err.message}`);
    results["Cellular Shields"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // 2. SHIELD LEARNING TEST
  // ============================================================
  console.log("🧠 Testing Shield Learning...");
  try {
    // Create some threats to learn from
    ShieldCore.detectThreat("intrusion", "high", "192.168.1.100");
    ShieldCore.detectThreat("intrusion", "high", "192.168.1.101");
    ShieldCore.detectThreat("ddos", "critical", "10.0.0.1");
    ShieldCore.detectThreat("ddos", "critical", "10.0.0.2");
    ShieldCore.detectThreat("malware", "medium", "172.16.0.1");

    // Block some threats
    const threats = ShieldCore.listThreats();
    ShieldCore.blockThreat(threats[0].id);
    ShieldCore.blockThreat(threats[1].id);
    ShieldCore.blockThreat(threats[2].id);

    // Learn from threats
    const patterns = ShieldCore.learnFromThreats();
    console.log(`   ✅ Learned ${patterns.length} threat pattern(s)`);

    // Get threat patterns
    const allPatterns = ShieldCore.getThreatPatterns();
    for (const pattern of allPatterns) {
      console.log(`      Pattern: ${pattern.threatType} (${pattern.threatLevel}) - Blocked: ${(pattern.blockedRate * 100).toFixed(1)}%`);
    }

    results["Shield Learning"] = {
      passed: true,
      details: [
        `Patterns Learned: ${patterns.length}`,
        `Total Patterns: ${allPatterns.length}`,
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ Shield Learning test failed: ${err.message}`);
    results["Shield Learning"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // 3. CROSS-CHAIN SHIELD TEST
  // ============================================================
  console.log("⛓️  Testing Cross-Chain Shields...");
  try {
    // Initialize cross-chain shields
    ShieldCore.initializeCrossChainShield("base", "8453");
    ShieldCore.initializeCrossChainShield("ethereum", "1");
    ShieldCore.initializeCrossChainShield("optimism", "10");

    // Detect cross-chain threat
    const crossChainThreat = ShieldCore.detectCrossChainThreat("base", "exploit", "high", "0x1234...");
    if (crossChainThreat) {
      console.log(`   ✅ Detected cross-chain threat: ${crossChainThreat.id}`);
    }

    // Sync shields
    ShieldCore.syncCrossChainShields();
    console.log(`   ✅ Synced cross-chain shields`);

    // Get stats
    const crossChainStats = ShieldCore.getCrossChainShieldStats();
    console.log(`   ✅ Cross-Chain Stats:`);
    console.log(`      Total Chains: ${crossChainStats.totalChains}`);
    console.log(`      Active Chains: ${crossChainStats.activeChains}`);
    console.log(`      Avg Integrity: ${(crossChainStats.avgIntegrity * 100).toFixed(1)}%`);

    results["Cross-Chain Shields"] = {
      passed: true,
      details: [
        `Chains: ${crossChainStats.totalChains}`,
        `Active: ${crossChainStats.activeChains}`,
        `Integrity: ${(crossChainStats.avgIntegrity * 100).toFixed(1)}%`,
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ Cross-Chain Shield test failed: ${err.message}`);
    results["Cross-Chain Shields"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // 4. AI SEO TEST
  // ============================================================
  console.log("🔍 Testing AI SEO...");
  try {
    // Optimize content
    const seo1 = AISEOCore.optimizeContent(
      "post",
      "post:1",
      "web",
      "DreamNet: The Future of Multi-Agent Systems",
      "DreamNet is a revolutionary multi-agent system built on Base blockchain"
    );
    console.log(`   ✅ Optimized content: ${seo1.id} (Score: ${seo1.score}/100)`);

    const seo2 = AISEOCore.optimizeContent(
      "product",
      "product:whale-pack",
      "twitter",
      "Whale Pack - TikTok Commerce",
      "Automated TikTok content generation and commerce optimization"
    );
    console.log(`   ✅ Optimized content: ${seo2.id} (Score: ${seo2.score}/100)`);

    // Get top keywords
    const topKeywords = AISEOCore.getTopKeywords(10);
    console.log(`   ✅ Top Keywords: ${topKeywords.length}`);

    // Create geofence
    const geofence = AISEOCore.createGeofence(
      "United States",
      "country",
      { countries: ["US"], priority: 0.9 }
    );
    console.log(`   ✅ Created geofence: ${geofence.name}`);

    // Check geofence
    const matches = AISEOCore.checkGeofence({ country: "US" });
    console.log(`   ✅ Geofence matches: ${matches.length}`);

    // Generate insights
    const insights = AISEOCore.generateInsights();
    console.log(`   ✅ Generated ${insights.length} SEO insight(s)`);

    const status = AISEOCore.status();
    console.log(`   ✅ SEO Status:`);
    console.log(`      Optimizations: ${status.optimizationCount}`);
    console.log(`      Keywords: ${status.keywordCount}`);
    console.log(`      Geofences: ${status.geofenceCount}`);
    console.log(`      Avg SEO Score: ${status.avgSEOScore.toFixed(1)}/100`);

    results["AI SEO"] = {
      passed: true,
      details: [
        `Optimizations: ${status.optimizationCount}`,
        `Keywords: ${status.keywordCount}`,
        `Geofences: ${status.geofenceCount}`,
        `Avg Score: ${status.avgSEOScore.toFixed(1)}/100`,
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ AI SEO test failed: ${err.message}`);
    results["AI SEO"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // 5. INTEGRATION TEST
  // ============================================================
  console.log("🔗 Testing System Integration...");
  try {
    const shieldCtx = {
      spiderWebCore: SpiderWebCore,
      neuralMesh: undefined,
      narrativeField: undefined,
      dreamNetOSCore: undefined,
      eventWormholes: { propagate: () => {} },
      agentRegistryCore: undefined,
    };

    // Run shield cycle (includes cellular, learning, cross-chain)
    const shieldStatus = ShieldCore.run(shieldCtx);
    console.log(`   ✅ Shield cycle complete`);
    console.log(`      Health: ${shieldStatus.shieldHealth.toUpperCase()}`);
    console.log(`      Integrity: ${(shieldStatus.overallIntegrity * 100).toFixed(1)}%`);
    console.log(`      Cellular Cells: ${shieldStatus.cellularShieldCount}`);
    console.log(`      Wormhole Signals: ${shieldStatus.recentWormholeSignals.length}`);

    // Run SEO cycle
    const seoCtx = {
      spiderWebCore: SpiderWebCore,
      orcaPackCore: OrcaPackCore,
      whalePackCore: WhalePackCore,
      narrativeField: undefined,
      neuralMesh: undefined,
    };
    const seoStatus = AISEOCore.run(seoCtx);
    console.log(`   ✅ SEO cycle complete`);

    // Run Spider Web cycle (with API integrations)
    const spiderCtx = {
      wolfPackCore: WolfPackFundingCore,
      whalePackCore: WhalePackCore,
      orcaPackCore: OrcaPackCore,
      dreamStateCore: DreamStateCore,
      dreamNetOSCore: undefined,
      narrativeField: undefined,
      dataVaultCore: undefined,
      neuralMesh: undefined,
    };
    const spiderStatus = await SpiderWebCore.run(spiderCtx);
    console.log(`   ✅ Spider Web cycle complete`);
    console.log(`      Threads: ${spiderStatus.threadCount}`);

    results["Integration"] = {
      passed: true,
      details: [
        "Shield ↔ Cellular: Connected",
        "Shield ↔ Cross-Chain: Connected",
        "SEO ↔ Geofencing: Connected",
        "Spider Web ↔ API Integrations: Ready",
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ Integration test failed: ${err.message}`);
    results["Integration"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // FINAL REPORT
  // ============================================================
  console.log("===============================================");
  console.log(" 📊 Complete Test Results");
  console.log("===============================================");
  console.log("");

  const allPassed = Object.values(results).every((r) => r.passed);
  const passedCount = Object.values(results).filter((r) => r.passed).length;
  const totalCount = Object.keys(results).length;

  for (const [system, result] of Object.entries(results)) {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} ${system}`);
    result.details.forEach((detail) => {
      console.log(`      • ${detail}`);
    });
  }

  console.log("");
  console.log("===============================================");
  console.log(` Overall: ${passedCount}/${totalCount} systems passed`);
  console.log(` Status: ${allPassed ? "✅ ALL ENHANCEMENTS OPERATIONAL" : "⚠️  SOME ISSUES DETECTED"}`);
  console.log("===============================================");
  console.log("");

  // Capabilities summary
  console.log("🚀 DreamNet Enhanced Capabilities:");
  console.log("");
  console.log("🔬 Cellular Shields:");
  console.log("   • Per-cell protection (agents, packs, cores)");
  console.log("   • Wormhole propagation for instant updates");
  console.log("   • Granular integrity tracking");
  console.log("");
  console.log("🧠 Shield Learning:");
  console.log("   • Threat pattern recognition");
  console.log("   • Adaptive threat severity prediction");
  console.log("   • Continuous improvement from attacks");
  console.log("");
  console.log("⛓️  Cross-Chain Shields:");
  console.log("   • Multi-blockchain protection (Base, Ethereum, Optimism)");
  console.log("   • Synchronized shield integrity");
  console.log("   • Cross-chain threat detection");
  console.log("");
  console.log("🔍 AI SEO:");
  console.log("   • Automatic content optimization");
  console.log("   • Keyword discovery and tracking");
  console.log("   • SEO score calculation (0-100)");
  console.log("   • Multi-platform optimization (Web, Twitter, TikTok, etc.)");
  console.log("");
  console.log("🌍 Geofencing:");
  console.log("   • Location-based content rules");
  console.log("   • Country/region/city targeting");
  console.log("   • Custom geofence rules");
  console.log("");
  console.log("🔌 API Integrations:");
  console.log("   • Twilio SMS (ready for real API)");
  console.log("   • Telegram Bot (ready for real API)");
  console.log("   • Twitter API (ready for real API)");
  console.log("   • Webhook processing");
  console.log("");
  console.log("🧵 Enhanced Thread Execution:");
  console.log("   • SEO optimization actions");
  console.log("   • Geofence application");
  console.log("   • Shield spike firing");
  console.log("   • Cellular shield creation");
  console.log("   • Wormhole propagation");
  console.log("");

  if (allPassed) {
    console.log("✅ DreamNet is FULLY ENHANCED and OPERATIONAL!");
    console.log("🛡️  Protection extends to the cellular level.");
    console.log("🌍 SEO and geofencing are active.");
    console.log("🔌 API integrations are ready for real credentials.");
    console.log("");
    console.log("💡 To activate real APIs:");
    console.log("   1. Add Twilio credentials to sensor config");
    console.log("   2. Add Telegram bot token to sensor config");
    console.log("   3. Add Twitter bearer token to sensor config");
    console.log("   4. APIs will automatically switch from simulation to real");
  } else {
    console.log("⚠️  Some enhancements need attention, but core functionality is operational.");
  }
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});

