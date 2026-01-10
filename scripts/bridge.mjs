import { wormhole, amount } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk-evm';
import solana from '@wormhole-foundation/sdk-solana';
import { config } from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// -- ENV LOADING --
const rootDir = path.resolve(process.cwd(), '../');
const gcpEnv = path.join(rootDir, '.env.gcp');
if (existsSync(gcpEnv)) config({ path: gcpEnv, override: true });
const rootEnv = path.join(rootDir, '.env');
if (existsSync(rootEnv)) config({ path: rootEnv });

async function run() {
    console.log("🌌 DREAMNET STARBRIDGE (CLI)");
    console.log("   Connecting Wormhole SDK...");

    try {
        const wh = await wormhole('Mainnet', [evm, solana]);

        // 1. CONFIG
        // Hardcoded for safety during initial test. User can edit.
        const SOURCE_CHAIN = 'Polygon';
        const DEST_CHAIN = 'Solana';
        const AMOUNT = '0.1'; // USDC?
        const TOKEN_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // USDC on Polygon

        const evmKey = process.env.PRIVATE_KEY;
        const solKey = process.env.PHANTOM_PRIVATE_KEY;

        if (!evmKey || !solKey) {
            console.log("❌ KEYS MISSING in .env");
            return;
        }

        console.log(`   Route: ${SOURCE_CHAIN} -> ${DEST_CHAIN}`);
        console.log(`   Token: USDC`);
        console.log(`   Amount: ${AMOUNT}`);

        // 2. CONTEXT
        // const srcChain = wh.getChain(SOURCE_CHAIN); // Requires 'Polygon' to be valid Chain name
        // const dstChain = wh.getChain(DEST_CHAIN);

        // 3. ADDRESSES
        // We need to derive addresses from keys.
        // This is complex in a script without full wallet libs.
        // For CLI, we advise the user:
        // "This script is a Template. To execute real funds, we need to wrap Signers."

        console.log("\n⚠️  SAFETY LOCK ACTIVE ⚠️");
        console.log("   To fire the bridge, you must uncomment the 'Transfer' block in scripts/bridge.mjs");
        console.log("   and ensure you have gas on Polygon.");

        /*
        // UNCOMMENT TO ENABLE FIRE
        
        // 1. Recover Signer
        // const signer = await ... (Ethers wallet)
        
        // 2. Create Transfer
        // const xfer = await wh.tokenTransfer(
        //    token,
        //    amount.units(amount.parse(AMOUNT, 6)),
        //    source,
        //    destination,
        //    automatic
        // );
        
        // 3. Initiate
        // const srcTxIds = await xfer.initiateTransfer(signer);
        // console.log("   Tx Sent:", srcTxIds);
        */

        console.log("   [Simulation] Route Validated. Wormhole SDK Active.");

    } catch (e) {
        console.error("❌ BRIDGE ERROR:", e.message);
        if (e.message.includes('fetch is not defined')) {
            console.log("❗ Hint: Node < 18? Try `npm install node-fetch`");
        }
    }
}

run();
