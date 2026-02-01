import { WhaleProduct, WhaleAudience, WhaleContentPlan, WhaleEngagementStats, WhaleInsight, WhalePackStatus } from '../types.js';
export declare const WhaleStore: {
    upsertProduct(product: WhaleProduct): WhaleProduct;
    listProducts(): WhaleProduct[];
    upsertAudience(aud: WhaleAudience): WhaleAudience;
    listAudiences(): WhaleAudience[];
    upsertPlan(plan: WhaleContentPlan): WhaleContentPlan;
    listPlans(): WhaleContentPlan[];
    addEngagement(stats: WhaleEngagementStats): void;
    listEngagementsForPlan(planId: string): WhaleEngagementStats[];
    addInsight(insight: WhaleInsight): WhaleInsight;
    listInsights(): WhaleInsight[];
    setLastRunAt(ts: number | null): void;
    status(): WhalePackStatus;
};
