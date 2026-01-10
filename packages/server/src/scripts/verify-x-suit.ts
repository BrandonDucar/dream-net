
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function verify() {
    console.log("🔍 Verifying X Biomech Suit Integration...");
    console.log(`🔑 Key Check: ${process.env.TWITTER_API_KEY ? "FOUND" : "MISSING"}`);

    try {
        // Dynamic import to rely on built package
        const { elizaBridge } = await import('@dreamnet/nerve');

        console.log("⚡ Igniting Bridge...");

        // 1. Ignite & Scan Test
        const start = Date.now();
        const result = await elizaBridge.signal({
            agentId: 'X-VERIFIER',
            plugin: 'x',
            action: 'scan',
            payload: { query: 'crypto', limit: 2 }
        });

        console.log(`⏱️ Response Time: ${Date.now() - start}ms`);
        console.log("📊 Result:", JSON.stringify(result, null, 2));

        if (Array.isArray(result) && result.length > 0) {
            console.log("\n✅ VERIFICATION SUCCESSFUL: Real Data Received.");
        } else {
            console.log("\n⚠️ VERIFICATION INCOMPLETE: No results found (or empty scan).");
        }

    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED:", error);
    }
}

verify();
