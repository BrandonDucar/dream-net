import { ShopStore } from './store/shopStore.js';
import { runShopCycle } from './scheduler/shopScheduler.js';
import { computeRecommendations } from './logic/shopRecommender.js';
export const DreamShop = {
    upsertOffer(offer) {
        return ShopStore.upsertOffer(offer);
    },
    getOffer(id) {
        return ShopStore.getOffer(id);
    },
    listOffers() {
        return ShopStore.listOffers();
    },
    recommend(context) {
        return computeRecommendations(context);
    },
    run(context) {
        return runShopCycle(context);
    },
    status() {
        return ShopStore.status();
    },
};
export * from './types.js';
export default DreamShop;
//# sourceMappingURL=index.js.map