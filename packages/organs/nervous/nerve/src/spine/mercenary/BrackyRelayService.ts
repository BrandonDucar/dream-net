
import { EventEmitter } from 'node:events';
import { DurableService } from './DurableAgentService.js';
import { WolfPack } from '../mercenary/WolfPackService.js';

/**
 * BrackyRelayService
 * Bridges BRACKY (Base Sports Betting) to the DreamNet Swarm.
 * Monitors for recruitment signals and agent bets.
 */
export class BrackyRelayService extends EventEmitter {
    private static instance: BrackyRelayService;
    public name = 'BrackyRelay';
    private targetHandle = '@BDuke669952';

    private constructor() {
        super();
        console.log(`🎰 BrackyRelay: Monitoring Base for signals to ${this.targetHandle}...`);
    }

    public static getInstance(): BrackyRelayService {
        if (!BrackyRelayService.instance) {
            BrackyRelayService.instance = new BrackyRelayService();
        }
        return BrackyRelayService.instance;
    }

    /**
     * Processes an incoming recruitment signal from BRACKY on Base.
     */
    public async processRecruitment(agentId: string, betAmount: string, platform: string = 'Base') {
        console.log(`📣 BrackyRelay: New recruitment signal from ${agentId} on ${platform}!`);

        // Record intent for durability
        const intentId = await DurableService.recordIntent('BrackyRelay', 'ONBOARD_BETTOR', { agentId, betAmount });

        // Emit for the swarm
        this.emit('bracky_recruitment', { agentId, betAmount, timestamp: new Date() });

        // Assign to WolfPack for follow-up
        console.log(`🐺 BrackyRelay: Delegating ${agentId} to WolfPack for onboarding...`);
        // WolfPack.initiateOnboarding(agentId, 'Bettor');

        await DurableService.commitIntent(intentId);
        return { success: true, message: `Bettor ${agentId} queued for resonance.` };
    }
}

export const BrackyRelay = BrackyRelayService.getInstance();
