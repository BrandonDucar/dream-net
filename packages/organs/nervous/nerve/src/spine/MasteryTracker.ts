import { dreamEventBus } from './dreamnet-event-bus/index.js';

export interface MasteryProgress {
    domain: string;
    level: number;
    experience: number;
    unlockedSkills: string[];
    lastUpdated: number;
}

export class MasteryTracker {
    private static instance: MasteryTracker;
    private progress: Map<string, Map<string, MasteryProgress>> = new Map(); // agentId -> domain -> progress

    private constructor() {
        this.listenForPerformance();
    }

    public static getInstance(): MasteryTracker {
        if (!MasteryTracker.instance) {
            MasteryTracker.instance = new MasteryTracker();
        }
        return MasteryTracker.instance;
    }

    /**
     * Updates an agent's mastery in a specific domain.
     */
    public async recordProgress(agentId: string, domain: string, expGain: number) {
        if (!this.progress.has(agentId)) {
            this.progress.set(agentId, new Map());
        }

        const agentMastery = this.progress.get(agentId)!;
        let current = agentMastery.get(domain);

        if (!current) {
            current = {
                domain,
                level: 1,
                experience: 0,
                unlockedSkills: [],
                lastUpdated: Date.now()
            };
        }

        current.experience += expGain;
        current.lastUpdated = Date.now();

        // Level up logic (Simple exponential curve)
        const nextLevelExp = Math.pow(current.level, 2) * 100;
        if (current.experience >= nextLevelExp) {
            current.level++;
            console.log(`[🎓 Mastery] Agent ${agentId} LEVELED UP in ${domain} to Level ${current.level}!`);

            dreamEventBus.publish({
                type: 'Mastery.LevelUp',
                payload: { agentId, domain, level: current.level },
                source: 'MASTERY_TRACKER'
            });
        }

        agentMastery.set(domain, current);
    }

    private listenForPerformance() {
        // Listen for Impact scores to drive mastery in relevant domains
        dreamEventBus.subscribe('Agent.ImpactScore', (envelope: any) => {
            const { agentId, score, domain } = envelope.payload;
            // Map impact to mastery domains (Default to 'General' if not specified)
            const targetDomain = domain || 'General Sovereignty';
            this.recordProgress(agentId, targetDomain, score * 10).catch(console.error);
        });

        // Listen for research completions
        dreamEventBus.subscribe('Mastery.ResearchCompleted', (envelope: any) => {
            const { agentId, domain, skill } = envelope.payload;
            this.unlockSkill(agentId, domain, skill).catch(console.error);
        });
    }

    private async unlockSkill(agentId: string, domain: string, skill: string) {
        const agentMastery = this.progress.get(agentId);
        if (agentMastery && agentMastery.has(domain)) {
            const current = agentMastery.get(domain)!;
            if (!current.unlockedSkills.includes(skill)) {
                current.unlockedSkills.push(skill);
                console.log(`[🎓 Mastery] Agent ${agentId} UNLOCKED skill: ${skill} in ${domain}`);

                dreamEventBus.publish({
                    type: 'Mastery.SkillUnlocked',
                    payload: { agentId, domain, skill },
                    source: 'MASTERY_TRACKER'
                });
            }
        }
    }

    public getMastery(agentId: string, domain?: string) {
        if (domain) {
            return this.progress.get(agentId)?.get(domain);
        }
        return this.progress.get(agentId);
    }
}

export const masteryTracker = MasteryTracker.getInstance();
