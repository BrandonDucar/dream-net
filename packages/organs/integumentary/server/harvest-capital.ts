import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import axios from 'axios';
import { ghostRPC } from './src/services/GhostRPCService.js';
import { Auditor } from './src/agents/Auditor.js';

dotenv.config({ path: '../../.env' });

const BEST_MINT = '8f1zccZPpbjz17Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Solana USDC

// Helper: Fetch Price and Calculate Raw Amount for Target USD
async function getAmountForUsd(targetUsd: number): Promise<string> {
    try {
        console.log(`[Harvest] 🧮 Calculating raw BEST amount for $${targetUsd} USD...`);
        // Use DexScreener
        const res = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${BEST_MINT}`);
        const pair = res.data.pairs?.[0];

        if (!pair) throw new Error('Price data unavailable on DexScreener');

        const price = parseFloat(pair.priceUsd);
        console.log(`[Harvest] 💲 Price: $${price.toFixed(8)}`);

        const tokensNeeded = targetUsd / price;
        const decimals = 6; // BEST has 6 decimals
        const rawAmount = Math.floor(tokensNeeded * Math.pow(10, decimals));

        console.log(`[Harvest] 🎯 Target: ${tokensNeeded.toFixed(2)} BEST`);
        console.log(`[Harvest] 🔢 Raw: ${rawAmount}`);

        return rawAmount.toString();
    } catch (e: any) {
        console.error(`[Harvest] ⚠️ Price Fetch Failed: ${e.message}. Using conservative fallback (~37M BEST).`);
        return '37000000000000'; // Fallback
    }
}

async function harvest() {
    try {
        console.log('--- Operation Harvest: BEST -> USDC ---');

        const solKey = process.env.PHANTOM_PRIVATE_KEY;
        if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');

        const wallet = Keypair.fromSecretKey(
            solKey.startsWith('[') ? Uint8Array.from(JSON.parse(solKey)) : bs58.decode(solKey)
        );

        const connection = ghostRPC.getConnection();

        // 1. Calculate Amount for $15
        const swapAmountRaw = await getAmountForUsd(15);

        console.log(`[Harvest] Fetching swap quote for ${swapAmountRaw} raw units...`);

        // 2. Get Quote (BEST -> USDC)
        const quoteRes = await axios.get(`https://public.jupiterapi.com/quote?inputMint=${BEST_MINT}&outputMint=${USDC_MINT}&amount=${swapAmountRaw}&slippageBps=100`);
        const quoteResponse = quoteRes.data;

        console.log(`[Harvest] Quote received. Out: ${(quoteResponse.outAmount / 1e6).toFixed(2)} USDC`);

        // 3. Build Transaction
        const swapRes = await axios.post('https://public.jupiterapi.com/swap', {
            quoteResponse,
            userPublicKey: wallet.publicKey.toBase58(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: "auto"
        });

        const { swapTransaction } = swapRes.data;
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // 4. Sign & Send
        transaction.sign([wallet]);
        console.log(`[Harvest] Broadcasting...`);

        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: false,
            maxRetries: 2
        });

        console.log(`[Harvest] ✅ SUCCESS! Funds Secured.`);
        console.log(`[Harvest] Sig: https://solscan.io/tx/${signature}`);
        console.log(`SIG:${signature}`);

    } catch (e: any) {
        console.error(`[Harvest] ❌ Failure: ${e.message}`);
        if (e.response) console.error(e.response.data);
    }
}

harvest().catch(console.error);
