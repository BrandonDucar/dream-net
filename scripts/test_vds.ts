
import { NtagService } from '../packages/server/src/services/NtagService.js';

async function main() {
    console.log("🛡️ TESTING TITAN KEY (VDS)...");

    const ntag = new NtagService();

    // 1. Generate Mock Scan (Valid NTAG)
    // UID must start with 04 (NXP)
    const mock = ntag.generateMock('04AABBCCDDEEFF', 42);

    // 2. Verify & Forge
    const result = await ntag.verify(mock.enc, mock.cmac);

    if (result.isValid && result.vds) {
        console.log("✅ NTAG Verified.");
        console.log("✅ VDS Forged:", result.vds.hash);
        console.log("   - Signer:", result.vds.signer);
        console.log("   - Payload:", JSON.stringify(result.vds.payload));
        console.log("   - Signature:", result.vds.signature.slice(0, 20) + '...');
    } else {
        console.error("❌ Verification Failed.");
    }
}

main().catch(console.error);
