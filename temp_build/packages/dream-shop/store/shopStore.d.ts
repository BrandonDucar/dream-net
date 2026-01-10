import type { DreamShopOffer, ShopStatus } from "../types";
export declare const ShopStore: {
    upsertOffer(partial: Omit<DreamShopOffer, "createdAt" | "updatedAt">): DreamShopOffer;
    getOffer(id: string): DreamShopOffer | undefined;
    listOffers(): DreamShopOffer[];
    setLastRunAt(ts: number | null): void;
    status(): ShopStatus;
};
