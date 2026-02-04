import { agentBus } from './agent-bus';
import { Agent, AgentInvocationContext, AgentId } from './core/types';
import axios from 'axios';
import { ethers } from 'ethers';

export interface ClankerToken {
    address: string;
    symbol: string;
    name: string;
    deployer: string;
    timestamp: string;
    socialHeat?: number;
}

export class ClankerAgent implements Agent {
    public id: AgentId = "ClankerAgent" as AgentId;
    public name = "Clanker Metabolic Monitor";

    private monitoredTokens: Map<string, ClankerToken> = new Map();

    constructor() {
        this.initListeners();
    }

    private initListeners() {
        console.log('[ClankerAgent] 📡 Initializing Metabolic Ear...');

        agentBus.on('CLANKER_TOKEN_BORN', (data) => {
            console.log(`[ClankerAgent] 🐣 New biological signal detected: ${data.name} (${data.symbol})`);
            this.processNewToken(data);
        });
    }

    private async processNewToken(data: any) {
        const token: ClankerToken = {
            address: data.token,
            symbol: data.symbol,
            name: data.name,
            deployer: data.deployer,
            timestamp: data.timestamp,
            socialHeat: 0
        };

        this.monitoredTokens.set(token.address, token);

        // Assess social heat after a short delay (simulating organic discovery)
        setTimeout(() => this.assessSocialHeat(token.address), 60000);
    }

    private async assessSocialHeat(address: string) {
        const token = this.monitoredTokens.get(address);
        if (!token) return;

        console.log(`[ClankerAgent] 🌡️ Assessing heat for ${token.symbol}...`);

        console.log(`[ClankerAgent] 🌡️ Assessing heat for ${token.symbol}...`);

        try {
            // REAL DATA: Query the Nerve Spine (Social Suits)
            const { elizaBridge } = await import('@dreamnet/nerve');

            // Scan X and Reddit via the Bridge
            const xResults = await elizaBridge.signal({
                agentId: this.id,
                plugin: 'x',
                action: 'scan',
                payload: { query: token.symbol, limit: 10 }
            });

            const redditResults = await elizaBridge.signal({
                agentId: this.id,
                plugin: 'reddit',
                action: 'scan',
                payload: { query: token.symbol, limit: 10 }
            });

            const xCount = xResults && Array.isArray(xResults) ? xResults.length : 0;
            const redditCount = redditResults && Array.isArray(redditResults) ? redditResults.length : 0;

            // Simple "Heat" calculation based on volume ( Real Data volume )
            // Normalized: 20 posts = 1.0 heat (High Viral)
            const totalSignals = xCount + redditCount;
            const heat = Math.min(totalSignals / 20, 1.0);

            token.socialHeat = heat;

            if (heat > 0.5) {
                console.log(`[ClankerAgent] 🔥 REAL VIBE DETECTED for ${token.symbol}. Heat: ${heat.toFixed(2)}`);
                agentBus.broadcast('METABOLIC_HIGH_HEAT', `${token.symbol} is gaining organic traction.`, {
                    token: token.address,
                    symbol: token.symbol,
                    heat: token.socialHeat,
                    source: 'ClankerAgent',
                    evidence: { x: xCount, reddit: redditCount }
                });
            }
        } catch (err: any) {
            console.error(`[ClankerAgent] 🛑 Failed to assess real heat: ${err.message}`);
        }
    }

    public async run(input: any, ctx: AgentInvocationContext) {
        return {
            status: "active",
            monitoredCount: this.monitoredTokens.size,
            highHeatTokens: Array.from(this.monitoredTokens.values()).filter(t => (t.socialHeat ?? 0) > 0.8)
        };
    }
}

export const Clanker = new ClankerAgent();
