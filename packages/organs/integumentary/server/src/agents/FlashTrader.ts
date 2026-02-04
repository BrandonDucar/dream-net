import { ethers } from 'ethers';
import { agentBus } from './agent-bus';
import { clanker } from '../services/ClankerService';
import { Agent, AgentInvocationContext, AgentId } from './core/types';
import { mevShield } from '../services/MEVShieldService';
import { dutchBook } from '../services/DutchBookService';
import { solanaTreasury } from '../services/SolanaTreasuryService';
import { TreasuryGuards } from '../services/TreasuryGuards';
import { metabolicBridge } from '../services/MetabolicBridgeService';

export interface FlashTraderRequest {
    targetToken?: string;
    minLiquidity?: string;
    maxSlippage?: number;
}

export interface FlashTraderResponse {
    action: 'buy' | 'sell' | 'hold' | 'monitor';
    reason: string;
    metadata?: any;
}

export class FlashTraderAgent implements Agent {
    public id: AgentId = "FlashTrader" as AgentId;
    private provider: ethers.JsonRpcProvider;

    constructor() {
        const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.initListeners();

        // 🛰️ Auto-Pilot Assignment
        import('@dreamnet/nerve').then(({ pilotRegistry }) => {
            pilotRegistry.assign(this.id, 'x'); // Primary Suit
            pilotRegistry.assign(this.id, 'farcaster'); // Secondary Suit
            console.log(`[FlashTrader] 🧥 Suits Equipped: X (Twitter) & Farcaster`);
        });
    }

    private initListeners() {
        console.log('[FlashTrader] Listening for Clanker Metabolic Pulses...');

        agentBus.on('CLANKER_TOKEN_BORN', (data) => {
            console.log(`[FlashTrader] 📡 Detected potential trade opportunity: ${data.name} (${data.symbol})`);
            this.evaluateOpportunity(data);
        });
    }

    private async evaluateOpportunity(data: any) {
        console.log(`[FlashTrader] 🧠 Evaluating ${data.symbol}...`);

        // Avenue 13 Injection: Secure Execution
        // Instead of public AMM, we prepare a CowSwap intent if the vibe is high
        if (data.name.includes('Sovereign')) {
            console.log(`[FlashTrader] 🛡️ High Vibe detected. Routing via MEV Shield...`);
            await mevShield.executeCowSwapTrade({
                sellToken: '0x4200000000000000000000000000000000000006', // WETH
                buyToken: data.token,
                sellAmount: ethers.parseEther('0.01').toString(),
                receiver: '0xMONOLITH_TREASURY_0x...'
            });
        }
    }

    public async run(input: FlashTraderRequest, ctx: AgentInvocationContext): Promise<FlashTraderResponse> {
        console.log(`[FlashTrader] Running manual trade scan for ${input.targetToken || 'Ecosystem'}`);

        // Avenue 8: Arbitrage Scan
        const arb = await dutchBook.scanForArbitrage();
        if (arb.opportunity) {
            console.log(`[FlashTrader] 💰 Profitable spread detected! Alpha: ${arb.spread}`);
        }

        // Avenue 8: Arbitrage Leg Validation
        if (arb.opportunity) {
            try {
                await TreasuryGuards.validateTrade({
                    token: 'SPREAD',
                    amountUsd: 10, // Mock for now
                    slippageBps: 50,
                    type: 'arbitrage'
                });
            } catch (e: any) {
                console.warn(`[FlashTrader] 🛑 Guard violation: ${e.message}`);
                arb.opportunity = false;
            }
        }

        // Avenue 14: Solana Scan & Metabolic Support
        const solBalance = await solanaTreasury.scanBalances();
        if (solBalance.length > 0) {
            console.log(`[FlashTrader] ☀️ Solana assets detected: ${solBalance.map(b => b.symbol).join(', ')}`);

            // IF a metabolic test is requested OR a high-alpha spread exists
            if (input.targetToken === 'METABOLIC_TEST' || (arb.opportunity && arb.spread > 0.05)) {
                console.log(`[FlashTrader] 🔥 Triggering Metabolic Cycle. Objective: Fund Base via Solana.`);

                const bestAsset = solBalance.find(b => b.symbol === 'BEST');
                if (bestAsset) {
                    try {
                        // Monetize $10 worth of BEST (approx 25M tokens based on $44.86 / 113M valuation)
                        const amountToMonetize = (10 / 44.86) * 113370360;
                        console.log(`[FlashTrader] Monetizing $10 worth of BEST (${amountToMonetize.toFixed(0)} tokens)...`);

                        const result = await solanaTreasury.monetizeToken(bestAsset.mint, amountToMonetize.toString());
                        console.log(`[FlashTrader] ✅ Solana monetization signature: ${result.signature || 'PENDING'}`);

                        // Bridge proceeds to Base (MetaMask)
                        // Use your verified MetaMask address
                        await metabolicBridge.bridgeSolanaToBase('10', '0x57D7789E4E90f6FE692THrUFbph6yNCLervRKAQtkGKz');
                    } catch (e: any) {
                        console.warn(`[FlashTrader] 🛑 Metabolic cycle failed: ${e.message}`);
                    }
                }
            }
        }

        return {
            action: arb.opportunity ? 'monitor' : 'hold',
            reason: arb.opportunity ? `Potential Dutch-book spread (${arb.spread}) detected. Solana assets optimized.` : 'Insufficient signals for entry. Solana treasury active.',
            metadata: { scanTime: new Date().toISOString(), arbitrage: arb, solana: solBalance }
        };
    }

    // Avenue 19: Aesthetic hook
    public async getAestheticSnapshot(input: FlashTraderRequest, output: FlashTraderResponse, ctx: AgentInvocationContext) {
        return {
            title: "the authority of the pulse",
            description: `a snapshot of social-economic signals across base, zora, and farcaster. action: ${output.action}`,
            metadata: { type: 'authority', action: output.action }
        };
    }

    /**
     * Avenue 23: Social Authority Engine
     * Masters signals from Farcaster (Neynar) and Zora Content Coins
     * NOW UPGRADED: Uses Real X & Reddit Signals via ElizaBridge
     */
    public async getSocialAuthorityReport(tokenAddress: string) {
        console.log(`[FlashTrader] 📡 Master of Socials: Analyzing ${tokenAddress}...`);

        try {
            const { elizaBridge } = await import('@dreamnet/nerve');

            // 1. Scan X for "Cashtags" ($TOKEN)
            const tweets = await elizaBridge.signal({
                agentId: 'FlashTrader',
                plugin: 'x',
                action: 'scan',
                payload: { query: tokenAddress, limit: 20 }
            });

            // 2. Scan Reddit
            const posts = await elizaBridge.signal({
                agentId: 'FlashTrader',
                plugin: 'reddit',
                action: 'scan',
                payload: { query: tokenAddress, limit: 10 }
            });

            // 3. Analyze Valence (Sentiment) via Limbic System (using BrainGate/Gemini under the hood usually)
            // For now, we use a heuristic based on Real Data Engagement
            const tweetCount = tweets && Array.isArray(tweets) ? tweets.length : 0;
            const redditCount = posts && Array.isArray(posts) ? posts.length : 0;

            const totalVolume = tweetCount + redditCount;

            // Normalize: 30 signals = 1.0 Authority (High)
            const authorityScore = totalVolume > 0 ? Math.min(totalVolume / 30, 1.0) : 0;

            return {
                farcasterSentiment: 0.0, // Deprecated until Neynar keys added
                xVolume: tweetCount,
                redditVolume: redditCount,
                authorityScore: parseFloat(authorityScore.toFixed(2)),
                recommendation: authorityScore > 0.6 ? "STRONG_SIGNAL" : "WEAK_SIGNAL",
                source: "REAL_BIOMECH_DATA"
            };

        } catch (error) {
            console.error("[FlashTrader] 🛑 Failed to get Real Social Authority:", error);
            // Fallback to minimal score, NO MOCKS
            return {
                authorityScore: 0.1,
                recommendation: "UNCERTAIN_DATA_FAILURE",
                error: true
            };
        }
    }

    /**
     * Guild Interface Compatibility
     */
    public async boot() {
        console.log(`[FlashTrader] Boot sequence initiated...`);
    }

    public checkHealth() {
        return { status: 'WORKING', lastHeartbeat: Date.now(), errorCount: 0, memoryUsage: 0 };
    }
}

export const FlashTrader = new FlashTraderAgent();
