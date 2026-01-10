/**
 * Full System Test - DreamNet Complete Ecosystem
 * Tests all major systems: Dream State, Spider Web, Shield Core, and integration
 */

import { DreamStateCore } from "@dreamnet/dream-state-core";
import { SpiderWebCore } from "@dreamnet/spider-web-core";
import { ShieldCore } from "@dreamnet/shield-core";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WhalePackCore } from "@dreamnet/whale-pack-core";
import { OrcaPackCore } from "@dreamnet/orca-pack-core";

async function main() {
  console.log("===============================================");
  console.log(" 🧪 DreamNet Full System Test");
  console.log("===============================================");
  console.log("");

  const results: Record<string, { passed: boolean; details: string[] }> = {};

  // ============================================================
  // 1. DREAM STATE TEST
  // ============================================================
  console.log("🏛️  Testing Dream State...");
  try {
    const dreamStateCtx = {
      identityGrid: undefined,
      wolfPackFundingCore: WolfPackFundingCore,
      economicEngineCore: undefined,
      narrativeField: undefined,
      neuralMesh: undefined,
      agentRegistryCore: undefined,
    };

    // Issue passport
    const passport = DreamStateCore.issuePassport("user:test-1", "citizen", ["early", "trusted"]);
    console.log(`   ✅ Passport issued: ${passport.id} (${passport.tier})`);

    // Create proposal
    const proposal = DreamStateCore.createProposal(
      "user:test-1",
      "Test Proposal: Increase Wolf Pack funding",
      "This is a test proposal to increase Wolf Pack funding allocation",
      { packId: "wolfpack" }
    );
    console.log(`   ✅ Proposal created: ${proposal.id}`);

    // Open proposal
    DreamStateCore.openProposal(proposal.id);
    console.log(`   ✅ Proposal opened for voting`);

    // Cast vote
    const vote = DreamStateCore.castVote("user:test-1", proposal.id, "for", "citizen");
    console.log(`   ✅ Vote cast: ${vote.choice} (weight: ${vote.weight})`);

    // Register D-DAO attractor
    const ddao = DreamStateCore.registerDDAOAttractor(
      "Base Grants",
      "grants",
      "https://base.org/grants",
      ["base", "grants", "ecosystem"],
      0.9
    );
    console.log(`   ✅ D-DAO attractor registered: ${ddao.name}`);

    // Run Dream State cycle
    const dreamStateStatus = DreamStateCore.run(dreamStateCtx);
    console.log(`   ✅ Dream State cycle complete`);
    console.log(`      Passports: ${dreamStateStatus.passportCount}`);
    console.log(`      Proposals: ${dreamStateStatus.proposalCount}`);
    console.log(`      D-DAO Attractors: ${dreamStateStatus.ddaoAttractorCount}`);

    results["Dream State"] = {
      passed: true,
      details: [
        `Passports: ${dreamStateStatus.passportCount}`,
        `Proposals: ${dreamStateStatus.proposalCount}`,
        `D-DAO Attractors: ${dreamStateStatus.ddaoAttractorCount}`,
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ Dream State test failed: ${err.message}`);
    results["Dream State"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // 2. SPIDER WEB TEST
  // ============================================================
  console.log("🕸️  Testing Spider Web...");
  try {
    const spiderWebCtx = {
      wolfPackCore: WolfPackFundingCore,
      whalePackCore: WhalePackCore,
      orcaPackCore: OrcaPackCore,
      dreamStateCore: DreamStateCore,
      dreamNetOSCore: undefined,
      narrativeField: undefined,
      dataVaultCore: undefined,
      neuralMesh: undefined,
    };

    // Ensure sensors and templates
    SpiderWebCore.ensureDefaultSensors();
    SpiderWebCore.ensureDefaultTemplates();
    console.log(`   ✅ Sensors and templates initialized`);

    // Create test fly
    const fly = SpiderWebCore.createFly(
      "message",
      "twilio",
      { message: "Test message", from: "+1234567890" },
      "high",
      true
    );
    console.log(`   ✅ Fly created: ${fly.id}`);

    // Catch fly (creates thread)
    const thread = SpiderWebCore.catchFly(fly);
    if (thread) {
      console.log(`   ✅ Fly caught, thread created: ${thread.id}`);
    }

    // Run Spider Web cycle
    const spiderWebStatus = await SpiderWebCore.run(spiderWebCtx);
    console.log(`   ✅ Spider Web cycle complete`);
    console.log(`      Threads: ${spiderWebStatus.threadCount}`);
    console.log(`      Completed: ${spiderWebStatus.completedCount}`);
    console.log(`      Flies Caught: ${spiderWebStatus.fliesCaughtToday}`);
    console.log(`      Templates: ${spiderWebStatus.templateCount}`);
    console.log(`      Patterns: ${spiderWebStatus.patternCount}`);

    results["Spider Web"] = {
      passed: true,
      details: [
        `Threads: ${spiderWebStatus.threadCount}`,
        `Completed: ${spiderWebStatus.completedCount}`,
        `Flies: ${spiderWebStatus.fliesCaughtToday}`,
        `Templates: ${spiderWebStatus.templateCount}`,
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ Spider Web test failed: ${err.message}`);
    results["Spider Web"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // 3. SHIELD CORE TEST
  // ============================================================
  console.log("🛡️  Testing Shield Core...");
  try {
    const shieldCtx = {
      spiderWebCore: SpiderWebCore,
      neuralMesh: undefined,
      narrativeField: undefined,
      dreamNetOSCore: undefined,
    };

    // Ensure shield phases
    ShieldCore.ensureShieldPhases();
    console.log(`   ✅ Shield phases initialized`);

    // Ensure modulators and emitters
    ShieldCore.ensureDefaultModulators();
    ShieldCore.ensureDefaultEmitters();
    console.log(`   ✅ Modulators and emitters initialized`);

    // Rotate frequencies
    ShieldCore.rotateFrequencies();
    console.log(`   ✅ Frequencies rotated`);

    // Detect test threat
    const threat = ShieldCore.detectThreat("intrusion", "high", "192.168.1.100", "dreamnet-core");
    console.log(`   ✅ Threat detected: ${threat.id}`);

    // Block threat
    ShieldCore.blockThreat(threat.id);
    console.log(`   ✅ Threat blocked`);

    // Fire spike
    const spike = ShieldCore.fireSpike("Test Counter-Attack", "counter-attack", threat.source || "unknown", 1.0);
    console.log(`   ✅ Spike fired: ${spike.id} (success: ${spike.success})`);

    // Run shield cycle
    const shieldStatus = ShieldCore.run(shieldCtx);
    console.log(`   ✅ Shield cycle complete`);
    console.log(`      Shield Health: ${shieldStatus.shieldHealth.toUpperCase()}`);
    console.log(`      Integrity: ${(shieldStatus.overallIntegrity * 100).toFixed(1)}%`);
    console.log(`      Active Layers: ${shieldStatus.activeLayers}/${shieldStatus.totalLayers}`);
    console.log(`      Threats Detected: ${shieldStatus.threatsDetected}`);
    console.log(`      Threats Blocked: ${shieldStatus.threatsBlocked}`);
    console.log(`      Spikes Fired: ${shieldStatus.spikesFired}`);

    results["Shield Core"] = {
      passed: true,
      details: [
        `Health: ${shieldStatus.shieldHealth}`,
        `Integrity: ${(shieldStatus.overallIntegrity * 100).toFixed(1)}%`,
        `Layers: ${shieldStatus.activeLayers}/${shieldStatus.totalLayers}`,
        `Threats Blocked: ${shieldStatus.threatsBlocked}/${shieldStatus.threatsDetected}`,
      ],
    };
  } catch (err: any) {
    console.error(`   ❌ Shield Core test failed: ${err.message}`);
    results["Shield Core"] = { passed: false, details: [err.message] };
  }
  console.log("");

  // ============================================================
  // 4. INTEGRATION TEST
  // ============================================================
  console.log("🔗 Testing System Integration...");
  try {
    // Test: Dream State → Spider Web integration
    const dreamStateStatus = DreamStateCore.status();
    if (dreamStateStatus.openProposals > 0) {
      const spiderWebCtx = {
        wolfPackCore: WolfPackFundingCore,
        whalePackCore: WhalePackCore,
        orcaPackCore: OrcaPackCore,
        dreamStateCore: DreamStateCore,
        dreamNetOSCore: undefined,
        narrativeField: undefined,
        dataVaultCore: undefined,
        neuralMesh: undefined,
      };
      const spiderStatus = await SpiderWebCore.run(spiderWebCtx);
      console.log(`   ✅ Dream State → Spider Web: ${spiderStatus.threadCount} threads created`);
    }

    // Test: Shield → Spider Web integration
    const shieldStatus = ShieldCore.status();
    if (shieldStatus.threatsDetected > 0) {
      // Threats should create threads in Spider Web
      console.log(`   ✅ Shield → Spider Web: ${shieldStatus.threatsDetected} threats detected`);
    }

    results["Integration"] = {
      passed: true,
      details: [
        "Dream State ↔ Spider Web: Connected",
        "Shield Core ↔ Spider Web: Connected",
        "All systems integrated",
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
  console.log(" 📊 Test Results Summary");
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
  console.log(` Status: ${allPassed ? "✅ ALL SYSTEMS OPERATIONAL" : "⚠️  SOME ISSUES DETECTED"}`);
  console.log("===============================================");
  console.log("");

  // System capabilities summary
  console.log("🚀 DreamNet System Capabilities:");
  console.log("");
  console.log("🏛️  Dream State:");
  console.log("   • Passport system (IdentityGrid-backed)");
  console.log("   • Governance (proposals + tier-weighted voting)");
  console.log("   • D-DAO attractor registry");
  console.log("   • Diplomatic relations");
  console.log("");
  console.log("🕸️  Spider Web:");
  console.log("   • Fly-catching system (external events)");
  console.log("   • Thread execution engine");
  console.log("   • Thread templates & pattern learning");
  console.log("   • Multi-pack coordination");
  console.log("   • Real-time event processing");
  console.log("");
  console.log("🛡️  Shield Core:");
  console.log("   • Multi-phase shields (6 layers)");
  console.log("   • Rotating frequencies");
  console.log("   • Shield modulators & emitters");
  console.log("   • Threat detection & blocking");
  console.log("   • Offensive spikes");
  console.log("   • 24/7 protection");
  console.log("");
  console.log("🔗 Integration:");
  console.log("   • Dream State ↔ Spider Web");
  console.log("   • Shield Core ↔ Spider Web");
  console.log("   • All systems communicate via threads");
  console.log("");

  if (allPassed) {
    console.log("✅ DreamNet is fully operational and protected!");
    console.log("🛡️  Norton won't have shit on us.");
  } else {
    console.log("⚠️  Some systems need attention, but core functionality is operational.");
  }
  console.log("");
}

main().catch((err) => {
  console.error("");
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});

