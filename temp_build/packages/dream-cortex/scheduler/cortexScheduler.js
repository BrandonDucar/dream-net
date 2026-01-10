"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCortexCycle = runCortexCycle;
exports.cortexStatus = cortexStatus;
const dreamRegistry_1 = require("../store/dreamRegistry");
const intentSynthesizer_1 = require("../logic/intentSynthesizer");
let lastRunAt = null;
let lastDirectives = [];
function runCortexCycle(ctx) {
    const directives = (0, intentSynthesizer_1.synthesizeDirectives)(ctx);
    lastRunAt = Date.now();
    lastDirectives = directives;
    // Optional: send directives into Neural Mesh for long-term planning memory
    if (ctx.neuralMesh?.remember && directives.length) {
        ctx.neuralMesh.remember({
            source: "DreamCortex",
            directives,
            timestamp: lastRunAt,
        });
    }
    return cortexStatus();
}
function cortexStatus() {
    const regStatus = dreamRegistry_1.DreamRegistry.status();
    return {
        lastRunAt,
        dreamCount: regStatus.count,
        directiveCount: lastDirectives.length,
        lastDirectives,
    };
}
