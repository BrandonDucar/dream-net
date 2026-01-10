import { Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';
import { ghostRPC } from './src/services/GhostRPCService.js';

dotenv.config({ path: '../../.env' });

async function fetchRecent() {
    const solKey = process.env.PHANTOM_PRIVATE_KEY;
    if (!solKey) throw new Error('PHANTOM_PRIVATE_KEY missing');

    const wallet = Keypair.fromSecretKey(
        solKey.startsWith('[') ? Uint8Array.from(JSON.parse(solKey)) : bs58.decode(solKey)
    );

    const connection = ghostRPC.getConnection();
    // Silencing scan log
    // console.log(`Scanning history for: ${wallet.publicKey.toBase58()}`);

    const signatures = await connection.getSignaturesForAddress(wallet.publicKey, { limit: 1 });

    if (signatures.length > 0) {
        const latest = signatures[0];
        console.log(latest.signature);
        // Write to file safely
        await import('fs').then(fs => {
            fs.writeFileSync('sig.json', JSON.stringify({ signature: latest.signature }));
        });
    } else {
        console.error('No signatures found.');
    }
}

fetchRecent(); // Removed catch to crash on error for purity, or keep catch but silent
