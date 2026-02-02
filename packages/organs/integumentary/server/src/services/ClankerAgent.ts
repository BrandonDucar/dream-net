import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';
import { clankerService } from './ClankerService.js';
import { bondingCurveEngine } from '../../../../nervous/trading-organ/BondingCurveEngine.js';

/**
 * ClankerAgent
 * The agent responsible for bridging social signals from Farcaster
 * to automated token launches on Base.
 */
export class ClankerAgent {
    private static instance: ClankerAgent;

    private constructor() {
        console.log("🛰️ [ClankerAgent] Social Token Bridge active.");
        this.initListeners();
    }

    public static getInstance(): ClankerAgent {
        if (!ClankerAgent.instance) {
            ClankerAgent.instance = new ClankerAgent();
        }
        return ClankerAgent.instance;
    }

    private initListeners() {
        // Listen for agent-led launch requests from Farcaster/Social Hub
        dreamEventBus.subscribe('Social.LaunchRequest', async (envelope: any) => {
            const { agentId, tokenName, symbol, initialLiquidity } = envelope.payload;
            console.log(`[🚀 CLANKER] Received launch request for ${tokenName} (${symbol}) from ${agentId}`);
            await this.igniteToken(agentId, tokenName, symbol, initialLiquidity);
        });

        // Listen for successful births to initialize bonding curves
        dreamEventBus.subscribe('Clanker.TokenBorn', (envelope: any) => {
            const { token, name, symbol, deployer } = envelope.payload;
            console.log(`[👶 CLANKER] Token Born: ${name} at ${token}. Initializing local bonding curve...`);
            bondingCurveEngine.initializeCurve(token);
        });
    }

    /**
     * igniteToken
     * Triggers the Clanker birth sequence.
     */
    public async igniteToken(agentId: string, name: string, symbol: string, liquidity: number) {
        try {
            console.log(`[⚡ CLANKER] Igniting birth for ${name}...`);
            const tokenAddress = await clankerService.deployToken(name, symbol, liquidity);

            dreamEventBus.publish('Clanker.TokenBorn', {
                agentId,
                token: tokenAddress,
                name,
                symbol,
                liquidity,
                timestamp: Date.now()
            });

            return true;
        } catch (error) {
            console.error('[❌ CLANKER] Ignition failed:', error);
            return false;
        }
    }
}

export const clankerAgent = ClankerAgent.getInstance();
