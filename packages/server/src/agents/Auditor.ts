import { ethers } from 'ethers';
import { agentBus } from './agent-bus.js';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import * as solana from '@solana/web3.js';
import fs from 'fs';
import { Agent, AgentInvocationContext, AgentId } from './core/types.js';
import { epigenetics } from '@dreamnet/memory-dna';

// Fix: Correct path to root .env.gcp
dotenv.config({ path: path.resolve(process.cwd(), '../../.env.gcp') });

import { execSync } from 'child_process';

export interface WalletInventory {
    address: string;
    balance: string;
    symbol: string;
    chain: string;
    purpose: string;
    usdValue: number;
}

export interface AuditorRequest {
    targetVessel?: string;
    checkBuild?: boolean;
}

export interface AuditorResponse {
    inventory: WalletInventory[];
    buildStability?: { score: number; errors: string[] };
}

export class AuditorAgent implements Agent<AuditorRequest, AuditorResponse> {
    public id: AgentId = 'agent-auditor';
    public name = 'Sovereign Auditor';
    public description = 'Audits system wallets, liquidity, and build stability';
    public category = 'monitoring' as const;
    public version = '1.1.0';

    private wallets: Record<string, string> = {
        'VECHAIN': process.env.VECHAIN_WALLET_ADDRESS || '',
        'BASE': process.env.BASE_WALLET_ADDRESS || '',
        'UNISWAP': process.env.UNISWAP_WALLET_ADDRESS || '',
        'COINBASE': process.env.COINBASE_WALLET_ADDRESS || '',
        'PHANTOM': process.env.PHANTOM_WALLET_ADDRESS || '',
        'FARCASTER': process.env.FARCASTER_WALLET_ADDRESS || '',
        'ZORA': process.env.ZORA_WALLET_ADDRESS || '',
        'BASE_MEME': process.env.BASE_MEME_WALLET_ADDRESS || ''
    };

    private baseProvider: ethers.JsonRpcProvider;
    private ethProvider: ethers.JsonRpcProvider;

    constructor() {
        let baseRpc = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
        if (baseRpc.includes('your-api-key')) baseRpc = 'https://mainnet.base.org';
        this.baseProvider = new ethers.JsonRpcProvider(baseRpc);

        let ethRpc = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';
        if (ethRpc.includes('your-api-key')) ethRpc = 'https://eth.llamarpc.com';
        this.ethProvider = new ethers.JsonRpcProvider(ethRpc);
    }

    public async getLivePrices(): Promise<Record<string, number>> {
        try {
            // Priority 1: SensoryCortex Snapshot
            const { cortex } = await import('../services/SensoryCortex.js');
            const snapshot = cortex.getLatestSnapshot();

            if (snapshot && snapshot.crypto) {
                return {
                    'ETH': snapshot.crypto.ethereum || 3300,
                    'BTC': snapshot.crypto.bitcoin || 90000,
                    'USDC': snapshot.crypto['usd-coin'] || 1,
                    'DEGEN': snapshot.crypto['degen-base'] || 0.01,
                    'LINK': snapshot.crypto.chainlink || 20,
                    'UNI': snapshot.crypto.uniswap || 10,
                    'SOL': snapshot.crypto.solana || 150,
                    'VET': snapshot.crypto.vechain || 0.03,
                    'cbETH': (snapshot.crypto.ethereum || 3300) * 1.05,
                    'wstETH': (snapshot.crypto.ethereum || 3300) * 1.15,
                };
            }

            // Priority 2: Direct CryptoSpike fallback
            console.log("[Auditor] 📡 Snapshot missing, calling CryptoSpike directly...");
            const { CryptoSpike } = await import('@dreamnet/sensory-spikes');
            const spike = new CryptoSpike();
            const result = await spike.fetch();
            const data = result.data;

            return {
                'ETH': data.ethereum,
                'BTC': data.bitcoin,
                'USDC': data['usd-coin'],
                'DEGEN': data['degen-base'] || 0.01,
                'LINK': data.chainlink,
                'UNI': data.uniswap,
                'SOL': data.solana,
                'VET': data.vechain,
                'cbETH': data.ethereum * 1.05,
                'wstETH': data.ethereum * 1.15,
            };
        } catch (e) {
            return { 'ETH': 3300, 'USDC': 1, 'SOL': 100, 'VET': 0.03 };
        }
    }

    public getAggregatorLinks(address: string) {
        return [
            `DeBank: https://debank.com/profile/${address}`,
            `Zapper: https://zapper.xyz/account/${address}`,
            `Explorer: https://basescan.org/address/${address}`
        ];
    }

    public async checkBuildStability(): Promise<{ score: number; errors: string[] }> {
        console.log("[Auditor] 🛡️ Auditing Build Stability (The Armor Check)...");
        try {
            // Run a quick typecheck on the monorepo root
            // Note: In production, we might want a more granular check
            execSync('pnpm -r exec tsc --noEmit', { stdio: 'pipe' });
            console.log("[Auditor] ✅ Build Armor is pristine. Stability: 100%");
            return { score: 100, errors: [] };
        } catch (error: any) {
            const errors = error.stdout?.toString().split('\n').filter((l: string) => l.includes('error TS')) || [];
            const score = Math.max(0, 100 - (errors.length * 5));
            console.warn(`[Auditor] ⚠️ Build Armor breached. Stability: ${score}% | Errors: ${errors.length}`);
            return { score, errors };
        }
    }

    public async scanVessels(targetVessel?: string): Promise<WalletInventory[]> {
        const inventory: WalletInventory[] = [];
        const prices = await this.getLivePrices();

        const TOKEN_CONFIGS = [
            { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', chain: 'Base', decimals: 6 },
            { symbol: 'DEGEN', address: '0x4ed4E111100220c4Ba272363102434E7B3527D56', chain: 'Base', decimals: 18 },
            { symbol: 'cbETH', address: '0x2Ae3F1Ec7F1F5BCabc1F5C7C19c86150029E05A9', chain: 'Base', decimals: 18 },
            { symbol: 'wstETH', address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452', chain: 'Base', decimals: 18 },
        ];

        const target = targetVessel?.toUpperCase();
        const vesselsToScan = target ? { [target]: this.wallets[target] } : this.wallets;

        for (const [vessel, rawAddress] of Object.entries(vesselsToScan)) {
            if (!rawAddress) continue;

            if (vessel === 'PHANTOM') {
                try {
                    console.log(`[Auditor] ☀️ Solana Deep Scan for ${vessel}: ${rawAddress}`);
                    const connection = new solana.Connection('https://api.mainnet-beta.solana.com');
                    const pubkey = new solana.PublicKey(rawAddress);
                    const solBal = await connection.getBalance(pubkey);
                    const formatted = solBal / solana.LAMPORTS_PER_SOL;
                    if (formatted > 0) {
                        inventory.push({ address: rawAddress, balance: formatted.toString(), symbol: 'SOL', chain: 'Solana', purpose: vessel, usdValue: formatted * (prices['SOL'] || 0) });
                    }
                } catch (e) { console.error(`[Auditor] Solana Scan Error:`, e); }
                continue;
            }

            if (vessel === 'VECHAIN') {
                try {
                    console.log(`[Auditor] ⛓️ VeChain Deep Scan for ${vessel}: ${rawAddress}`);
                    const response = await axios.get(`https://mainnet.vechain.org/accounts/${rawAddress}`);
                    const vetWei = BigInt(response.data.balance || '0');
                    const formatted = parseFloat(vetWei.toString()) / 1e18;
                    if (formatted > 0) {
                        inventory.push({ address: rawAddress, balance: formatted.toString(), symbol: 'VET', chain: 'VeChain', purpose: vessel, usdValue: formatted * (prices['VET'] || 0) });
                    }
                } catch (e) { console.error(`[Auditor] VeChain Scan Error:`, e); }
                continue;
            }

            const address = rawAddress.toLowerCase();
            // 2025 Sensory Integration (Avenue 29)
            if (ctx?.eventBus) {
                ctx.eventBus.subscribe('EVENT_SCAN_MATCH', (event: any) => {
                    console.log(`\n[Auditor] 🧠 SENSORY FEEDBACK: ${event.payload.vulnerability} on ${event.payload.target}`);
                    this.recordTrauma(`Identified target: ${event.payload.target} via Sensorium.`);
                });
            }
            // 1. Native Balances
            try {
                const baseBal = await this.baseProvider.getBalance(address);
                const ethBase = parseFloat(ethers.formatEther(baseBal));
                if (ethBase > 0) inventory.push({ address, balance: ethBase.toString(), symbol: 'ETH', chain: 'Base', purpose: vessel, usdValue: ethBase * prices['ETH'] });

                const ethBal = await this.ethProvider.getBalance(address);
                const ethMain = parseFloat(ethers.formatEther(ethBal));
                if (ethMain > 0) inventory.push({ address, balance: ethMain.toString(), symbol: 'ETH', chain: 'Ethereum', purpose: vessel, usdValue: ethMain * prices['ETH'] });
            } catch (e) { }

            // 2. Token Discovery (Base Focus)
            for (const token of TOKEN_CONFIGS) {
                try {
                    const contract = new ethers.Contract(token.address, ['function balanceOf(address) view returns (uint256)'], this.baseProvider);
                    const bal = await contract.balanceOf(address);
                    const formatted = parseFloat(ethers.formatUnits(bal, token.decimals));
                    if (formatted > 0) {
                        inventory.push({
                            address,
                            balance: formatted.toString(),
                            symbol: token.symbol,
                            chain: token.chain,
                            purpose: vessel,
                            usdValue: formatted * (prices[token.symbol] || 0)
                        });
                    }
                } catch (e) { }
            }

            // 3. Clanker Reward Scan (Shadow Yield)
            try {
                const { clanker } = await import('../services/ClankerService.js');
                const commonRewardTokens = [
                    { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', priceKey: 'ETH' },
                    { symbol: 'DEGEN', address: '0x4ed4E111100220c4Ba272363102434E7B3527D56', priceKey: 'DEGEN' }
                ];

                for (const token of commonRewardTokens) {
                    const rewards = await clanker.getPendingRewards(address, token.address);
                    const formatted = parseFloat(rewards);
                    if (formatted > 0) {
                        inventory.push({
                            address,
                            balance: rewards,
                            symbol: token.symbol,
                            chain: 'Base',
                            purpose: `CLANKER_REWARDS_${vessel}`,
                            usdValue: formatted * (prices[token.priceKey] || 0)
                        });
                    }
                }
            } catch (e) {
                console.error(`[Auditor] Clanker Reward Scan Error for ${vessel}:`, e);
            }
        }

        this.report(inventory, targetVessel !== undefined);
        fs.writeFileSync(path.resolve(process.cwd(), 'audit_results.json'), JSON.stringify(inventory, null, 2));
        return inventory;
    }

    private report(inventory: WalletInventory[], detail: boolean) {
        console.log(`\n[Auditor] --- Sovereign Inventory Report ---`);
        let totalUSD = 0;
        inventory.forEach(item => {
            totalUSD += item.usdValue;
            console.log(`[Auditor] 📍 ${item.purpose} (${item.chain}): ${parseFloat(item.balance).toFixed(6)} ${item.symbol} (~$${item.usdValue.toFixed(2)})`);
        });
        console.log(`[Auditor] 💎 Total Tracked Value: $${totalUSD.toFixed(2)}`);

        // AGENTIC RECOMMENDATIONS
        console.log(`\n[Auditor] 🧠 Agentic Strategy Recommendations:`);

        const idleETH = inventory.filter(i => i.symbol === 'ETH' && i.usdValue > 1);
        if (idleETH.length > 0) {
            console.log(`[Auditor] 💡 STAKING: You have $${idleETH.reduce((s, c) => s + c.usdValue, 0).toFixed(2)} in idle ETH. Consider wrapping to cbETH or wstETH for ~4% APY.`);
        }

        const degen = inventory.find(i => i.symbol === 'DEGEN');
        if (degen) {
            console.log(`[Auditor] 💡 LIQUIDITY: You hold DEGEN. Consider providing liquidity to the SLU DEGEN/ETH pool for triple yield.`);
        }

        if (detail && inventory.length > 0) {
            this.getAggregatorLinks(inventory[0].address).forEach(link => console.log(`   🔗 ${link}`));
        }
    }

    public async run(input: AuditorRequest, ctx: AgentInvocationContext): Promise<AuditorResponse> {
        let buildStability;
        if (input.checkBuild) {
            buildStability = await this.checkBuildStability();
        }
        const inventory = await this.scanVessels(input.targetVessel);

        return {
            inventory,
            buildStability
        };
    }

    /**
     * Avenue 22: Chew on failed build logs to record topological trauma
     */
    public async analyzeBuildFailure(logPath: string) {
        console.log(`[Auditor] 🧠 Chewing on build failure: ${logPath}`);
        try {
            const content = fs.readFileSync(logPath, 'utf8');

            // Look for both tsc errors and esbuild resolution errors
            const tscErrors = content.match(/error TS[0-9]+/g) || [];
            const resolutionErrors = content.match(/\[ERROR\] Could not resolve "([^"]+)"/g) || [];

            const totalErrors = tscErrors.length + resolutionErrors.length;

            if (totalErrors > 0) {
                console.log(`[Auditor] 🧬 Found ${totalErrors} topological glitches.`);

                [...new Set([...tscErrors, ...resolutionErrors])].forEach(err => {
                    // Hash the error for epigenetic recording
                    const traumaHash = Buffer.from(err).toString('hex').slice(0, 16);
                    epigenetics.logTrauma(traumaHash);
                });

                agentBus.broadcast('BUILD_SHADOW_SHARDED', `Auditor digested ${totalErrors} errors. Epigenetics updated.`, {
                    errorCount: totalErrors,
                    logPath
                });
            }
        } catch (e) {
            console.error(`[Auditor] Failed to digest logs: ${e}`);
        }
    }

    /**
     * Avenue 25/Pillar 19: Chew on failed trades (Metabolic Trauma)
     */
    public async analyzeMetabolicTrauma(operation: string, error: any) {
        console.log(`[Auditor] 🧬 Sharding Metabolic Trauma: ${operation}`);
        const traumaContent = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
        const traumaHash = Buffer.from(`${operation}:${traumaContent}`).toString('hex').slice(0, 16);

        epigenetics.logTrauma(traumaHash);

        agentBus.broadcast('METABOLIC_SHADOW_SHARDED', `Auditor sharded trade failure: ${operation}`, {
            operation,
            traumaHash,
            timestamp: Date.now()
        });
    }

    /**
     * Provide a human-readable self-diagnosis report based on persistent memory
     */
    public getSelfDiagnosis() {
        const memory = epigenetics.report();
        const traumaCount = Object.keys(memory).length;

        console.log(`\n--- [DreamNet Self-Diagnosis] ---`);
        console.log(`Persistent Trauma Markers: ${traumaCount}`);

        if (traumaCount === 0) {
            console.log("Status: HOMEOTYPICAL. No topological trauma detected in recent cycles.");
            return;
        }

        const methylatedCount = Object.values(memory).filter(m => m.methylated).length;
        console.log(`Methylated (Silenced) Genes: ${methylatedCount}`);

        console.log("\nRecent Observations:");
        Object.entries(memory)
            .sort((a, b) => b[1].lastTrauma - a[1].lastTrauma)
            .slice(0, 5)
            .forEach(([hash, marker]) => {
                const status = marker.methylated ? "🔴 SILENCED" : "🟡 ACTIVE";
                console.log(`- Marker [${hash}]: ${marker.crashes} collisions. Status: ${status}`);
            });

        console.log("\nArchitectural Suggestions:");
        if (methylatedCount > 0) {
            console.log("! EMERGENCY: Standardize subpath exports in package.json to eliminate resolution shadows.");
        }
        console.log("- Recommendation: Replace all bleeding relative imports (../../) with workspace aliases (@dreamnet/*).");
        console.log("- Recommendation: Verify industrial pnpm workspace symlinks in ephemeral docker layers.");
    }

    // Avenue 19: Aesthetic hook
    public async getAestheticSnapshot(input: AuditorRequest, output: AuditorResponse, ctx: AgentInvocationContext) {
        // If build is failing, generate a "System Stress" masterpiece
        if (output.buildStability && output.buildStability.score < 100) {
            return {
                title: "The Fractured Monolith",
                description: `A visual representation of system entropy rising. Build Stability: ${output.buildStability.score}%. ${output.buildStability.errors.length} breaches detected.`,
                metadata: { score: output.buildStability.score, type: 'stress' }
            };
        }

        // If wealth is high, generate a "Liquid Assets" masterpiece
        const totalValue = output.inventory.reduce((sum, item) => sum + item.usdValue, 0);
        if (totalValue > 1000) {
            return {
                title: "The Golden Pulse",
                description: `A snapshot of metabolic abundance. Total Tracked Value: $${totalValue.toFixed(2)}.`,
                metadata: { value: totalValue, type: 'abundance' }
            };
        }

        return null;
    }
}

if (import.meta.url.includes(process.argv[1].replace(/\\/g, '/')) || process.argv[1].endsWith('Auditor.ts')) {
    const target = process.argv.includes('--vessel') ? process.argv[process.argv.indexOf('--vessel') + 1] : undefined;
    const checkBuild = process.argv.includes('--check-build');
    const logPath = process.argv.includes('--chew') ? process.argv[process.argv.indexOf('--chew') + 1] : undefined;
    const diagnose = process.argv.includes('--diagnose');

    const agent = new AuditorAgent();
    if (logPath) {
        agent.analyzeBuildFailure(logPath).catch(console.error);
    } else if (diagnose) {
        agent.getSelfDiagnosis();
    } else {
        agent.run({ targetVessel: target, checkBuild }, {} as any).catch(console.error);
    }
}

export const Auditor = new AuditorAgent();
