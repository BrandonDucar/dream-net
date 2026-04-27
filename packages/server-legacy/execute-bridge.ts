import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import { ethers } from 'ethers';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import axios from 'axios';
import { ghostRPC } from './src/services/GhostRPCService.js';

dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../.env.gcp' });

// Configuration
const USDC_SOL_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const POLYGON_CHAIN_ID = 137;
// DLN Chain IDs: Solana=7565164, Base=8453 (Wait, need to check DLN API docs for specific IDs)
// Actually DeBridge/DLN uses: 7565164 (Solana), 8453 (Base Code? or standard EVM ID?)
// Standard DLN API uses numeric IDs. Solana: 7565164, Base: 8453.

async function bridgeToPolygon() {
    console.log('--- 🌉 Operation: The Polygon Patch (Solana -> Polygon) 🌉 ---');

    // 1. Initialize Wallets
    const solKey = process.env.PHANTOM_PRIVATE_KEY;
    if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');
    const phantom = Keypair.fromSecretKey(bs58.decode(solKey!));

    const ethKey = process.env.METAMASK_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!ethKey) throw new Error('METAMASK_PRIVATE_KEY (or PRIVATE_KEY) missing');
    const metaMaskWallet = new ethers.Wallet(ethKey!);
    const destAddress = metaMaskWallet.address;

    console.log(`[Source] Phantom: ${phantom.publicKey.toBase58()}`);
    console.log(`[Dest] MetaMask: ${destAddress} (Base)`);

    // 2. Prepare Amount ($5 USDC for Polygon gas/capital)
    const AMOUNT_USDC = 5000000;

    // 3. Get Quote from DeBridge DLN API
    // Doc ref: https://docs.dln.trade/
    const DLN_API = 'https://api.dln.trade/v1.0/dln/order/create-tx';

    // We want to receive native ETH on Base if possible for Gas
    // Input: USDC (Solana), Output: ETH (Base) -> '0x0000000000000000000000000000000000000000'
    const params = {
        srcChainId: 7565164, // Solana
        srcChainTokenIn: USDC_SOL_MINT,
        srcChainTokenInAmount: AMOUNT_USDC.toString(),
        dstChainId: 137, // Polygon
        dstChainTokenOut: '0x0000000000000000000000000000000000000000', // Native MATIC/POL
        dstChainTokenOutAmount: 'auto', // Let API calculate
        srcChainOrderAuthorityAddress: phantom.publicKey.toBase58(), // Who signs
        dstChainOrderAuthorityAddress: destAddress, // Who can cancel/manage
        dstChainTokenOutRecipient: destAddress, // Who gets money
        affiliateFeePercent: 0,
        prependOperatingExpenses: true // Pay relayer fees upfront if needed
    };

    console.log(`[Bridge] Fetching DLN Quote ($7 USDC -> Polygon MATIC)...`);

    try {
        const res = await axios.get(DLN_API, { params });
        const txData = res.data;

        console.log(`[Bridge] API Response TX Data Length:`, txData.tx.data.length);

        let txBuffer;
        const rawData = txData.tx.data;

        // Robust Decoding Strategy
        try {
            // First try Base64 (Standard for Solana)
            txBuffer = Buffer.from(rawData, 'base64');
            // Quick sanity check: Solana txs are usually < 1232 bytes, getting close to raw size
        } catch (e) {
            console.log('[Bridge] Base64 decode failed, trying Hex...');
        }

        // If deserialization fails, it might be Hex encoded (DeBridge sometimes does this)
        if (!txBuffer && (rawData.startsWith('0x') || /^[0-9a-fA-F]+$/.test(rawData))) {
            console.log('[Bridge] Detected Hex format...');
            txBuffer = Buffer.from(rawData.replace(/^0x/, ''), 'hex');
        }

        let transaction;
        const connection = ghostRPC.getConnection();

        try {
            transaction = VersionedTransaction.deserialize(txBuffer);
        } catch (e) {
            console.log('[Bridge] Standard deserialize failed. Trying forced Hex...');
            txBuffer = Buffer.from(rawData.replace(/^0x/, ''), 'hex');
            transaction = VersionedTransaction.deserialize(txBuffer);
        }

        console.log(`[Bridge] Transaction Deserialized! Fetching fresh blockhash...`);

        // CRITICAL FIX: Overwrite stale blockhash from API
        const { blockhash } = await connection.getLatestBlockhash('confirmed');
        transaction.message.recentBlockhash = blockhash;

        console.log(`[Bridge] Signing with fresh blockhash: ${blockhash}...`);
        transaction.sign([phantom]);

        // 5. Broadcast
        console.log(`[Bridge] Broadcasting to ${connection.rpcEndpoint}...`);

        const signature = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: false,
            maxRetries: 2
        });

        console.log(`[Bridge] ✅ SUCCESS! Bridge Order Placed.`);
        console.log(`[Bridge] Sig: https://solscan.io/tx/${signature}`);
        console.log(`[Bridge] Note: Bridging takes 2-15 minutes.`);
        console.log(`SIG:${signature}`);

    } catch (e: any) {
        console.error(`[Bridge] ❌ Quote/Exec Failed: ${e.message}`);
        if (e.response) {
            console.error('API Error:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

bridgeToPolygon().catch(console.error);
