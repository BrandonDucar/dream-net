import { config } from 'dotenv';
import { ethers } from 'ethers';
import path from 'path';
import { existsSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const fetch = require('node-fetch');

// -- ENV LOADING --
const rootDir = path.resolve(process.cwd(), '../');
const gcpEnv = path.join(rootDir, '.env.gcp');
if (existsSync(gcpEnv)) config({ path: gcpEnv, override: true });
const rootEnv = path.join(rootDir, '.env');
if (existsSync(rootEnv)) config({ path: rootEnv });

async function run() {
    console.log("🦅 DUTCH OVEN: POLYMARKET PROBE (MATIC)");

    // 1. WALLET CHECK (EVM)
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.log("❌ NO 'PRIVATE_KEY' FOUND. (EVM Wallet)");
    } else {
        try {
            const wallet = new ethers.Wallet(privateKey);
            console.log(`💳 EVM WALLET: ${wallet.address}`);
            // TODO: Check Matic Balance via provider
        } catch (e) {
            console.log("❌ INVALID PRIVATE KEY");
        }
    }

    // 2. MARKET SCAN (Gamma API)
    const url = 'https://gamma-api.polymarket.com/markets?limit=5&active=true&closed=false';
    console.log(`\n📡 SCANNING GAMMA API (${url})...`);

    try {
        const res = await fetch(url);
        if (res.ok) {
            const markets = await res.json();

            // Gamma API returns an array or paginated object?
            // Usually array of market objects.
            const list = Array.isArray(markets) ? markets : (markets.data || []);

            console.log(`✅ CONNECTED. Found ${list.length} Active Markets.`);

            list.slice(0, 5).forEach(m => {
                const title = m.question || m.title || "Untitled";
                const outcomes = JSON.parse(m.outcomes || "[]").join("/");
                console.log(`   - [${m.id}] ${title} (${outcomes})`);
            });

            if (list.length > 0) {
                console.log("\n🎯 CONCLUSION: WE HAVE EYES ON POLYGON.");
                console.log("   We can execute the Dutch Oven here.");
            }

        } else {
            console.log(`❌ API FAILED: ${res.status} ${res.statusText}`);
        }

    } catch (e) {
        console.log("❌ NETWORK ERROR:", e.message);
    }
}

run();
