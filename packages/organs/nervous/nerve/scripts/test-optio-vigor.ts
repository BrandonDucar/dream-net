import { elizaBridge } from'../src/spine/ElizaBridge.js';
import { HarvesterAgent } from'../../agents/src/specialized/HarvesterAgent.js';
import { optioConnector } from'../../platform-connector/src/optio/OptioConnector.js';

async function main() {
    console.log("🚀 INITIALIZING OPTIO VIGOR TEST");

    const MOCK_NODE_IDS = Array.from({ length: 20 }, (_, i) => `NODE_${i + 100}`);

    // 1. Initial Vigor Scan
    console.log("\n📡 SCANNING INITIAL CLUSTER VIGOR...");
    const initialVigor = await optioConnector.getClusterVigor(MOCK_NODE_IDS);
    const avgInitialVigor = initialVigor.reduce((acc, v) => acc + v.vigorScore, 0) / initialVigor.length;
    console.log(`Average Initial Vigor: ${avgInitialVigor.toFixed(2)}%`);

    // 2. Deploy Harvester Agent 'Scythe_1'
    console.log("\n🚜 DEPLOYING HARVESTER AGENT: 'SCYTHE_1'");
    const scythe = new HarvesterAgent('Scythe_1', {
        targetNodeIds: MOCK_NODE_IDS,
        harvestGoal: 500000,
        viralityFactor: 0.9
    });

    await scythe.ignite();

    // 3. Post-Harvest Vigor Scan
    console.log("\n📡 SCANNING POST-HARVEST CLUSTER VIGOR...");
    const postVigor = await optioConnector.getClusterVigor(MOCK_NODE_IDS);
    const avgPostVigor = postVigor.reduce((acc, v) => acc + v.vigorScore, 0) / postVigor.length;
    console.log(`Average Post-Harvest Vigor: ${avgPostVigor.toFixed(2)}%`);

    // 4. Verify Bridge Integration
    console.log("\n🧬 VERIFYING ELIZA BRIDGE INTEGRATION...");
    const bridgeResult = await elizaBridge.signal({
        agentId: 'Scythe_1',
        plugin: 'optio',
        action: 'impact_broadcast',
        payload: { content: 'Sovereignty is the only currency.', vigorBoost: 0.15 }
    });
    console.log("Bridge Result:", bridgeResult.message);

    console.log("\n✅ VIGOR CALIBRATION VERIFIED.");
}

main().catch(console.error);
