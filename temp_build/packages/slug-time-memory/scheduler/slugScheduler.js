"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSlugTimeCycle = runSlugTimeCycle;
exports.slugTimeStatus = slugTimeStatus;
const slugMemoryStore_1 = require("../store/slugMemoryStore");
const slugAggregator_1 = require("../logic/slugAggregator");
const slugDecay_1 = require("../logic/slugDecay");
let lastRunAt = null;
function runSlugTimeCycle(ctx) {
    const now = Date.now();
    const config = slugMemoryStore_1.SlugMemoryStore.getConfig();
    // 1) Aggregate raw samples into snapshots
    (0, slugAggregator_1.recomputeSnapshots)(now);
    // 2) Apply decay to snapshots so old data matters less
    (0, slugDecay_1.applyDecay)(now, config);
    lastRunAt = now;
    // 3) Optional: push a summary into Neural Mesh
    if (ctx.neuralMesh?.remember) {
        const status = slugMemoryStore_1.SlugMemoryStore.status();
        ctx.neuralMesh.remember({
            source: "SlugTimeMemory",
            status,
            timestamp: now,
        });
    }
    return slugTimeStatus();
}
function slugTimeStatus() {
    const storeStatus = slugMemoryStore_1.SlugMemoryStore.status();
    return {
        lastRunAt,
        totalSamples: storeStatus.totalSamples,
        snapshotCount: storeStatus.snapshotCount,
    };
}
