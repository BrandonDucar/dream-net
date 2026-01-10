
import { getAgentWalletManager } from "../packages/agent-wallet-manager";
import { OctopusController } from "../packages/agent-wallet-manager/src/OctopusController";
import { ShieldStore } from "../packages/shield-core/store/shieldStore";

console.log("🌊 [OCTOPUS] Initializing launch sequence...");

async function wakeOctopus() {
    // 1. Setup Wallet Manager (Mock Mnemonic for test)
    const manager = getAgentWalletManager("test test test test test test test test test test test junk");

    // 2. Initialize Controller
    const brainId = "octopus_brain_v1";
    const octopus = new OctopusController(manager, brainId);

    // 3. Wake Up
    console.log("🌊 [OCTOPUS] Awakening all arms...");
    await octopus.awaken();

    // 4. Verify Arms
    const status = octopus.getArmStatus();
    console.log(`\n🐙 STATUS REPORT: ${status.length} Arms Active`);
    status.forEach(arm => {
        console.log(`   - [${arm.type}] (${arm.address.slice(0, 8)}...) -> ${arm.taskFocus}`);
    });

    // 5. Test Execution (Standard)
    console.log("\n🧪 Testing Arm 2 (DeFi Liquidity)...");
    await octopus.execute("DEFI_LIQUIDITY", async () => {
        console.log("   ✅ [DeFi Arm] Checked Liquidity Pools on Aerodrome.");
        return "Liquidity Optimized";
    });

    // 6. Test Security Lock-Down
    console.log("\n⚠️  Simulating HIGH THREAT LEVEL...");
    // Inject fake threat to trigger Shield
    ShieldStore.detectThreat({
        id: "sim_attack",
        type: "malware",
        severity: "critical",
        source: "sim",
        detectedAt: Date.now()
    });

    // Actually set the threats on the store manually to force the count > 10 if needed, 
    // but let's just use the 'critical' check logic used in OctopusController.
    // The controller checks: threatsDetected > 10 OR shieldHealth === "degraded"

    // Let's force a degrade
    // (We can't easily force integrity down without firing 1000 spikes, so we rely on mocking the status or firing spikes)

    console.log("   (Forcing 15 dummy threats to trigger lock-down)");
    for (let i = 0; i < 15; i++) ShieldStore.detectThreat({ id: `t_${i}`, type: "ddos", severity: "high", source: "sim", detectedAt: Date.now() });

    try {
        console.log("   Attempting Governance Vote during Attack...");
        await octopus.execute("GOVERNANCE_VOTER", async () => {
            return "Voted Yes";
        });
    } catch (err: any) {
        console.log(`   ✅ BLOCKED: ${err.message}`);
    }

    // 7. Verify Emergency Arm still works
    console.log("   Checking Emergency Reserve (Ink Sac)...");
    await octopus.execute("EMERGENCY_RESERVE", async () => {
        console.log("   ✅ [Ink Sac] Emergency Funds Moved to Cold Storage.");
        return "Safe";
    });

    console.log("\n🌊 [OCTOPUS] Full Systems Check Complete.");
}

wakeOctopus().catch(console.error);
