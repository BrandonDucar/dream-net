import { ShopStore } from "./store/shopStore";
import { runShopCycle } from "./scheduler/shopScheduler";
import { computeRecommendations } from "./logic/shopRecommender";
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
export * from "./types";
export default DreamShop;
