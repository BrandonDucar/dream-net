import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import { ghostRPC } from './src/services/GhostRPCService.js';
import axios from 'axios';

dotenv.config({ path: '../../.env' });

const BEST_MINT = '8f1zccZPpbjz17Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk';
const WEN_MINT = 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

async function getPrice(mint: string) {
    try {
        const res = await axios.get(`https://api.jup.ag/price/v2?ids=${mint}`);
        return res.data.data[mint]?.price || 0;
    } catch {
        return 0;
    }
}

async function checkBalances() {
    const solKey = process.env.PHANTOM_PRIVATE_KEY;
    if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');

    const wallet = Keypair.fromSecretKey(
        solKey.startsWith('[') ? Uint8Array.from(JSON.parse(solKey)) : bs58.decode(solKey)
    );
    const pubkey = wallet.publicKey;
    const connection = ghostRPC.getConnection();

    console.log(`\n--- PHANTOM GROUND TRUTH: ${pubkey.toBase58()} ---`);

    // 1. SOL Balance
    const solBal = await connection.getBalance(pubkey);
    const solPrice = await getPrice('So11111111111111111111111111111111111111112');
    const solUi = solBal / 1e9;
    console.log(`SOL: ${solUi.toFixed(4)} (~$${(solUi * solPrice).toFixed(2)})`);

    // 2. SPL Tokens
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });

    for (const ta of tokenAccounts.value) {
        const info = ta.account.data.parsed.info;
        const mint = info.mint;
        const amount = info.tokenAmount.uiAmount;

        if (amount > 0) {
            let ticker = 'UNKNOWN';
            if (mint === BEST_MINT) ticker = 'BEST';
            if (mint === WEN_MINT) ticker = 'WEN';
            if (mint === USDC_MINT) ticker = 'USDC';

            const price = await getPrice(mint);
            const usdVal = amount * Number(price);

            console.log(`${ticker}: ${amount.toLocaleString()} (~$${usdVal.toFixed(2)})`);
        }
    }
}

checkBalances().catch(console.error);
