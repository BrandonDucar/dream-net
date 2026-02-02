import { vdsProxy } from './VDSProxyService.js';

async function main() {
    console.log("🚀 STARTING VDS PROXY ROUTING TEST");

    const TEST_AGENT_ID = "BORIS_AGENT_001";
    const intent = {
        action: "SWAP",
        params: { from: "ETH", to: "SPARK", amount: "0.1" },
        query: "Swap 0.1 ETH for SPARK on Base"
    };

    try {
        console.log(`\n📡 ROUTING INTENT FOR ${TEST_AGENT_ID}...`);
        const { tbaAddress, result } = await vdsProxy.routeIntent(TEST_AGENT_ID, intent);

        console.log(`\n✅ ROUTING SUCCESSFUL!`);
        console.log(`Computed TBA: ${tbaAddress}`);
        console.log(`Bankr Result: ${result.message}`);
        console.log(`Mock TxHash: ${result.txHash}`);

    } catch (error) {
        console.error("\n❌ ROUTING TEST FAILED:", error);
    }
}

main();
