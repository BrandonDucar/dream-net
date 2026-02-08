import * as solana from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

async function listMints() {
    const solKey = process.env.PHANTOM_PRIVATE_KEY;
    if (!solKey) return;
    const connection = new solana.Connection('https://api.mainnet-beta.solana.com');
    let keypair;
    if (solKey.startsWith('[') && solKey.endsWith(']')) {
        keypair = solana.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(solKey)));
    } else {
        keypair = solana.Keypair.fromSecretKey(bs58.decode(solKey));
    }
    const pubkey = keypair.publicKey;
    const accounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new solana.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });
    console.log('--- ALL MINTS IN WALLET ---');
    for (const acc of accounts.value) {
        const info = acc.account.data.parsed.info;
        if (info.tokenAmount.uiAmount > 0) {
            console.log(`Mint: ${info.mint} | Balance: ${info.tokenAmount.uiAmountString}`);
        }
    }
}
listMints().catch(console.error);
