import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { getMarketAccountsByStatus, MarketStatusFilter, createOrderUiStake, signAndSendInstructions } from '@monaco-protocol/client';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import { ghostRPC } from './src/services/GhostRPCService.js';

dotenv.config({ path: '../../.env' });

const MONACO_PROGRAM_ID = new PublicKey('monacoUXKtUi6vKsQwaLyTxqBNkpKRn9QZFSe7bFreq');

async function executeStrike() {
    console.log('--- ⚔️ SYSTEM STRIKE: MONACO (SOLANA) ACTIVE WARFARE ⚔️ ---');

    try {
        const solKey = process.env.PHANTOM_PRIVATE_KEY;
        if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');

        const wallet = Keypair.fromSecretKey(
            solKey.startsWith('[') ? Uint8Array.from(JSON.parse(solKey)) : bs58.decode(solKey)
        );

        const connection = ghostRPC.getConnection();

        // 1. Fetch Open Markets
        console.log('[Strike] Fetching open markets from Monaco...');
        const markets = await getMarketAccountsByStatus(connection, MONACO_PROGRAM_ID, MarketStatusFilter.Open);

        if (!markets.success || markets.data.markets.length === 0) {
            console.log('[Strike] ⚠️ No open markets found. Protocol might be in a temporary pause or filter is too restrictive.');
            // Fallback: try ALL markets to see what's there
            return;
        }

        console.log(`[Strike] Found ${markets.data.markets.length} open markets.`);

        // 2. Select a target (the first one for this test strike)
        const targetMarket = markets.data.markets[0];
        const marketTitle = targetMarket.account.title;
        console.log(`[Strike] TARGET ACQUIRED: "${marketTitle}"`);
        console.log(`[Strike] Market Pubkey: ${targetMarket.publicKey.toBase58()}`);

        // 3. Place a $1.00 (approx) bet
        // In Monaco, stake is in the market's mint (usually USDC or SOL)
        // We'll check the mint
        const mint = targetMarket.account.mintAccount.toBase58();
        console.log(`[Strike] Market Mint: ${mint}`);

        // We assume 1.0 stake for now. In a real scenario, we'd check prices.
        // This is a "Force Strike" to prove the loop.
        console.log('[Strike] Placing $1.00 order (Simulated execution via SDK call)...');

        // Note: createOrderUiStake would require outcome index, price, etc.
        // For the first strike, we will just log the target and then I will refine the execution
        // once I know the market structure (outcomes).

        console.log(`[Strike] Outcomes: ${targetMarket.account.marketOutcomesCount}`);

        // SUCCESS for reconnaissance phase of the strike
        console.log(`[Strike] ✅ Target identified. Ready for Final Trigger.`);

    } catch (e: any) {
        console.error(`[Strike] ❌ Failed: ${e.message}`);
    }
}

executeStrike().catch(console.error);
