
import dotenv from 'dotenv';
import { TelegramSuit } from '../spine/suits/TelegramSuit.js';
import path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

async function verify() {
    console.log("🔍 Verifying Telegram Suit...");

    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error("❌ TELEGRAM_BOT_TOKEN not found in environment.");
        process.exit(1);
    }
    console.log("✅ TELEGRAM_BOT_TOKEN found.");

    const suit = new TelegramSuit();

    // Give it a moment to ignite
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (suit.isOnline()) {
        console.log("✅ TelegramSuit is ONLINE.");
        console.log("🎉 Verification SUCCESS.");
        process.kill(process.pid, 'SIGTERM'); // Clean exit
    } else {
        console.error("❌ TelegramSuit failed to come online.");
        process.exit(1);
    }
}

verify();
