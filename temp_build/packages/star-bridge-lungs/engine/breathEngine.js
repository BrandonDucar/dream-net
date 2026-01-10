"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectChainMetrics = collectChainMetrics;
exports.computePressureScore = computePressureScore;
exports.computeBreathSnapshots = computeBreathSnapshots;
exports.getCachedChainMetrics = getCachedChainMetrics;
exports.getLastBreaths = getLastBreaths;
const baseAdapter_1 = require("../adapters/baseAdapter");
const ethereumAdapter_1 = require("../adapters/ethereumAdapter");
const solanaAdapter_1 = require("../adapters/solanaAdapter");
const genericAdapter_1 = require("../adapters/genericAdapter");
let chainMetricsCache = [];
let lastBreathSnapshots = [];
function collectChainMetrics() {
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
                metrics.push((0, baseAdapter_1.getBaseMetrics)());
                break;
            case "ethereum":
                metrics.push((0, ethereumAdapter_1.getEthereumMetrics)());
                break;
            case "solana":
                metrics.push((0, solanaAdapter_1.getSolanaMetrics)());
                break;
            default:
                metrics.push((0, genericAdapter_1.createGenericChainMetrics)(chain));
                break;
        }
    });
    chainMetricsCache = metrics;
    return metrics;
}
async function computePressureScore(from, to, resonance = 1.0) {
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
async function computeBreathSnapshots(metrics) {
    const snapshots = [];
    const now = Date.now();
    // Lazy load to avoid circular deps if any
    const { ResonanceOptimizer } = await Promise.resolve().then(() => __importStar(require("./resonance")));
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
function getCachedChainMetrics() {
    return chainMetricsCache;
}
function getLastBreaths() {
    return lastBreathSnapshots;
}
