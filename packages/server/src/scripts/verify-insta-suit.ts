
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Shim for missing module if needed (similar to X verify)
import { InstagramSuit } from '@dreamnet/nerve';

async function verify() {
    console.log("🔍 Verifying Instagram Biomech Suit Integration...");
    console.log(`🔑 key Check: ${process.env.INSTAGRAM_USERNAME ? "FOUND" : "MISSING"}`);

    try {
        const suit = new InstagramSuit();

        console.log("⚡ Igniting Suit...");
        await suit.ignite();

        if (suit.isOnline()) {
            console.log("\n✅ VERIFICATION SUCCESSFUL: Instagram Login Active.");
            console.log("📸 Ready to Influence.");
        } else {
            console.log("\n⚠️ VERIFICATION INCOMPLETE: Suit failed to come online.");
        }

    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED:", error);
    }
}

verify();
