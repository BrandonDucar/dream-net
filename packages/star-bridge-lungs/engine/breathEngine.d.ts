import type { ChainBreathMetrics, BreathSnapshot } from "../types";
export declare function collectChainMetrics(): ChainBreathMetrics[];
export declare function computeBreathSnapshots(metrics: ChainBreathMetrics[]): BreathSnapshot[];
export declare function getCachedChainMetrics(): ChainBreathMetrics[];
export declare function getLastBreaths(): BreathSnapshot[];
