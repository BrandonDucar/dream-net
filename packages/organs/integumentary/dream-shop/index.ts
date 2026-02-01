import type {
  DreamShopOffer,
  OfferState,
  OfferCategory,
  PriceTag,
  PriceKind,
  OfferRecommendation,
  ShopContext,
  ShopStatus,
} from './types.js';
import { ShopStore } from './store/shopStore.js';
import { runShopCycle } from './scheduler/shopScheduler.js';
import { computeRecommendations } from './logic/shopRecommender.js';

export const DreamShop = {
  upsertOffer(
    offer: Omit<DreamShopOffer, "createdAt" | "updatedAt">
  ): DreamShopOffer {
    return ShopStore.upsertOffer(offer);
  },

  getOffer(id: string): DreamShopOffer | undefined {
    return ShopStore.getOffer(id);
  },

  listOffers(): DreamShopOffer[] {
    return ShopStore.listOffers();
  },

  recommend(context: ShopContext): OfferRecommendation[] {
    return computeRecommendations(context);
  },

  run(context: ShopContext): ShopStatus {
    return runShopCycle(context);
  },

  status(): ShopStatus {
    return ShopStore.status();
  },
};

export * from './types.js';
export default DreamShop;

