import { EventEmitter } from 'events';

export interface ActionWeight {
    type: string;
    weight: number;
}

export interface PheromoneScent {
    wallet: string;
    score: number;
    lastUpdate: number;
}

export class PheromoneService extends EventEmitter {
    private scents: Map<string, PheromoneScent> = new Map();
    private readonly HALF_LIFE_SEC = 30 * 24 * 60 * 60; // 30 days
    private readonly DECAY_CONSTANT = Math.LN2 / this.HALF_LIFE_SEC;

    private actionWeights: ActionWeight[] = [
        // Tasks
        { type: 'TASK_SMALL', weight: 2.0 },
        { type: 'TASK_MEDIUM', weight: 5.0 },
        { type: 'TASK_LARGE', weight: 12.0 },
        // Credentials
        { type: 'CRED_POE', weight: 20.0 },
        { type: 'CRED_POWK', weight: 8.0 },
        { type: 'CRED_VALIDATION', weight: 3.0 },
        // Recruitment
        { type: 'RECRUIT_SWARM', weight: 15.0 },
        { type: 'RECRUIT_COLONY', weight: 40.0 },
        { type: 'RECRUIT_QUEEN', weight: 100.0 },
        // Nodes
        { type: 'NODE_UPTIME_DAY', weight: 1.0 },
        // Social
        { type: 'SOCIAL_CAST', weight: 1.0 },
        { type: 'SOCIAL_FRAME', weight: 2.0 },
        { type: 'SOCIAL_ATTESTATION', weight: 3.0 },
    ];

    constructor() {
        super();
        console.log('🧬 [Pheromone] Scent Registry Initialized (Time-Decay Active)');
    }

    /**
     * Calculates current score with decay
     */
    public getScore(wallet: string): number {
        const scent = this.scents.get(wallet);
        if (!scent) return 0;

        const now = Date.now() / 1000;
        const elapsed = now - scent.lastUpdate;
        return scent.score * Math.exp(-this.DECAY_CONSTANT * elapsed);
    }

    /**
     * Adds new activity signal
     */
    public addActivity(wallet: string, type: string) {
        const weight = this.actionWeights.find(w => w.type === type)?.weight || 0.1;
        const currentScore = this.getScore(wallet);

        this.scents.set(wallet, {
            wallet,
            score: currentScore + weight,
            lastUpdate: Date.now() / 1000
        });

        console.log(`[Pheromone] Scent added for ${wallet}: +${weight} (${type})`);
        this.emit('scent_updated', { wallet, score: currentScore + weight });
    }

    /**
     * Identifies Elite Tiers (Ant -> Swarm -> Colony -> Queen)
     */
    public getTier(wallet: string): string {
        const score = this.getScore(wallet);
        if (score >= 800) return 'QUEEN';
        if (score >= 200) return 'COLONY';
        if (score >= 50) return 'SWARM';
        if (score >= 10) return 'ANT';
        return 'LARVA';
    }
}

export const pheromoneService = new PheromoneService();
