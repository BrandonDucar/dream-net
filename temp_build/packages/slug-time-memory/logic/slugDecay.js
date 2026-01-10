"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDecay = applyDecay;
const slugMemoryStore_1 = require("../store/slugMemoryStore");
function applyDecay(now, config) {
    const halfLife = config.decayHalfLifeMs;
    if (!halfLife || halfLife <= 0)
        return;
    const snapshots = slugMemoryStore_1.SlugMemoryStore.getSnapshots();
    for (const [key, snapshot] of snapshots.entries()) {
        const ageMs = now - snapshot.lastUpdatedAt;
        if (ageMs <= 0)
            continue;
        // Simple exponential decay based on age / half-life
        const decayFactor = Math.pow(0.5, ageMs / halfLife);
        const decayedAvg = snapshot.avg * decayFactor;
        const decayedCount = snapshot.count * decayFactor;
        if (decayedAvg < 1e-6 && decayedCount < 1e-3) {
            // If effectively zero, we can eventually drop it (but not mandatory now)
            continue;
        }
        snapshots.set(key, {
            ...snapshot,
            avg: decayedAvg,
            count: decayedCount,
        });
    }
}
