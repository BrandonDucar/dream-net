import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ghostRPC } from './src/services/GhostRPCService.js';
import dotenv from 'dotenv';
import bs58 from 'bs58';

dotenv.config({ path: '../../.env' });

async function checkBalances() {
    const solKey = process.env.PHANTOM_PRIVATE_KEY;
    if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');

    // Derived Public Key
    const keypair = solKey.startsWith('[')
        ? Uint8Array.from(JSON.parse(solKey))
        : bs58.decode(solKey);
    // We need to import Keypair to get public key from secret, but to avoid importing all of web3, 
    // let's just use the known public key if possible, or derive it.
    // Actually simpler to just use Keypair import.
    const { Keypair } = await import('@solana/web3.js');
    const wallet = Keypair.fromSecretKey(keypair);
    const pubKey = wallet.publicKey;

    console.log(`Checking Balances for Sovereignty: ${pubKey.toBase58()}`);

    const connection = ghostRPC.getConnection();

    // 1. Check SOL
    const balance = await connection.getBalance(pubKey);
    console.log(`[SOL]: ${balance / LAMPORTS_PER_SOL} SOL`);

    // 2. Check SPL Tokens (BEST, USDC)
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });

    console.log('--- Token Balances ---');
    tokenAccounts.value.forEach((account) => {
        const info = account.account.data.parsed.info;
        const mint = info.mint;
        const amount = info.tokenAmount.uiAmount;

        let symbol = mint;
        if (mint === '8f1zccZPpbjz17Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk') symbol = 'BEST';
        if (mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') symbol = 'USDC';

        console.log(`[${symbol}]: ${amount}`);
    });
}

checkBalances().catch(console.error);
