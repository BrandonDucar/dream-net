"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldStore = void 0;
const fieldMap = new Map();
let config = {
    decayHalfLifeMs: 1000 * 60 * 60, // 1 hour by default
    smoothingFactor: 0.5,
};
let lastRunAt = null;
function keyFor(field, point) {
    return `${field}:${point.kind}:${point.id}`;
}
exports.FieldStore = {
    configure(partial) {
        config = { ...config, ...partial };
    },
    getConfig() {
        return config;
    },
    upsertSample(field, point, value, updatedAt) {
        const key = keyFor(field, point);
        const existing = fieldMap.get(key);
        let finalValue = value;
        if (existing) {
            // Smooth between existing and new value
            const alpha = config.smoothingFactor;
            finalValue = alpha * value + (1 - alpha) * existing.value;
        }
        const sample = {
            field,
            point,
            value: finalValue,
            updatedAt,
        };
        fieldMap.set(key, sample);
    },
    getSample(field, point) {
        return fieldMap.get(keyFor(field, point));
    },
    getAllSamples() {
        return Array.from(fieldMap.values());
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
        const all = Array.from(fieldMap.values());
        const samplePreview = all.slice(0, 50);
        return {
            lastRunAt,
            totalSamples: all.length,
            samplePreview,
        };
    },
};
