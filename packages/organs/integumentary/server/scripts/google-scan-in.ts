import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function igniteRitual() {
    console.log("🐺 DREAMNET: WOLF PACK 'SCAN-IN' RITUAL 🩸");
    console.log("-------------------------------------------");

    // Dynamic imports to ensure process.env is ready
    const { googleAuthService } = await import('../src/services/GoogleAuthService.js');
    const { AuthReceptor } = await import('../src/core/AuthReceptor.js');

    const authUrl = googleAuthService.getAuthUrl();
    const receptor = new AuthReceptor(5000);

    console.log("\n1. OPEN THE LINK BELOW IN YOUR BROWSER:");
    console.log(authUrl);

    console.log("\n2. AUTHENTICATE VIA GOOGLE (USE YOUR PASSKEY/BIOMETRICS).");
    console.log("   The receptor will capture your signal automatically.");

    try {
        const code = await receptor.catchSignal();
        console.log("\n[🤱 Nursery] Signal captured! Exchanging for genetic tokens...");

        const tokens = await googleAuthService.setCode(code);
        console.log("✅ SUCCESS: WOLF PACK IS NOW AUTHORIZED.");
        console.log("Tokens persisted. The hunt continues indefinitely. 🩸");
    } catch (e: any) {
        console.error("❌ RITUAL FAILED:", e.message);
        console.log("Fallback: If port 5000 is blocked, please ensure the main server is stopped.");
    } finally {
        process.exit(0);
    }
}

igniteRitual().catch(e => {
    console.error("Fatal ritual error:", e);
    process.exit(1);
});
