
import { NtagService } from '../packages/server/src/services/NtagService.js';

async function main() {
    console.log("🧬 NTAG 424 DNA SIMULATOR");
    console.log("   Initializing Virtual Chip...");

    // 1. Instantiate the Service (which holds the Master Key)
    const service = new NtagService();

    // 2. Define Virtual Chip Properties
    const virtualUid = "04825F12806280"; // 7-byte UID (Example)
    const virtualCounter = 1337; // Current Tap Count

    console.log(`   🔸 Chip ID: ${virtualUid}`);
    console.log(`   🔸 Counter: ${virtualCounter}`);

    // 3. Generate Valid Encrypted Payload
    // This simulates what the Physical Chip does when Tapped along with Master Key
    const cardOutput = service.generateMock(virtualUid, virtualCounter);

    console.log("   ⚡ GENERATING SUN MESSAGE (Secure Unique NFC)...");
    console.log(`      ?e=${cardOutput.enc}`);
    console.log(`      ?c=${cardOutput.cmac}`);

    // 4. Verify locally (Simulating the Server receiving the request)
    console.log("\n   🕵️  VERIFYING SIGNATURE (Server Side)...");
    const result = service.verify(cardOutput.enc, cardOutput.cmac);

    if (result.isValid) {
        console.log("   ✅ SUCCESS: Chip Authenticated.");
        console.log(`      Decoded UID: ${result.uid}`);
        console.log(`      Decoded Counter: ${result.counter}`);

        if (result.uid === virtualUid && result.counter === virtualCounter) {
            console.log("      (Data Match Confirmed)");
        } else {
            console.error("      (Data Mismatch!)");
        }

    } else {
        console.error("   ❌ FAILURE: Invalid Signature.");
    }

    // 5. Tamper Test
    console.log("\n   😈 TAMPER TEST (Modifying Encrypted String)...");
    const tamperedEnc = "FF" + cardOutput.enc.substring(2); // Corrupt first byte
    const tamperResult = service.verify(tamperedEnc, cardOutput.cmac);

    if (!tamperResult.isValid) {
        console.log("   ✅ SUCCESS: Tampered message rejected.");
    } else {
        console.error("   ❌ FAILURE: System accepted tampered message!");
    }
}

main().catch(console.error);
