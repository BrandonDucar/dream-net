import { WhaleProduct, WhaleAudience, WhaleContentPlan, WhaleInsight, WhalePackContext, WhalePackStatus } from './types.js';
export declare const WhalePackCore: {
    run(context: WhalePackContext): Promise<WhalePackStatus>;
    status(): WhalePackStatus;
    upsertProduct(product: WhaleProduct): WhaleProduct;
    listProducts(): WhaleProduct[];
    upsertAudience(aud: WhaleAudience): WhaleAudience;
    listAudiences(): WhaleAudience[];
    upsertPlan(plan: WhaleContentPlan): WhaleContentPlan;
    listPlans(): WhaleContentPlan[];
    addInsight(insight: WhaleInsight): WhaleInsight;
    listInsights(): WhaleInsight[];
};
export * from './types.js';
export * from './logic/whaleOutreachCore.js';
export default WhalePackCore;
//# sourceMappingURL=index.d.ts.map