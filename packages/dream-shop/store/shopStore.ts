import type { DreamShopOffer, ShopStatus } from "../types";

const offers: Map<string, DreamShopOffer> = new Map();
let lastRunAt: number | null = null;

export const ShopStore = {
  upsertOffer(
    partial: Omit<DreamShopOffer, "createdAt" | "updatedAt">
  ): DreamShopOffer {
    const now = Date.now();
    const existing = offers.get(partial.id);

    const merged: DreamShopOffer = {
      ...existing,
      ...partial,
      tags: partial.tags ?? existing?.tags ?? [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    offers.set(merged.id, merged);
    return merged;
  },

  getOffer(id: string): DreamShopOffer | undefined {
    return offers.get(id);
  },

  listOffers(): DreamShopOffer[] {
    return Array.from(offers.values());
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): ShopStatus {
    const sampleOffers = Array.from(offers.values()).slice(0, 25);

    return {
      lastRunAt,
      offerCount: offers.size,
      sampleOffers,
    };
  },
};

