import type { ResonanceInsight } from "./types";
export declare function computeResonanceSnapshot(): Promise<ResonanceInsight[]>;
export declare function saveResonanceInsights(insights: ResonanceInsight[]): Promise<void>;
export declare function getRecentInsights(limit?: number): Promise<ResonanceInsight[]>;
