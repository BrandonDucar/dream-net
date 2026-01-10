"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNarrativeCycle = runNarrativeCycle;
exports.narrativeStatus = narrativeStatus;
const narrativeAssembler_1 = require("../logic/narrativeAssembler");
const narrativeStore_1 = require("../store/narrativeStore");
let lastRunAt = null;
function runNarrativeCycle(ctx) {
    const entries = (0, narrativeAssembler_1.assembleNarratives)(ctx);
    entries.forEach((e) => narrativeStore_1.NarrativeStore.add(e));
    lastRunAt = Date.now();
    // Optional: push a compressed digest into Neural Mesh
    if (ctx.neuralMesh?.remember && entries.length) {
        ctx.neuralMesh.remember({
            source: "NarrativeField",
            count: entries.length,
            lastTitles: entries.slice(-5).map((e) => e.title),
            timestamp: lastRunAt,
        });
    }
    return narrativeStatus();
}
function narrativeStatus() {
    const st = narrativeStore_1.NarrativeStore.status();
    return {
        lastRunAt,
        entryCount: st.entryCount,
        recentEntries: st.recentEntries,
    };
}
