"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFieldDecay = applyFieldDecay;
const fieldStore_1 = require("../store/fieldStore");
function applyFieldDecay(now) {
    const config = fieldStore_1.FieldStore.getConfig();
    const halfLife = config.decayHalfLifeMs;
    if (!halfLife || halfLife <= 0)
        return;
    const all = fieldStore_1.FieldStore.getAllSamples();
    for (const sample of all) {
        const ageMs = now - sample.updatedAt;
        if (ageMs <= 0)
            continue;
        const decayFactor = Math.pow(0.5, ageMs / halfLife);
        const decayedValue = sample.value * decayFactor;
        // We treat values below small epsilon as effectively zero, but keep them in the map for now
        sample.value = decayedValue;
    }
}
