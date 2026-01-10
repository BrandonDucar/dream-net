export type PriceKind = "free" | "fiat" | "token" | "points" | "off-chain-note";
export interface PriceTag {
    kind: PriceKind;
    amount?: number;
    currency?: string;
    note?: string;
}
export type OfferState = "draft" | "listed" | "hidden" | "retired";
export type OfferCategory = "blueprint" | "ritual" | "template" | "tool" | "token-utility" | "zen-garden" | "dreambet" | "other";
export interface DreamShopOffer {
    id: string;
    vaultItemId: string;
    title: string;
    description?: string;
    category: OfferCategory;
    state: OfferState;
    price: PriceTag;
    tags?: string[];
    trustHint?: number;
    ownerIdentityId?: string;
    createdAt: number;
    updatedAt: number;
}
export interface OfferRecommendation {
    offerId: string;
    score: number;
    reason?: string;
}
export interface ShopContext {
    dreamVault?: any;
    identityGrid?: any;
    reputationLattice?: any;
    dreamCortex?: any;
    neuralMesh?: any;
}
export interface ShopStatus {
    lastRunAt: number | null;
    offerCount: number;
    sampleOffers: DreamShopOffer[];
}
//# sourceMappingURL=types.d.ts.map