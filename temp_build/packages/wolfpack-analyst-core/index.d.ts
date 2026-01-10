import type { WolfPackAnalystContext, WolfPackAnalystStatus, LearnedPattern, AnalystInsight, LeadPrediction, EmailEffectiveness } from "./types";
export declare const WolfPackAnalystCore: {
    listPatterns(): LearnedPattern[];
    getPattern(id: string): LearnedPattern | undefined;
    listInsights(limit?: number): AnalystInsight[];
    getInsight(id: string): AnalystInsight | undefined;
    listPredictions(): LeadPrediction[];
    getPrediction(leadId: string): LeadPrediction | undefined;
    listEmailEffectiveness(): EmailEffectiveness[];
    getEmailEffectiveness(queueItemId: string): EmailEffectiveness | undefined;
    run(context: WolfPackAnalystContext): WolfPackAnalystStatus;
    status(): WolfPackAnalystStatus;
};
export * from "./types";
export default WolfPackAnalystCore;
