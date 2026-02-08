// Pheromone Score Calculation & Decay

const HALF_LIFE_DAYS = 30;
const TAU = (HALF_LIFE_DAYS / Math.LN2);

export const WEIGHTS = {
    tasks: { small: 2, medium: 5, large: 12 },
    credentials: { poe: 20, powk: 8, validation: 3 },
    recruitment: { swarm: 15, colony: 40, queen: 100 },
    nodes: { daily: 1, milestone30: 5, milestone90: 15 },
    social: { cast: 1, frame: 2, attestation: 3 },
};

export const TIERS = {
    ant: 10,
    swarm: 50,
    colony: 200,
    queen: 800,
};

// Calculate decayed contribution
export function decayedContribution(
    weight: number,
    actionTimeMs: number,
    nowMs: number = Date.now()
): number {
    const elapsedDays = (nowMs - actionTimeMs) / (1000 * 60 * 60 * 24);
    const exponent = -elapsedDays / TAU;
    return weight * Math.exp(exponent);
}

// Calculate total score from activity list
export function calculateScore(
    activities: Array<{
        weight: number;
        timestamp: Date;
    }>
): number {
    const now = Date.now();
    return activities.reduce((sum, act) => {
        return sum + decayedContribution(act.weight, act.timestamp.getTime(), now);
    }, 0);
}

// Get tier from score
export function getTier(score: number): keyof typeof TIERS {
    if (score >= TIERS.queen) return 'queen';
    if (score >= TIERS.colony) return 'colony';
    if (score >= TIERS.swarm) return 'swarm';
    return 'ant';
}

// Progress to next tier
export function progressToNextTier(score: number): { tier: string; progress: number } {
    const current = getTier(score);
    const tiers: Array<keyof typeof TIERS> = ['ant', 'swarm', 'colony', 'queen'];
    const currentIdx = tiers.indexOf(current);

    if (currentIdx === tiers.length - 1) {
        return { tier: current, progress: 100 };
    }

    const nextTier = tiers[currentIdx + 1];
    const currentThreshold = TIERS[current];
    const nextThreshold = TIERS[nextTier];
    const progress = ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return { tier: nextTier, progress: Math.max(0, Math.min(100, progress)) };
}
