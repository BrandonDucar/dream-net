import dotenv from 'dotenv';
dotenv.config();

import { ethers } from 'ethers';
import { quantumGuild } from '../server/core/QuantumGuild.js';

/**
 * 🛰️ LiveBlockDaemon
 * Polls the Base blockchain for new blocks and triggers agent emergence.
 */
async function startDaemon() {
    console.log("🛰️ [Daemon] Starting Live Block Monitor on Base Mainnet...");
    
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    let lastBlock = await provider.getBlockNumber();
    
    console.log(`📡 [Daemon] Initialized at block: ${lastBlock}`);

    // Poll every 10 seconds (Base has 2s block time, but we don't want to spam RPC)
    setInterval(async () => {
        try {
            const currentBlock = await provider.getBlockNumber();
            
            if (currentBlock > lastBlock) {
                console.log(`\n📦 [Daemon] NEW BLOCK DETECTED: ${currentBlock}`);
                
                for (let i = lastBlock + 1; i <= currentBlock; i++) {
                    const block = await provider.getBlock(i);
                    if (block) {
                        await quantumGuild.analyzeBlockEmergence(i, block.hash, 'base');
                    }
                }
                
                lastBlock = currentBlock;
            }
        } catch (error: any) {
            console.error(`❌ [Daemon] Polling error:`, error.message);
        }
    }, 10000);
}

startDaemon();
