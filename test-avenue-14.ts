
import { StarBridge } from "@dreamnet/server/services/StarBridge.js";
import { sovereignWallet } from "@dreamnet/server/services/SovereignWalletService.js";

async function testAvenue14() {
    console.log("🧪 [Avenue 14] Testing Aliased Grounding...");

    try {
        const bridge = new StarBridge();
        console.log("✅ StarBridge initialized via Alias.");

        const walletAddress = sovereignWallet.getAddress();
        console.log(`✅ SovereignWallet initialized. Address: ${walletAddress || "MISSING"}`);

    } catch (error) {
        console.error("❌ Aliased Grounding Failed:", error);
    }
}

testAvenue14();
