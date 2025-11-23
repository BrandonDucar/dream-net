const offers = new Map();
let lastRunAt = null;
export const ShopStore = {
    upsertOffer(partial) {
        const now = Date.now();
        const existing = offers.get(partial.id);
        const merged = {
            ...existing,
            ...partial,
            tags: partial.tags ?? existing?.tags ?? [],
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        offers.set(merged.id, merged);
        return merged;
    },
    getOffer(id) {
        return offers.get(id);
    },
    listOffers() {
        return Array.from(offers.values());
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const sampleOffers = Array.from(offers.values()).slice(0, 25);
        return {
            lastRunAt,
            offerCount: offers.size,
            sampleOffers,
        };
    },
};
