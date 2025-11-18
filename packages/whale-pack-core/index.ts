import {
  WhaleChannel,
  HookStyle,
  WhalePlanStatus,
  WhaleProduct,
  WhaleAudience,
  WhaleContentPlan,
  WhaleEngagementStats,
  WhaleInsight,
  WhalePackContext,
  WhalePackStatus,
} from "./types";
import { WhaleStore } from "./store/whaleStore";
import { runWhalePackCycle } from "./scheduler/whaleScheduler";

export const WhalePackCore = {
  run(context: WhalePackContext): Promise<WhalePackStatus> {
    return runWhalePackCycle(context);
  },

  status(): WhalePackStatus {
    return WhaleStore.status();
  },

  // Helpers for seeding / manual control
  upsertProduct(product: WhaleProduct): WhaleProduct {
    return WhaleStore.upsertProduct(product);
  },

  listProducts(): WhaleProduct[] {
    return WhaleStore.listProducts();
  },

  upsertAudience(aud: WhaleAudience): WhaleAudience {
    return WhaleStore.upsertAudience(aud);
  },

  listAudiences(): WhaleAudience[] {
    return WhaleStore.listAudiences();
  },

  upsertPlan(plan: WhaleContentPlan): WhaleContentPlan {
    return WhaleStore.upsertPlan(plan);
  },

  listPlans(): WhaleContentPlan[] {
    return WhaleStore.listPlans();
  },

  addInsight(insight: WhaleInsight): WhaleInsight {
    return WhaleStore.addInsight(insight);
  },

  listInsights(): WhaleInsight[] {
    return WhaleStore.listInsights();
  },
};

export * from "./types";
export default WhalePackCore;


