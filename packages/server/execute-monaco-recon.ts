import { Connection, PublicKey } from '@solana/web3.js';
import { getMarketAccounts, getMarketOutcomesByMarket } from '@monaco-protocol/client';
import dotenv from 'dotenv';
import { ghostRPC } from './src/services/GhostRPCService.js';

dotenv.config({ path: '../../.env' });

async function reconMonaco() {
    console.log('--- 🕵️ Monaco Protocol Reconnaisance ---');
    const connection = ghostRPC.getConnection();
    const programId = new PublicKey('monacoUXKtUi6vKsQwaLyTxqBNkpKRn9QZFSe7bFreq');

    try {
        console.log('[Recon] Fetching active markets from Monaco Program...');

        // Fetch public markets
        const markets = await getMarketAccounts(connection, programId);

        console.log(`[Recon] Found ${markets.data.markets.length} total markets.`);

        // Filter for "Open" and "Liquid" markets
        const activeMarkets = markets.data.markets.filter(m => m.account.marketStatus.open);
        console.log(`[Recon] ${activeMarkets.length} markets are currently OPEN.`);

        for (const market of activeMarkets.slice(0, 5)) {
            console.log(`\nMarket: ${market.account.title}`);
            console.log(`  Address: ${market.publicKey.toBase58()}`);

            // Fetch outcomes (Yes/No prices)
            const outcomes = await getMarketOutcomesByMarket(connection, market.publicKey);

            if (outcomes.data && outcomes.data.outcomes) {
                console.log('  Outcomes:');
                outcomes.data.outcomes.forEach(o => {
                    console.log(`    - ${o.account.title}: Price: ${o.account.price} | Liquidity: ${o.account.liquidity}`);
                });
            }
        }

    } catch (e: any) {
        console.error(`[Recon] ❌ Error: ${e.message}`);
    }
}

reconMonaco().catch(console.error);
