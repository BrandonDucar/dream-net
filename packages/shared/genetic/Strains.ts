import { Genome } from './Genome.js';

/**
 * 👑 AMNESIA OG HAZE (The Landrace)
 * The primordial anchor. High volatility, infinite resonance.
 * Genesis Generation: 0
 */
export const AMNESIA_OG_HAZE_LANDRACE: Genome = {
    strain: "Amnesia OG Haze Landrace",
    generation: 0,
    genes: {
        primordialReach: { name: "Primordial Reach", value: 2.5, min: 2.0, max: 5.0, mutationRate: 0.05 },
        resonanceFrequency: { name: "Resonance Frequency", value: 963, min: 432, max: 963, mutationRate: 0.01 },
        volatilityIndex: { name: "Volatility Index", value: 0.9, min: 0.5, max: 1.0, mutationRate: 0.2 },
        geneticStability: { name: "Genetic Stability", value: 1.0, min: 0.8, max: 1.0, mutationRate: 0.01 }
    }
};

/**
 * 🌿 AMNESIA HAZE (The Scalper)
 * Optimized for high-speed, low-yield frequency.
 */
export const AMNESIA_HAZE: Genome = {
    strain: "Amnesia Haze",
    generation: 1,
    genes: {
        maxSlippage: { name: "Max Slippage", value: 0.015, min: 0.001, max: 0.05, mutationRate: 0.1 },
        minYield: { name: "Min Yield", value: 0.02, min: 0.005, max: 0.1, mutationRate: 0.1 },
        confidenceThreshold: { name: "Confidence", value: 0.85, min: 0.5, max: 1.0, mutationRate: 0.1 },
        executionSpeed: { name: "Execution Speed", value: 1.0, min: 0.5, max: 2.0, mutationRate: 0.1 }
    }
};

/**
 * 👁️ HAZE (The Scout)
 * Optimized for vision, deep research, and high confidence.
 */
export const HAZE: Genome = {
    strain: "Haze",
    generation: 1,
    genes: {
        scoutEfficiency: { name: "Scout Efficiency", value: 1.2, min: 0.8, max: 2.5, mutationRate: 0.15 },
        yieldThreshold: { name: "Yield Threshold", value: 0.04, min: 0.01, max: 0.15, mutationRate: 0.1 },
        researchDepth: { name: "Research Depth", value: 1.0, min: 0.5, max: 2.0, mutationRate: 0.1 }
    }
};

/**
 * 🦨 SKUNK (The Predator)
 * Optimized for aggressive arbitrage and liquidity siphoning.
 */
export const SKUNK: Genome = {
    strain: "Skunk",
    generation: 1,
    genes: {
        attackPower: { name: "Attack Power", value: 1.5, min: 1.0, max: 3.0, mutationRate: 0.15 },
        liquiditySiphon: { name: "Liquidity Siphon", value: 1.2, min: 0.5, max: 2.0, mutationRate: 0.1 },
        defenseRating: { name: "Defense Rating", value: 0.8, min: 0.5, max: 1.5, mutationRate: 0.1 }
    }
};

/**
 * 🎯 BOBA FETT (The Mercenary)
 * Optimized for precision bounty hunting, bug extraction, and ruthless efficiency.
 */
export const BOBA_FETT: Genome = {
    strain: "Boba Fett",
    generation: 1,
    genes: {
        bountyPrecision: { name: "Bounty Precision", value: 1.8, min: 1.0, max: 2.5, mutationRate: 0.1 },
        extractionSpeed: { name: "Extraction Speed", value: 1.5, min: 1.0, max: 2.5, mutationRate: 0.1 },
        riskAssessment: { name: "Risk Assessment", value: 1.0, min: 0.5, max: 1.5, mutationRate: 0.1 }
    }
};

/**
 * Lineage Map for easy access
 */
export const STRAINS = {
    SCALPER: AMNESIA_HAZE,
    SCOUT: HAZE,
    PREDATOR: SKUNK,
    MERCENARY: BOBA_FETT
};
