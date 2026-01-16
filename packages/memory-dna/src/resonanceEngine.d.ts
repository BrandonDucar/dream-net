import type { ResonanceInsight } from './types.js';
export declare function computeResonanceSnapshot(): Promise<ResonanceInsight[]>;
export declare function saveResonanceInsights(insights: ResonanceInsight[]): Promise<void>;
export declare function getRecentInsights(limit?: number): Promise<ResonanceInsight[]>;
//# sourceMappingURL=resonanceEngine.d.ts.map