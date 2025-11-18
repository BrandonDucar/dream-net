export type PriceKind =
  | "free"
  | "fiat"
  | "token"
  | "points"
  | "off-chain-note";

export interface PriceTag {
  kind: PriceKind;
  amount?: number;          // optional numeric amount
  currency?: string;        // "USD", "USDC", "SHEEP", "FLBY", etc.
  note?: string;            // e.g. "TBD at launch", "intro pricing"
}

export type OfferState =
  | "draft"
  | "listed"
  | "hidden"
  | "retired";

export type OfferCategory =
  | "blueprint"
  | "ritual"
  | "template"
  | "tool"
  | "token-utility"
  | "zen-garden"
  | "dreambet"
  | "other";

export interface DreamShopOffer {
  id: string;                 // offer id
  vaultItemId: string;        // links to DreamVault item
  title: string;
  description?: string;
  category: OfferCategory;
  state: OfferState;
  price: PriceTag;
  tags?: string[];

  // Reputation / ranking hint (0–1); can be enriched by ReputationLattice
  trustHint?: number;

  // Optional owner / creator identity
  ownerIdentityId?: string;   // IdentityGrid node id

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

