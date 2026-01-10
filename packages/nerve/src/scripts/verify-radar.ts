
import dotenv from 'dotenv';
import { TelegramSuit } from '../spine/suits/TelegramSuit.js';
import { DiscordSuit } from '../spine/suits/DiscordSuit.js'; // Requires build/stub if not full
import path from 'path';

// Load environment variables
// Assumes script is run from project root
dotenv.config({ path: '.env' });

async function verifyRadar() {
    console.log("📡 Verifying Active Radar Systems...");

    // 1. Test Telegram Radar (Buffer)
    console.log("\n👉 Testing Telegram Radar...");
    if (process.env.TELEGRAM_BOT_TOKEN) {
        const teleSuit = new TelegramSuit();
        await new Promise(r => setTimeout(r, 2000)); // Wait for ignite

        // Telegram Radar relies on *incoming* messages to fill buffer. 
        // We can't easily force it without sending a real message, but we can check if it returns an array.
        const sweep = await teleSuit.scan();
        console.log(`✅ Telegram Scan Returned: ${Array.isArray(sweep) ? sweep.length + " items" : "FAILED"}`);
        // Note: Likely 0 items if no messages sent during this short run.
    } else {
        console.log("⚠️ Telegram Token missing. Skipping.");
    }

    // 2. Test Discord Radar (API Fetch)
    console.log("\n👉 Testing Discord Radar...");
    if (process.env.DISCORD_TOKEN && process.env.DISCORD_DEFAULT_CHANNEL_ID) {
        const discordSuit = new DiscordSuit();
        await new Promise(r => setTimeout(r, 2000)); // Wait for login

        try {
            const sweep = await discordSuit.scan();
            console.log(`✅ Discord Scan Returned: ${Array.isArray(sweep) ? sweep.length + " items" : "FAILED"}`);
            if (sweep.length > 0) {
                console.log(`Snapshot: [${sweep[0].author}] ${sweep[0].content.substring(0, 20)}...`);
            }
        } catch (e: any) {
            console.error(`❌ Discord Scan Error: ${e.message}`);
        }

        // Cleanup 
        process.kill(process.pid, 'SIGTERM');
    } else {
        console.log("⚠️ Discord Token/Channel missing. Skipping.");
    }

    // Force exit
    setTimeout(() => process.exit(0), 5000);
}

verifyRadar();
