"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFieldCycle = runFieldCycle;
const fieldStore_1 = require("../store/fieldStore");
const fieldDecay_1 = require("../logic/fieldDecay");
const fieldUpdaters_1 = require("../logic/fieldUpdaters");
function runFieldCycle(ctx) {
    const now = Date.now();
    // 1) Apply decay to all fields
    (0, fieldDecay_1.applyFieldDecay)(now);
    // 2) Ingest updates from core systems
    (0, fieldUpdaters_1.updateFieldsFromReputation)(ctx, now);
    (0, fieldUpdaters_1.updateFieldsFromStarBridge)(ctx, now);
    (0, fieldUpdaters_1.updateFieldsFromQAL)(ctx, now);
    (0, fieldUpdaters_1.updateFieldsFromDreamCortex)(ctx, now);
    (0, fieldUpdaters_1.updateFieldsFromWolfPackAndPSL)(ctx, now);
    // 3) Update last run
    fieldStore_1.FieldStore.setLastRunAt(now);
    // 4) Optional: push coarse summary into NeuralMesh
    if (ctx.neuralMesh?.remember) {
        const st = fieldStore_1.FieldStore.status();
        ctx.neuralMesh.remember({
            source: "FieldLayer",
            totalSamples: st.totalSamples,
            timestamp: now,
        });
    }
    return fieldStore_1.FieldStore.status();
}
