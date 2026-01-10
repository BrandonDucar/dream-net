import type { DreamShopOffer, OfferRecommendation, ShopContext, ShopStatus } from "./types";
export declare const DreamShop: {
    upsertOffer(offer: Omit<DreamShopOffer, "createdAt" | "updatedAt">): DreamShopOffer;
    getOffer(id: string): DreamShopOffer | undefined;
    listOffers(): DreamShopOffer[];
    recommend(context: ShopContext): OfferRecommendation[];
    run(context: ShopContext): ShopStatus;
    status(): ShopStatus;
};
export * from "./types";
export default DreamShop;
