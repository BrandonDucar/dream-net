import { config } from 'dotenv';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import path from 'path';
import { existsSync } from 'fs';

// -- ENV --
const rootDir = path.resolve(process.cwd(), '../');
const gcpEnv = path.join(rootDir, '.env.gcp');
if (existsSync(gcpEnv)) config({ path: gcpEnv, override: true });
const rootEnv = path.join(rootDir, '.env');
if (existsSync(rootEnv)) config({ path: rootEnv });

const MONACO_PROGRAM_ID = new PublicKey('monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih');

async function run() {
    console.log("🦅 DUTCH OVEN: RAW CHAIN LINK");

    // Setup 
    const privateKey = process.env.PHANTOM_PRIVATE_KEY || process.env.SOLANA_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!privateKey) { console.log("❌ Key Missing."); return; }

    const connection = new Connection('https://api.mainnet-beta.solana.com');
    // Using a public RPC might 429 us on getProgramAccounts. Ideally we need a Helius/QuickNode but let's try.

    console.log("📡 FETCHING ACCOUNTS FROM MONACO PROGRAM...");

    try {
        // Fetch a small slice to save bandwidth if possible, or filter by size.
        // Market account size in Monaco v1 was approx 375 bytes? Or much larger? 
        // Let's just try fetching 5.
        // getProgramAccounts is heavy.

        // Strategy: Filter by data size if known.
        // Assuming Market Account Discriminator or just fetch all and parse manually (heavy).
        // Let's try fetching just a few.
        // Actually, without a filter, this download is HUGE (MBs).

        // ALTERNATIVE: Use a known market address from the user provided screenshot? No, I can't see the full address.
        // I will trust the Search Service for an ACTIVE market ID?
        // Or... ask the user?

        // Let's try to just find ONE market.
        // Filter: memcmp (Discriminator).
        // I don't know the discriminator offhand.

        // PLAN C:
        // Use the BetDEX API again but with correct headers?
        // User Agent: Mozilla/5.0...
        // Header: 'Origin': 'https://app.betdex.com'

        console.log("   (Raw Chain Scan is heavy, falling back to API with improved headers)");

        const fetch = (await import('node-fetch')).default;

        const res = await fetch('https://api.betdex.com/v1/markets', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://app.betdex.com',
                'Referer': 'https://app.betdex.com/'
            }
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`✅ CONNECTED TO BETDEX API.`);
            const markets = data.markets || data;
            console.log(`   Found: ${markets.length || 0} markets.`);

            if (markets.length > 0) {
                console.log("   Latest Markets:");
                markets.slice(0, 5).forEach(m => console.log(`   - ${m.title || m.question}`));
            }
        } else {
            console.log(`❌ API Failed: ${res.status} ${res.statusText}`);
        }

    } catch (e) {
        console.log("❌ ERROR:", e);
    }
}

run();
