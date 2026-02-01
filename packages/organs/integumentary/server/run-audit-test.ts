import { Auditor } from './src/agents/Auditor.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../../.env' });

async function runAudit() {
    console.log('--- 🛡️ Sovereign Omni-Audit Initialized ---');
    const inventory = await Auditor.scanVessels();

    const baseTokens = inventory
        .filter(item => item.chain === 'Base' || item.chain === 'Ethereum')
        .sort((a, b) => b.usdValue - a.usdValue)
        .slice(0, 4);

    const solanaTokens = inventory
        .filter(item => item.chain === 'Solana')
        .sort((a, b) => b.usdValue - a.usdValue)
        .slice(0, 4);

    console.log('\n🔵 BASE WALLET (MetaMask) TOP 4:');
    baseTokens.forEach((t, i) => console.log(`${i + 1}. ${t.symbol}: ${t.balance} (~$${t.usdValue.toFixed(2)})`));

    console.log('\n☀️ SOLANA WALLET (Phantom) TOP 4:');
    solanaTokens.forEach((t, i) => console.log(`${i + 1}. ${t.symbol}: ${t.balance} (~$${t.usdValue.toFixed(2)})`));
}

runAudit().catch(console.error);
