import { getBaseMetrics } from '../adapters/baseAdapter.js';
import { getEthereumMetrics } from '../adapters/ethereumAdapter.js';
import { getSolanaMetrics } from '../adapters/solanaAdapter.js';
import { createGenericChainMetrics } from '../adapters/genericAdapter.js';
let chainMetricsCache = [];
let lastBreathSnapshots = [];
export function collectChainMetrics() {
    const chains = [
        "base",
        "ethereum",
        "solana",
        "polygon",
        "arbitrum",
        "avalanche",
        "near",
        "monad",
    ];
    const metrics = [];
    chains.forEach((chain) => {
        switch (chain) {
            case "base":
                metrics.push(getBaseMetrics());
                break;
            case "ethereum":
                metrics.push(getEthereumMetrics());
                break;
            case "solana":
                metrics.push(getSolanaMetrics());
                break;
            default:
                metrics.push(createGenericChainMetrics(chain));
                break;
        }
    });
    chainMetricsCache = metrics;
    return metrics;
}
export async function computePressureScore(from, to, resonance = 1.0) {
    // Simple heuristic:
    // prefer high reliability and lower congestion/gas pressure on destination
    const reliabilityFactor = to.reliability;
    const congestionFactor = 1 - to.congestion;
    const gasFactor = 1 - to.gasPressure;
    const baseScore = (reliabilityFactor + congestionFactor + gasFactor) / 3;
    // penalize if from-chain liquidity pressure is very low
    const liquidityPenalty = from.liquidityPressure < 0.2 ? 0.2 : 0;
    // Apply Social Resonance Multiplier ("The Voice")
    // If the destination is "Resonant", we push harder.
    return Math.max(0, Math.min(1, (baseScore - liquidityPenalty) * resonance));
}
export async function computeBreathSnapshots(metrics) {
    const snapshots = [];
    const now = Date.now();
    // Lazy load to avoid circular deps if any
    const { ResonanceOptimizer } = await import('./resonance.js');
    for (const from of metrics) {
        for (const to of metrics) {
            if (from.chain === to.chain)
                continue;
            // Get Social Resonance for Destination
            const resonance = await ResonanceOptimizer.getResonance(to.chain);
            const inhaleScore = await computePressureScore(to, from, resonance.resonanceScore); // value flowing back in
            const exhaleScore = await computePressureScore(from, to, resonance.resonanceScore); // value flowing outward
            const inhale = {
                id: `inhale-${from.chain}-${to.chain}-${now}`,
                fromChain: to.chain,
                toChain: from.chain,
                direction: "inhale",
                pressureScore: inhaleScore,
                recommended: inhaleScore > 0.5,
                createdAt: now,
                meta: {
                    note: "Inbound breath (liquidity/value moving toward target chain)",
                    resonance: resonance.resonanceScore.toFixed(2)
                },
            };
            const exhale = {
                id: `exhale-${from.chain}-${to.chain}-${now}`,
                fromChain: from.chain,
                toChain: to.chain,
                direction: "exhale",
                pressureScore: exhaleScore,
                recommended: exhaleScore > 0.5,
                createdAt: now,
                meta: {
                    note: "Outbound breath (liquidity/value moving away from source chain)",
                    resonance: resonance.resonanceScore.toFixed(2)
                },
            };
            snapshots.push(inhale, exhale);
        }
    }
    lastBreathSnapshots = snapshots;
    return snapshots;
}
export function getCachedChainMetrics() {
    return chainMetricsCache;
}
export function getLastBreaths() {
    return lastBreathSnapshots;
}
//# sourceMappingURL=breathEngine.js.map