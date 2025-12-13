# Dream Shop - Complete Documentation

**Package**: `@dreamnet/dream-shop`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Dream Shop provides a **marketplace system** for DreamNet offers and recommendations. It manages offers (blueprints, rituals, templates, tools, token utilities) linked to DreamVault items, with pricing (free, fiat, token, points, off-chain notes) and recommendation scoring based on trust hints and freshness.

### Key Features

- **Offer Management**: Create, update, and manage marketplace offers
- **Vault Integration**: Offers linked to DreamVault items
- **Flexible Pricing**: Support for free, fiat, token, points, and off-chain notes
- **Recommendation Engine**: Score-based recommendations using trust hints and freshness
- **Reputation Integration**: Sync trust hints with Reputation Lattice
- **Category System**: Organize offers by category (blueprint, ritual, template, tool, etc.)

---

## Architecture

### How It Works

```
Offer Creation → Vault Linking → Trust Hint Sync → Recommendation Scoring → Offer Listing
```

1. **Offer Creation**: Create offer linked to DreamVault item
2. **Vault Linking**: Offer references `vaultItemId` from DreamVault
3. **Trust Hint Sync**: Trust hints synced from Reputation Lattice
4. **Recommendation Scoring**: Recommendations scored by trust + freshness
5. **Offer Listing**: Offers listed with state filtering (draft, listed, hidden, retired)

### Why This Design

- **Vault Integration**: Links to DreamVault for item management
- **Flexible Pricing**: Supports multiple payment methods
- **Trust-Based**: Trust hints enable reputation-based recommendations
- **Freshness**: Newer offers get slight boost in recommendations
- **State Management**: State system enables lifecycle management

---

## API Reference

### Types

```typescript
export type PriceKind =
  | "free"
  | "fiat"
  | "token"
  | "points"
  | "off-chain-note";

export interface PriceTag {
  kind: PriceKind;
  amount?: number;          // Optional numeric amount
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
  id: string;                 // Offer id
  vaultItemId: string;        // Links to DreamVault item
  title: string;
  description?: string;
  category: OfferCategory;
  state: OfferState;
  price: PriceTag;
  tags?: string[];
  trustHint?: number;         // 0–1, enriched by ReputationLattice
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
```

### Functions

#### `upsertOffer(offer: Omit<DreamShopOffer, "createdAt" | "updatedAt">): DreamShopOffer`

Create or update an offer.

**Example**:
```typescript
import { DreamShop } from "@dreamnet/dream-shop";

const offer = DreamShop.upsertOffer({
  id: "offer:blueprint-123",
  vaultItemId: "vault:blueprint-123",
  title: "DreamNet Architecture Blueprint",
  description: "Complete architecture blueprint for DreamNet",
  category: "blueprint",
  state: "listed",
  price: {
    kind: "token",
    amount: 100,
    currency: "SHEEP",
  },
  tags: ["architecture", "blueprint"],
  ownerIdentityId: "identity:user-123",
});
```

#### `getOffer(id: string): DreamShopOffer | undefined`

Get offer by ID.

#### `listOffers(): DreamShopOffer[]`

List all offers.

#### `recommend(context: ShopContext): OfferRecommendation[]`

Get offer recommendations.

**Example**:
```typescript
const recommendations = DreamShop.recommend({
  dreamVault: DreamVault,
  reputationLattice: ReputationLattice,
});

recommendations.forEach(rec => {
  const offer = DreamShop.getOffer(rec.offerId);
  console.log(`${offer?.title}: ${rec.score} (${rec.reason})`);
});
```

#### `run(context: ShopContext): ShopStatus`

Run shop cycle (syncs trust hints, updates recommendations).

**Example**:
```typescript
const status = DreamShop.run({
  dreamVault: DreamVault,
  reputationLattice: ReputationLattice,
});
```

#### `status(): ShopStatus`

Get current shop status.

---

## Integration Points

### Consumes

- **DreamVault**: Links offers to vault items
- **Reputation Lattice**: Syncs trust hints for recommendations
- **Identity Grid**: Owner identity IDs

### Produces

- **Offers**: Marketplace offers
- **Recommendations**: Scored offer recommendations

### Integration Pattern

```typescript
// Offer creation flow
DreamVault.upsertItem({...})
  → DreamShop.upsertOffer({
      vaultItemId: item.id,
      ...
    })
  → ReputationLattice.getScore(ownerIdentityId)
  → Trust hint synced
  → Recommendations updated
```

---

## Usage Examples

### Create Offer

```typescript
import { DreamShop } from "@dreamnet/dream-shop";

// Free offer
const freeOffer = DreamShop.upsertOffer({
  id: "offer:free-template",
  vaultItemId: "vault:template-123",
  title: "Free Template",
  category: "template",
  state: "listed",
  price: {
    kind: "free",
  },
});

// Token-priced offer
const tokenOffer = DreamShop.upsertOffer({
  id: "offer:premium-blueprint",
  vaultItemId: "vault:blueprint-456",
  title: "Premium Blueprint",
  category: "blueprint",
  state: "listed",
  price: {
    kind: "token",
    amount: 500,
    currency: "SHEEP",
  },
  ownerIdentityId: "identity:user-123",
});
```

### Get Recommendations

```typescript
// Get recommendations
const recommendations = DreamShop.recommend({
  dreamVault: DreamVault,
  reputationLattice: ReputationLattice,
});

// Display top recommendations
recommendations.slice(0, 10).forEach(rec => {
  const offer = DreamShop.getOffer(rec.offerId);
  console.log(`${offer?.title}: ${rec.score.toFixed(2)}`);
});
```

### List Offers

```typescript
// List all offers
const allOffers = DreamShop.listOffers();

// Filter by category
const blueprints = allOffers.filter(o => o.category === "blueprint");

// Filter by state
const listedOffers = allOffers.filter(o => o.state === "listed");
```

---

## Best Practices

1. **Vault Linking**: Always link offers to DreamVault items
2. **Trust Hints**: Use Reputation Lattice to sync trust hints
3. **Pricing**: Use appropriate price kind for offer type
4. **State Management**: Use state system for lifecycle management
5. **Tags**: Add relevant tags for discoverability

---

## Security Considerations

- **Owner Verification**: Verify owner identity IDs exist in IdentityGrid
- **Vault Validation**: Validate vault items exist before creating offers
- **Price Validation**: Validate price amounts and currencies
- **Trust Hints**: Trust hints should come from Reputation Lattice, not user input

---

## Related Systems

- **DreamVault**: Provides vault items
- **Reputation Lattice**: Provides trust scores
- **Identity Grid**: Provides identity IDs
- **Economic Engine Core**: Handles token payments

---

**Status**: ✅ Complete  
**Phase 1 Complete**: 10/10 packages documented ✅
