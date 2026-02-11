import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import axios from 'axios';
import { ghostRPC } from './src/services/GhostRPCService.js';

dotenv.config({ path: '../../.env' });

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const JLP_MINT = '27G8MtS7JWiS3Lc2N6Z14fvYvFfGedK5F9N4F9v2Aump';

async function jlpStrike() {
    console.log('--- ⚔️ JLP Strike: Harvesting Passive Yield ---');

    try {
        const solKey = process.env.PHANTOM_PRIVATE_KEY;
        if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');

        const wallet = Keypair.fromSecretKey(
            solKey.startsWith('[') ? Uint8Array.from(JSON.parse(solKey)) : bs58.decode(solKey)
        );

        const connection = ghostRPC.getConnection();

        // 1. Target: ~0.05 SOL (~$10-12 depends on price)
        // Keep some SOL for gas!
        const swapAmountSOL = 0.05 * 1e9;

        console.log(`[JLP] Fetching quote for ${0.05} SOL -> JLP...`);

        // 2. Get Quote
        const quoteRes = await axios.get(`https://public.jupiterapi.com/quote?inputMint=${SOL_MINT}&outputMint=${JLP_MINT}&amount=${swapAmountSOL}&slippageBps=100`);
        const quoteResponse = quoteRes.data;

        console.log(`[JLP] Quote received. Out: ${quoteResponse.outAmount / 1e9} JLP`);

        // 3. Build Swap Transaction
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
        console.log(`[JLP] Broadcasting to ${connection.rpcEndpoint}...`);

        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: false,
            maxRetries: 2
        });

        console.log(`[JLP] ✅ SUCCESS! Strike confirmed.`);
        console.log(`[JLP] Sig: https://solscan.io/tx/${signature}`);
        console.log(`SIG:${signature}`);

    } catch (e: any) {
        console.error(`[JLP] ❌ Strike Failed: ${e.message}`);
        if (e.response) console.error(JSON.stringify(e.response.data, null, 2));
    }
}

jlpStrike().catch(console.error);
