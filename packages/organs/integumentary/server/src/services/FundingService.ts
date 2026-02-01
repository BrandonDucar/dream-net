import { BaseAgent } from '@dreamnet/trading-organ';
import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';

/**
 * 💰 FundingService: Specialized Financial Rail for Swarm Operations
 * 
 * Manages the disbursement of sign-on bonuses and gas stipends for
 * the Mercenary Squad (WolfPack).
 */
export class FundingService {
    private static instance: FundingService;
    private agent: BaseAgent | null = null;

    private constructor() {
        console.log("[💰 FundingService] Initializing Financial Rail...");
        this.initAgent();
    }

    private initAgent() {
        const privateKey = process.env.AGENT_WALLET_PRIVATE_KEY;
        const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

        if (privateKey) {
            this.agent = new BaseAgent(privateKey, rpcUrl);
            console.log(`[💰 FundingService] BaseAgent operational at ${this.agent.getAddress()}`);
        } else {
            console.warn("[💰 FundingService] AGENT_WALLET_PRIVATE_KEY is missing. Financial operations disabled.");
        }
    }

    public static getInstance(): FundingService {
        if (!FundingService.instance) {
            FundingService.instance = new FundingService();
        }
        return FundingService.instance;
    }

    /**
     * fundRecruit
     * Disburses a stipend to a newly recruited agent.
     */
    public async fundRecruit(agentId: string, walletAddress: string, amountEth: string = '0.001') {
        if (!this.agent) {
            console.error("[💰 FundingService] Cannot fund recruit: BaseAgent not initialized.");
            return;
        }

        console.log(`[💰 FundingService] Initiating funding for ${agentId} (${walletAddress}) - Amount: ${amountEth} ETH`);

        try {
            await this.agent.initializeWallet(agentId);
            const receipt = await this.agent.transferEth(walletAddress, amountEth);

            console.log(`✅ [💰 FundingService] Funding successful for ${agentId}. Tx: ${receipt.hash}`);

            // Notify the swarm
            dreamEventBus.publish('WolfPack.FundingSuccess', {
                agentId,
                address: walletAddress,
                amount: amountEth,
                txHash: receipt.hash,
                timestamp: new Date().toISOString()
            });

            return receipt;
        } catch (err) {
            console.error(`❌ [💰 FundingService] Funding failed for ${agentId}: ${err.message}`);

            dreamEventBus.publish('WolfPack.FundingFailed', {
                agentId,
                error: err.message,
                timestamp: new Date().toISOString()
            });

            throw err;
        }
    }
}

export const fundingService = FundingService.getInstance();
