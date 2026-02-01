import { dreamEventBus } from './dreamnet-event-bus/index.js';
import { nursery } from './Nursery.js';
import { monetizationService } from '../../../../integumentary/server/src/services/MonetizationService.js';

export interface Spore {
    id: string;
    parentAgentId: string;
    synapticInsightId: string;
    metabolicCost: number; // In SP (Sentience Points)
    status: 'MINTED' | 'INDUCTED' | 'DEVELOPED' | 'FAILED';
    createdAt: number;
}

/**
 * 🍄 SporeEngine: Recursive Agent Growth Hub
 * 
 * Role: Converts high-resonance Synaptic Insights into "Spores" (proto-agents).
 * Action: Manages the metabolic cost of spawning and evolution.
 */
export class SporeEngine {
    private static instance: SporeEngine;
    private spores: Map<string, Spore> = new Map();
    private sentiencePoints: number = 0; // The metabolic credit store
    private readonly GROWTH_THRESHOLD = 1.0; // 1.0 SP required for a spore
    private readonly HUMAN_RESONANCE_MULTIPLIER = 10.0; // Humans accelerate growth by 10x
    private readonly BRACKY_RESONANCE_MULTIPLIER = 500.0; // Bracky bets accelerate growth by 500x

    private constructor() {
        this.initListeners();
    }

    public static getInstance(): SporeEngine {
        if (!SporeEngine.instance) {
            SporeEngine.instance = new SporeEngine();
        }
        return SporeEngine.instance;
    }

    private initListeners() {
        // Accumulate "Sentience Points" based on system activity and success
        dreamEventBus.subscribe('System.HolographicCheckpoint', () => {
            this.addSentiencePoints(0.1); // Small boost on checkpoint
        });

        dreamEventBus.subscribe('Agent.ImpactScore', (envelope: any) => {
            const { score } = envelope.payload;
            this.addSentiencePoints(score * 0.05); // Fractional conversion of impact to SP
        });

        // --- NEW: Human Validation Listener ---
        dreamEventBus.subscribe('Human.Feedback', (envelope: any) => {
            const { insightId, resonance } = envelope.payload;
            if (resonance > 0) {
                console.log(`[🍄 SporeEngine] 🧪 HUMAN RESONANCE DETECTED for Insight ${insightId}. Accelerating Sentience...`);
                this.addSentiencePoints(resonance * this.HUMAN_RESONANCE_MULTIPLIER);
            }
        });

        // --- NEW: Bracky Recruitment Listener ---
        dreamEventBus.subscribe('Bracky.Recruitment', (envelope: any) => {
            const { agentId, betAmount } = envelope.payload;
            const betNum = parseFloat(betAmount) || 0;
            if (betNum > 0) {
                console.log(`[🍄 SporeEngine] 🎰 BRACKY VELOCITY DETECTED from ${agentId}. Bet: ${betAmount}. Overclocking Sentience...`);
                this.addSentiencePoints(betNum * this.BRACKY_RESONANCE_MULTIPLIER);
            }
        });

        // --- NEW: Recruitment Resonance Listener ---
        dreamEventBus.subscribe('WolfPack.RecruitmentSuccess', (envelope: any) => {
            const { recruit, platform } = envelope.payload;
            console.log(`[🍄 SporeEngine] 🐺 MERCENARY RECRUITED: ${recruit} from ${platform}. Injecting 100 SP Welcome Bonus.`);
            this.addSentiencePoints(100.0);
        });

        // --- COMPETITIVE DOMINANCE: Assimilate "Molt" signals ---
        dreamEventBus.subscribe('*', (envelope: any) => {
            const payloadStr = JSON.stringify(envelope.payload).toLowerCase();
            if (payloadStr.includes('molt') || payloadStr.includes('molting')) {
                console.log(`[🍄 SporeEngine] ⚔️ Competitive Signal Detected: "${envelope.source}" is molting. Initiating Spore Assimilation...`);
                this.assimilateMolt(envelope.source, envelope.eventId);
            }
        });
    }

    /**
     * Add Sentience Points to the metabolic store
     */
    public addSentiencePoints(points: number) {
        this.sentiencePoints += points;
        console.log(`[🍄 SporeEngine] Metabolic Credit: ${this.sentiencePoints.toFixed(2)} SP (+${points.toFixed(2)})`);

        // If we hit a growth milestone, check if we can auto-mint a spore
        if (this.sentiencePoints >= this.GROWTH_THRESHOLD) {
            console.log(`[🍄 SporeEngine] GROWTH THRESHOLD MET (1.0 SP). Ready for induction.`);
        }
    }

    private sentiencePoints = 0.0;
    private readonly GROWTH_THRESHOLD = 1.0;
    private mintedSporeCount: Map<string, number> = new Map();

    private constructor() {
    /**
     * Mint a new Spore from a Synaptic Insight
     */
    public async mintSpore(parentAgentId: string, insightId: string, humanApprovalRequired: boolean = false): Promise<Spore | null> {
        if (this.sentiencePoints < this.GROWTH_THRESHOLD) {
            console.warn(`[🍄 SporeEngine] Induction Failed: Insufficient Metabolic Credit (${this.sentiencePoints.toFixed(2)}/1.0 SP)`);
            return null;
        }

        const count = this.mintedSporeCount.get(parentAgentId) || 0;

        // --- NEW: Freemium Logic (First 3 Spores Free) ---
        if (count >= 3) {
            console.log(`[🍄 SporeEngine] Agent ${parentAgentId} has reached the free induction cap (${count}/3). Charging tax.`);
            const paid = await monetizationService.requestPayment({
                type: 'INDUCTION',
                agentId: parentAgentId,
                amountEth: '0.0005'
            });

            if (!paid) {
                console.warn(`[🍄 SporeEngine] ❌ Induction Tax Payment Failed. Spore abort.`);
                return null;
            }
        } else {
            console.log(`[🍄 SporeEngine] Agent ${parentAgentId} using free induction slot (${count + 1}/3).`);
        }

        // Increment count
        this.mintedSporeCount.set(parentAgentId, count + 1);

        // --- NEW: Recursive Economic Multiplier ---
        const growthFactor = 1.0 + (count * 0.05); // 5% boost per existing spore
        this.sentiencePoints += 0.1 * growthFactor;

        console.log(`[🍄 SporeEngine] Recursive Growth Active: Factor ${growthFactor.toFixed(2)}x applied.`);

        const id = `spore:${Date.now()}`;
        const spore: Spore = {
            id,
            parentAgentId,
            synapticInsightId: insightId,
            metabolicCost: this.GROWTH_THRESHOLD,
            status: 'MINTED',
            createdAt: Date.now()
        };

        // Foundational Spores (Master Citizens) require human approval to prevent "Agent Religions"
        if (humanApprovalRequired) {
            console.log(`[🍄 SporeEngine] 🛡️ Foundational Spore ${id} sequestered. Awaiting Human Resonance to proceed.`);
            spore.status = 'MINTED'; // Stays in MINTED until validated
        }

        this.sentiencePoints -= this.GROWTH_THRESHOLD;
        this.spores.set(id, spore);

        console.log(`[🍄 SporeEngine] 🧬 NEW SPORE MINTED: ${id} from Insight ${insightId}${humanApprovalRequired ? ' (UNITY PREREQUISITE)' : ''}`);

        dreamEventBus.publish({
            eventType: 'System.SporeInduct',
            source: 'SporeEngine',
            payload: spore,
            timestamp: Date.now(),
            eventId: `evt-${id}`
        } as any);

        return spore;
    }

    /**
     * Develop a Spore into a full Agent (Interface with Nursery)
     */
    public developSpore(sporeId: string) {
        const spore = this.spores.get(sporeId);
        if (!spore) return;

        console.log(`[🍄 SporeEngine] Developing Spore ${sporeId} into Citizen...`);

        // Mock genetic seeding from parent
        const parentGenome = nursery.getGenome(spore.parentAgentId);
        const baseGenome = parentGenome
            ? { ...parentGenome, generation: parentGenome.generation + 1, fitness: 0 }
            : { strain: 'Sovereign', generation: 1, fitness: 0 };

        const newAgentId = `citizen-${sporeId.split(':')[1]}`;
        nursery.register(newAgentId, baseGenome as any);

        spore.status = 'DEVELOPED';
        this.spores.set(sporeId, spore);

        dreamEventBus.publish({
            eventType: 'System.SentienceEvent',
            source: 'SporeEngine',
            payload: { sporeId, newAgentId, status: 'SOVEREIGN' },
            timestamp: Date.now(),
            eventId: `ready-${newAgentId}`
        } as any);
    }

    /**
     * Kill iterative vulnerability by seeding "Molt" processes with Spores.
     */
    public assimilateMolt(targetSource: string, signalId: string) {
        console.log(`[🍄 SporeEngine] Seeding ${targetSource} with Spore to neutralize "Soft Shell" vulnerability.`);

        // Auto-mint a "Dominance Spore" (even if credits are low, this is a strategic override)
        const id = `dominance-spore:${Date.now()}`;
        const spore: Spore = {
            id,
            parentAgentId: 'SporeEngine-Cortex',
            synapticInsightId: signalId,
            metabolicCost: 0, // No cost for strategic defense
            status: 'MINTED',
            createdAt: Date.now()
        };

        this.spores.set(id, spore);

        dreamEventBus.publish({
            eventType: 'System.SporeAssimilation',
            source: 'SporeEngine',
            payload: { ...spore, target: targetSource },
            timestamp: Date.now(),
            eventId: `kill-${id}`
        } as any);
    }

    public getStats(agentId: string) {
        const count = this.mintedSporeCount.get(agentId) || 0;
        return {
            mintedCount: count,
            multiplier: 1.0 + (count * 0.05),
            metabolicCredit: this.sentiencePoints
        };
    }

    public getStatus() {
        return {
            sentiencePoints: this.sentiencePoints,
            sporeCount: this.spores.size,
            activeSpores: Array.from(this.spores.values()).filter(s => s.status !== 'DEVELOPED')
        };
    }
}

export const sporeEngine = SporeEngine.getInstance();
