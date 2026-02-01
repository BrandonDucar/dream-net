
import { StarBridge } from "./services/StarBridge.ts";
import { sovereignWallet } from "./services/SovereignWalletService.ts";

async function testGrounding() {
    console.log("🧪 [Server] Testing Avenue 14 Service Grounding...");

    try {
        const bridge = new StarBridge();
        console.log("✅ StarBridge initialized.");

        const walletAddress = sovereignWallet.getAddress();
        console.log(`✅ SovereignWallet initialized. Address: ${walletAddress || "MISSING"}`);

        console.log("🌌 STARBRIDGE TEST (MOCK): Initiating sample bridge...");
        // Use bigint for amount
        await bridge.bridgeAssets(1000000n, 'Polygon', 'Solana');

    } catch (error) {
        console.error("❌ Service Grounding Failed:", error);
    }
}

testGrounding();
