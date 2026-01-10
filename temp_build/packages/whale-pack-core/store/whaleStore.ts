import {
  WhaleProduct,
  WhaleAudience,
  WhaleContentPlan,
  WhaleEngagementStats,
  WhaleInsight,
  WhalePackStatus,
} from "../types";

const products: Map<string, WhaleProduct> = new Map();
const audiences: Map<string, WhaleAudience> = new Map();
const plans: Map<string, WhaleContentPlan> = new Map();
const engagements: WhaleEngagementStats[] = [];
const insights: WhaleInsight[] = [];

let lastRunAt: number | null = null;

export const WhaleStore = {
  upsertProduct(product: WhaleProduct): WhaleProduct {
    products.set(product.id, product);
    return product;
  },

  listProducts(): WhaleProduct[] {
    return Array.from(products.values());
  },

  upsertAudience(aud: WhaleAudience): WhaleAudience {
    audiences.set(aud.id, aud);
    return aud;
  },

  listAudiences(): WhaleAudience[] {
    return Array.from(audiences.values());
  },

  upsertPlan(plan: WhaleContentPlan): WhaleContentPlan {
    plans.set(plan.id, plan);
    return plan;
  },

  listPlans(): WhaleContentPlan[] {
    return Array.from(plans.values());
  },

  addEngagement(stats: WhaleEngagementStats) {
    engagements.push(stats);
  },

  listEngagementsForPlan(planId: string): WhaleEngagementStats[] {
    return engagements.filter((e) => e.planId === planId);
  },

  addInsight(insight: WhaleInsight): WhaleInsight {
    insights.push(insight);
    return insight;
  },

  listInsights(): WhaleInsight[] {
    return insights;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): WhalePackStatus {
    const sampleProducts = Array.from(products.values()).slice(0, 10);
    const sampleAudiences = Array.from(audiences.values()).slice(0, 10);
    const allPlans = Array.from(plans.values());
    const samplePlans = allPlans.slice(0, 20);
    const postedCount = allPlans.filter((p) => p.status === "posted").length;
    const sampleInsights = insights.slice(0, 20);

    return {
      lastRunAt,
      productCount: products.size,
      audienceCount: audiences.size,
      planCount: allPlans.length,
      postedCount,
      insightCount: insights.length,
      sampleProducts,
      sampleAudiences,
      samplePlans,
      sampleInsights,
    };
  },
};


