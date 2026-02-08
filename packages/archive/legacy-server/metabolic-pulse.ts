import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import axios from 'axios';
import { ghostRPC } from './src/services/GhostRPCService.js';
import { Auditor } from './src/agents/Auditor.js';

dotenv.config({ path: '../../.env' });

const BEST_MINT = '8f1zccZPpbjz17Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

// Helper: Fetch Price and Calculate Raw Amount for Target USD
async function getAmountForUsd(targetUsd: number): Promise<string> {
    try {
        console.log(`[Metabolic] 🧮 Calculating raw amount for $${targetUsd} USD...`);
        // Use DexScreener (No Auth required, reliable for shitcoins)
        const res = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${BEST_MINT}`);
        const pair = res.data.pairs?.[0];

        if (!pair) throw new Error('Price data unavailable on DexScreener');

        const price = parseFloat(pair.priceUsd);
        console.log(`[Metabolic] 💲 Price: $${price.toFixed(8)}`);

        const tokensNeeded = targetUsd / price;
        const decimals = 6; // BEST has 6 decimals confirmed
        const rawAmount = Math.floor(tokensNeeded * Math.pow(10, decimals));

        console.log(`[Metabolic] 🎯 Target: ${tokensNeeded.toFixed(2)} BEST`);
        console.log(`[Metabolic] 🔢 Raw: ${rawAmount}`);

        return rawAmount.toString();
    } catch (e: any) {
        console.error(`[Metabolic] ⚠️ Price Fetch Failed: ${e.message}. Using hardcoded fallback (~$10).`);
        // Fallback: ~24.6M tokens * 10^6
        return '24618414574101';
    }
}

async function runMetabolicTrade() {
    try {
        console.log('--- DreamNet Metabolic Pulse: BEST -> SOL ---');

        const solKey = process.env.PHANTOM_PRIVATE_KEY;
        if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');

        const wallet = Keypair.fromSecretKey(
            solKey.startsWith('[') ? Uint8Array.from(JSON.parse(solKey)) : bs58.decode(solKey)
        );

        const connection = ghostRPC.getConnection();

        // 1. Calculate Exact Amount for $10
        const swapAmountRaw = await getAmountForUsd(10);

        console.log(`[Metabolic] Fetching swap quote for ${swapAmountRaw} raw units...`);

        // 2. Get Quote from Jupiter
        const quoteRes = await axios.get(`https://public.jupiterapi.com/quote?inputMint=${BEST_MINT}&outputMint=${SOL_MINT}&amount=${swapAmountRaw}&slippageBps=100`);
        const quoteResponse = quoteRes.data;

        console.log(`[Metabolic] Quote received. Building Transaction...`);

        // 3. Build Swap Transaction (with Priority Fees)
        const swapRes = await axios.post('https://public.jupiterapi.com/swap', {
            quoteResponse,
            userPublicKey: wallet.publicKey.toBase58(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: "auto" // Critical for network congestion
        });

        const { swapTransaction } = swapRes.data;
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // 4. Sign
        transaction.sign([wallet]);

        console.log(`[Metabolic] Broadcasting to ${connection.rpcEndpoint}...`);

        // 5. Broadcast
        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: false,
            maxRetries: 2
        });

        console.log(`[Metabolic] ✅ SUCCESS! Pulse Broadcasted.`);
        console.log(`[Metabolic] Sig: https://solscan.io/tx/${signature}`);

        // Output signature cleanly for capture if needed
        console.log(`SIG:${signature}`);

    } catch (e: any) {
        const errorMsg = e.response?.data?.error || e.message;
        console.error(`[Metabolic] 🧬 Metabolic Trauma Identified: ${errorMsg}`);
        await Auditor.analyzeMetabolicTrauma('BEST_SWAP_PULSE', errorMsg);

        if (typeof errorMsg === 'string' && (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('DNS'))) {
            ghostRPC.rotateProvider(errorMsg);
        }
    }
}

runMetabolicTrade().catch(console.error);
