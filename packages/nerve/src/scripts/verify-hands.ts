
import dotenv from 'dotenv';
import { TelegramSuit } from '../spine/suits/TelegramSuit.js';
import path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

async function verifyHands() {
    console.log("🔍 Verifying Mech Suit Motor Functions (The Hands)...");

    // Choose Suit based on available keys. Prefer Telegram for speed/safety.
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error("❌ TELEGRAM_BOT_TOKEN required for Motor Function Test.");
        process.exit(1);
    }

    const suit = new TelegramSuit();

    // Wait for ignition
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!suit.isOnline()) {
        console.error("❌ Suit failed to ignite.");
        process.exit(1);
    }

    console.log("✅ Suit Ignited. Initiating Motor Test Sequence.");

    try {
        // 1. Post
        console.log("👉 Step 1: POST");
        const postResult = await suit.post("System Test: Checking Motor Functions (Hands)...");
        if (!postResult.success || !postResult.id) throw new Error("Post Failed");
        console.log(`✅ Posted Message ID: ${postResult.id}`);

        // Wait to allow human observation
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 2. Edit
        console.log("👉 Step 2: EDIT");
        const editResult = await suit.edit(postResult.id, "System Test: Motor Functions Verified. Hands are operational. ✍️");
        if (!editResult) throw new Error("Edit Failed");
        console.log("✅ Edit Successful.");

        // Wait
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 3. Delete
        console.log("👉 Step 3: DELETE");
        const deleteResult = await suit.delete(postResult.id);
        if (!deleteResult) throw new Error("Delete Failed");
        console.log("✅ Delete Successful.");

        console.log("🎉 ALL MOTOR FUNCTIONS OPERATIONAL.");
        process.kill(process.pid, 'SIGTERM');

    } catch (e: any) {
        console.error(`❌ Motor Test Failed: ${e.message}`);
        process.exit(1);
    }
}

verifyHands();
