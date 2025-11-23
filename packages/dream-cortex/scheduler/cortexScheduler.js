import { DreamRegistry } from "../store/dreamRegistry";
import { synthesizeDirectives } from "../logic/intentSynthesizer";
let lastRunAt = null;
let lastDirectives = [];
export function runCortexCycle(ctx) {
    const directives = synthesizeDirectives(ctx);
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
export function cortexStatus() {
    const regStatus = DreamRegistry.status();
    return {
        lastRunAt,
        dreamCount: regStatus.count,
        directiveCount: lastDirectives.length,
        lastDirectives,
    };
}
