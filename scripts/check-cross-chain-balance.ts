
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CHAINS = [
    { name: 'Ethereum', rpc: 'https://eth.llamarpc.com', symbol: 'ETH' },
    { name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH' },
    { name: 'Chiliz', rpc: process.env.CHILIZ_RPC_URL || 'https://rpc.chiliz.com', symbol: 'CHZ' }
];

async function scanBalances() {
    const pKey = process.env.METAMASK_PRIVATE_KEY || process.env.PHANTOM_PRIVATE_KEY;
    if (!pKey) {
        console.error("❌ No Private Key found.");
        return;
    }

    console.log(`[💰 Wallet Scan] Checking funds for deployment...`);

    for (const chain of CHAINS) {
        try {
            const provider = new ethers.JsonRpcProvider(chain.rpc);
            const wallet = new ethers.Wallet(pKey, provider);
            const balance = await provider.getBalance(wallet.address);

            console.log(`   - ${chain.name.padEnd(10)}: ${ethers.formatEther(balance)} ${chain.symbol}`);

            if (chain.name !== 'Chiliz' && balance > 0n) {
                console.log(`     (Potential Bridge Source found on ${chain.name})`);
            }
        } catch (error) {
            console.log(`   - ${chain.name.padEnd(10)}: [Error connecting]`);
        }
    }
}

scanBalances();
