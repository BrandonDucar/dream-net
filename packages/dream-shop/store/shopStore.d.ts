import type { DreamShopOffer, ShopStatus } from '../types.js';
export declare const ShopStore: {
    upsertOffer(partial: Omit<DreamShopOffer, "createdAt" | "updatedAt">): DreamShopOffer;
    getOffer(id: string): DreamShopOffer | undefined;
    listOffers(): DreamShopOffer[];
    setLastRunAt(ts: number | null): void;
    status(): ShopStatus;
};
//# sourceMappingURL=shopStore.d.ts.map