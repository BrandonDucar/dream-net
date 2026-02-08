import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';
import { ghostRPC } from './src/services/GhostRPCService.js';

dotenv.config({ path: '../../.env' });

async function deepRecon() {
    console.log('--- 🛡️ Monaco Protocol Deep Recon ---');
    const connection = ghostRPC.getConnection();
    const programId = new PublicKey('monacoUXKtUi6vKsQwaLyTxqBNkpKRn9QZFSe7bFreq');

    try {
        console.log('[DeepRecon] Fetching all program accounts...');

        // This is the "Nuclear Option" - fetch everything
        // Filter for account size that matches a Market (approx 500-1000 bytes)
        const accounts = await connection.getProgramAccounts(programId, {
            filters: [
                { dataSize: 664 } // Approximate size of a Monaco Market account, found in protocol repo
            ]
        });

        console.log(`[DeepRecon] Found ${accounts.length} potential market accounts.`);

        // For the demo/strike, we'll pick the first active-looking one
        for (const account of accounts.slice(0, 3)) {
            console.log(`\nMarket Account: ${account.pubkey.toBase58()}`);
            // Data parsing would go here, but for now we just confirm we found them
        }

    } catch (e: any) {
        console.error(`[DeepRecon] ❌ Error: ${e.message}`);
    }
}

deepRecon().catch(console.error);
