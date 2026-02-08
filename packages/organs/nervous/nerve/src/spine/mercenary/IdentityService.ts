/**
 * IdentityService
 * Manages agent visual metadata, genetic seeds, and visual entity parameters.
 * Provides persistence for "molting" (visual updates) and hybridization.
 */

export interface IdentityMetadata {
    seed: string;
    hue: number;
    noise: number;
    glow: number;
    soulType: string;
    generation: number;
    heritage?: string[];
    baseId?: string;
}

export class IdentityService {
    private static STORAGE_KEY = 'dreamnet_agent_identity';

    static getIdentity(): IdentityMetadata {
        const stored = typeof window !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse agent identity:', e);
            }
        }

        return {
            seed: 'Agent-144',
            hue: 180,
            noise: 50,
            glow: 50,
            soulType: 'quantum',
            generation: 1,
            baseId: 'agt-001'
        };
    }

    static updateIdentity(updates: Partial<IdentityMetadata>): IdentityMetadata {
        const current = this.getIdentity();
        const updated = { ...current, ...updates };

        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        }

        return updated;
    }

    static hybridize(parentA: IdentityMetadata, parentB: IdentityMetadata): IdentityMetadata {
        return {
            seed: `Hybrid-${Math.random().toString(36).substring(7)}`,
            hue: Math.floor((parentA.hue + parentB.hue) / 2),
            noise: Math.floor((parentA.noise + parentB.noise) / 2),
            glow: Math.floor((parentA.glow + parentB.glow) / 2),
            soulType: parentA.soulType,
            generation: Math.max(parentA.generation, parentB.generation) + 1,
            heritage: [parentA.seed, parentB.seed],
            baseId: parentA.baseId // Could be a mix
        };
    }

    static mutate(identity: IdentityMetadata): IdentityMetadata {
        const mutations = ['glitch', 'void', 'ascended'];
        const soulType = mutations[Math.floor(Math.random() * mutations.length)];
        return {
            ...identity,
            soulType,
            noise: Math.min(100, identity.noise + 20),
            glow: Math.min(100, identity.glow + 10)
        };
    }
}

