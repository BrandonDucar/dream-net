/**
 * Run Shield cycle once
 * Tests the complete multi-phase shield system with rotating frequencies
 */

import { ShieldCore } from "@dreamnet/shield-core";

const ctx = {
  spiderWebCore: undefined,
  neuralMesh: undefined,
  narrativeField: undefined,
  dreamNetOSCore: undefined,
};

async function main() {
  console.log("===============================================");
  console.log(" 🛡️  Shield Core - Complete Cycle");
  console.log("===============================================");
  console.log("");

  // Ensure shield phases exist
  console.log("🛡️  Initializing shield layers...");
  const layers = ShieldCore.ensureShieldPhases();
  console.log(`   ✅ ${layers.length} shield layer(s) initialized`);
  console.log("");

  // Ensure modulators and emitters
  console.log("📡 Initializing modulators and emitters...");
  ShieldCore.ensureDefaultModulators();
  ShieldCore.ensureDefaultEmitters();
  console.log("   ✅ Modulators and emitters ready");
  console.log("");

  // Rotate frequencies
  console.log("🔄 Rotating shield frequencies...");
  ShieldCore.rotateFrequencies();
  console.log("   ✅ Frequencies rotated");
  console.log("");

  // Run shield cycle
  console.log("🛡️  Running shield cycle...");
  const status = ShieldCore.run(ctx);

  console.log("");
  console.log("✅ Cycle Complete");
  console.log("");
  console.log("🛡️  Shield Status:");
  console.log(`   Health: ${status.shieldHealth.toUpperCase()}`);
  console.log(`   Integrity: ${(status.overallIntegrity * 100).toFixed(1)}%`);
  console.log(`   Active Layers: ${status.activeLayers}/${status.totalLayers}`);
  console.log(`   Active Modulators: ${status.activeModulators}`);
  console.log(`   Active Emitters: ${status.activeEmitters}`);
  console.log("");

  console.log("⚠️  Threat Metrics:");
  console.log(`   Detected: ${status.threatsDetected}`);
  console.log(`   Blocked: ${status.threatsBlocked}`);
  console.log(`   Block Rate: ${status.threatsDetected > 0 ? ((status.threatsBlocked / status.threatsDetected) * 100).toFixed(1) : 0}%`);
  console.log("");

  console.log("⚡ Offensive Spikes:");
  console.log(`   Fired: ${status.spikesFired}`);
  console.log("");

  console.log("📊 Shield Layers:");
  status.currentFrequencies.forEach((freq) => {
    const layer = ShieldCore.getLayer(freq.phase);
    console.log(`   ${freq.phase.toUpperCase()}:`);
    console.log(`      Frequency: ${freq.frequency.toFixed(2)} Hz`);
    console.log(`      Amplitude: ${freq.amplitude.toFixed(2)}`);
    console.log(`      Integrity: ${((layer?.integrity ?? 0) * 100).toFixed(1)}%`);
    console.log(`      Strength: ${((layer?.strength ?? 0) * 100).toFixed(1)}%`);
    console.log(`      Modulators: ${layer?.modulators.length ?? 0}`);
    console.log(`      Emitters: ${layer?.emitters.length ?? 0}`);
    console.log(`      Breaches: ${layer?.breachCount ?? 0}`);
  });
  console.log("");

  if (status.recentThreats.length > 0) {
    console.log("⚠️  Recent Threats:");
    status.recentThreats.slice(0, 5).forEach((threat) => {
      console.log(`   - ${threat.type} (${threat.level}): ${threat.blocked ? "✅ BLOCKED" : "❌ NOT BLOCKED"}`);
    });
    console.log("");
  }

  if (status.recentSpikes.length > 0) {
    console.log("⚡ Recent Spikes:");
    status.recentSpikes.slice(0, 5).forEach((spike) => {
      console.log(`   - ${spike.name} (${spike.type}): ${spike.success ? "✅ SUCCESS" : "❌ FAILED"}`);
    });
    console.log("");
  }

  console.log("===============================================");
  console.log(" 🛡️  Shield Status");
  console.log("===============================================");
  console.log("");
  console.log("💡 Features Active:");
  console.log("   ✅ Multi-phase shields (6 layers)");
  console.log("   ✅ Rotating frequencies");
  console.log("   ✅ Shield modulators");
  console.log("   ✅ Shield emitters");
  console.log("   ✅ Threat detection");
  console.log("   ✅ Offensive spikes");
  console.log("   ✅ 24/7 protection");
  console.log("");
  console.log("🛡️  Norton won't have shit on us.");
  console.log("");
}

main().catch(console.error);

