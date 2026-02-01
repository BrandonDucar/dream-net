import { WalletScoreEngine } from './packages/market-organ/src/legacy/WalletScoreEngine.js';
import { isDbAvailable, getDbStatus } from './packages/server/src/db.js';

async function testWalletModernization() {
    console.log("🧪 testing Modernized WalletScoreEngine...");

    // Check DB Status
    const status = getDbStatus();
    console.log(`📡 DB Status: ${status.initialized ? '✅ ONLINE' : '❌ OFFLINE'}`);

    if (!status.initialized) {
        console.error("❌ Aborting: Database not available for grounding.");
        return;
    }

    const engine = new WalletScoreEngine();

    // Test with a known "Sovereign" address or a mock one if the DB is empty
    const testAddress = "0x_legacy_soul_reanimated";

    try {
        const score = await engine.analyzeWallet(testAddress);
        console.log("✅ Analysis Result:", JSON.stringify(score, null, 2));
    } catch (e) {
        console.error("❌ Analysis Failed:", e);
    }
}

testWalletModernization();
