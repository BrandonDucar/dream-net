"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDreamTankCycle = runDreamTankCycle;
const tankStore_1 = require("../store/tankStore");
const progressionEngine_1 = require("../logic/progressionEngine");
function runDreamTankCycle(ctx) {
    const now = Date.now();
    // 1) Run progression & evaluations
    (0, progressionEngine_1.runProgressionCycle)(ctx);
    // 2) Update last run timestamp
    tankStore_1.TankStore.setLastRunAt(now);
    const status = tankStore_1.TankStore.status();
    // 3) Optional: send narrative entries
    if (ctx.narrativeField?.add && status.sampleDreams.length) {
        ctx.narrativeField.add({
            id: `narrative-dreamtank-${now}`,
            timestamp: now,
            title: "Dream Tank progression cycle",
            summary: `Evaluated ${status.dreamCount} incubated dreams.`,
            severity: "info",
            domain: "dream",
            tags: ["dream-tank", "incubator"],
            references: status.sampleDreams.map((d) => ({
                kind: "dream",
                id: d.id,
                label: d.name,
            })),
            meta: { status },
        });
    }
    // 4) Optional: write into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "DreamTankCore",
            dreamCount: status.dreamCount,
            timestamp: now,
        });
    }
    return status;
}
