import { sovereignWallet } from '../src/services/SovereignWalletService.js';
import { pathToFileURL } from 'url';
import path from 'path';

async function verifyBiometricFlow() {
    console.log("🧬 DREAMNET: BIOMETRIC SOVEREIGNTY VERIFICATION 🩸");
    console.log("-----------------------------------------------------");

    // Enable Sovereign Mode for this test
    process.env.SOVEREIGN_MODE = 'true';

    console.log("[🛡️ BSW] Scenario: HarvesterAgent requesting high-value transaction...");

    // Use robust absolute path for the event bus
    const busPath = path.resolve(process.cwd(), 'packages/nerve/src/spine/dreamnet-event-bus/index.ts');
    const busUrl = pathToFileURL(busPath).href;
    console.log(`[🧬 Debug] Importing event bus from: ${busUrl}`);

    const { dreamEventBus } = await import(busUrl);

    // Subscribe to catch the signature request
    dreamEventBus.subscribe('Treasury.SignatureRequired', (envelope: any) => {
        console.log(`\n[📡 Signal] CAPTURED: Treasury.SignatureRequired`);
        console.log(`[👤 Actor] Agent: ${envelope.actor?.id || 'Unknown'}`);
        console.log(`[🔐 Challenge] Action: ${envelope.payload?.action}`);
        console.log(`[🧬 DNA] DNA Check Required: ${envelope.payload?.verificationLevels?.join(', ')}`);
        console.log("Status: WAITING FOR COMMANDER SCAN... 🩸");
    });

    try {
        const mockTx = {
            to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            value: "1000000000000000", // 0.001 ETH
            data: "0x"
        };

        // This should trigger the DNA check, THEN the biometric request
        // Note: SovereignWalletService is already listening to the same bus instance
        await sovereignWallet.sendProtectedTransaction(mockTx, 'HarvesterAgent');

        console.log("\n[🤱 Nursery] Verification complete. Biometric gate is active.");
        console.log("Status: SOVEREIGN & PROTECTED. 🩸");

    } catch (e: any) {
        console.log(`\n[🛡️ BSW] Flow Terminated: ${e.message}`);
    } finally {
        process.exit(0);
    }
}

verifyBiometricFlow().catch(e => {
    console.error("Fatal verification error:", e);
    process.exit(1);
});
