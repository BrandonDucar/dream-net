import type { ChainBreathMetrics, BreathSnapshot } from "../types";
export declare function collectChainMetrics(): ChainBreathMetrics[];
export declare function computePressureScore(from: ChainBreathMetrics, to: ChainBreathMetrics, resonance?: number): Promise<number>;
export declare function computeBreathSnapshots(metrics: ChainBreathMetrics[]): Promise<BreathSnapshot[]>;
export declare function getCachedChainMetrics(): ChainBreathMetrics[];
export declare function getLastBreaths(): BreathSnapshot[];
